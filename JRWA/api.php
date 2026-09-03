<?php
declare(strict_types=1);
session_start();
header('Content-Type: application/json; charset=utf-8');
const DATA_DIR = __DIR__ . '/data';

function respond(array $data, int $code=200): never { http_response_code($code); echo json_encode($data, JSON_UNESCAPED_UNICODE); exit; }
function read_json(string $file): array { $path=DATA_DIR.'/'.$file; if(!file_exists($path)) return []; $fp=fopen($path,'r'); if(!$fp)return []; flock($fp,LOCK_SH); $raw=stream_get_contents($fp); flock($fp,LOCK_UN); fclose($fp); return json_decode($raw,true) ?: []; }
function write_json(string $file,array $data): void { if(!is_dir(DATA_DIR))mkdir(DATA_DIR,0775,true); $path=DATA_DIR.'/'.$file; $fp=fopen($path,'c+'); if(!$fp)throw new RuntimeException('Storage is not writable.'); flock($fp,LOCK_EX); ftruncate($fp,0); rewind($fp); fwrite($fp,json_encode($data,JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES)); fflush($fp); flock($fp,LOCK_UN); fclose($fp); }
function clean(string $key,int $max=500): string { return mb_substr(trim((string)($_POST[$key]??'')),0,$max); }
function require_admin(): void { if(empty($_SESSION['admin']))respond(['message'=>'Admin login required.'],401); }
function stats(): array { $s=read_json('surveys.json');$v=read_json('volunteers.json');$yes=count(array_filter($s,fn($x)=>($x['committee_support']??'')==='Yes'));return ['surveys'=>count($s),'volunteers'=>count($v),'support_percent'=>count($s)?(int)round($yes/count($s)*100):0]; }

if($_SERVER['REQUEST_METHOD']==='GET'){
  $action=$_GET['action']??'stats';
  if($action==='stats')respond(stats());
  require_admin();
  if($action==='dashboard')respond(['stats'=>stats(),'surveys'=>read_json('surveys.json'),'volunteers'=>read_json('volunteers.json'),'problems'=>read_json('problems.json')]);
  if($action==='export'){
    $rows=read_json(($_GET['type']??'surveys')==='volunteers'?'volunteers.json':'surveys.json');
    header_remove('Content-Type');header('Content-Type: text/csv; charset=utf-8');header('Content-Disposition: attachment; filename="saath-export.csv"');
    $out=fopen('php://output','w');fwrite($out,"\xEF\xBB\xBF");if($rows){fputcsv($out,array_keys($rows[0]));foreach($rows as $row)fputcsv($out,array_map(fn($v)=>is_array($v)?implode(' | ',$v):$v,$row));}fclose($out);exit;
  }
  respond(['message'=>'Unknown action'],404);
}

$action=clean('action',30);
if($action==='survey'){
  foreach(['name','phone','street','consent'] as $k)if(!clean($k))respond(['message'=>'Please complete all required fields.'],422);
  $priorities=array_values(array_slice(array_map(fn($v)=>mb_substr(strip_tags((string)$v),0,80),(array)($_POST['priorities']??[])),0,3));if(!$priorities)respond(['message'=>'Select at least one priority.'],422);
  $rows=read_json('surveys.json');$phone=preg_replace('/\D+/','',clean('phone'));$rows[]=['id'=>bin2hex(random_bytes(5)),'submitted_at'=>date(DATE_ATOM),'name'=>clean('name',80),'phone'=>$phone,'street'=>clean('street',120),'resident_type'=>clean('resident_type',30),'priorities'=>$priorities,'suggestion'=>clean('suggestion',1500),'committee_support'=>clean('committee_support',20),'contribution'=>clean('contribution',40),'duplicate_phone'=>count(array_filter($rows,fn($r)=>($r['phone']??'')===$phone))>0];write_json('surveys.json',$rows);respond(['ok'=>true]);
}
if($action==='volunteer'){
  foreach(['name','phone','street','interest','consent'] as $k)if(!clean($k))respond(['message'=>'Please complete all required fields.'],422);
  $rows=read_json('volunteers.json');$rows[]=['id'=>bin2hex(random_bytes(5)),'submitted_at'=>date(DATE_ATOM),'name'=>clean('name',80),'phone'=>preg_replace('/\D+/','',clean('phone')),'street'=>clean('street',120),'interest'=>clean('interest',80),'hours'=>clean('hours',60),'skills'=>clean('skills',250),'reason'=>clean('reason',1000)];write_json('volunteers.json',$rows);respond(['ok'=>true]);
}
if($action==='login'){
  $config=read_json('config.json');$ok=hash_equals((string)($config['admin_user']??'admin'),clean('username',80))&&password_verify(clean('password',200),(string)($config['admin_password_hash']??''));if(!$ok)respond(['message'=>'Invalid username or password.'],401);session_regenerate_id(true);$_SESSION['admin']=true;respond(['ok'=>true]);
}
if($action==='logout'){session_destroy();respond(['ok'=>true]);}
require_admin();
if($action==='problem'){
  foreach(['title_en','title_hi','category','summary_en','summary_hi'] as $k)if(!clean($k))respond(['message'=>'Complete the required problem fields.'],422);
  $problems=read_json('problems.json');$image='';if(!empty($_FILES['image']['tmp_name'])){$f=$_FILES['image'];$allowed=['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp'];$mime=(new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);if(!isset($allowed[$mime])||$f['size']>5*1024*1024)respond(['message'=>'Upload JPG, PNG or WebP under 5 MB.'],422);if(!is_dir(__DIR__.'/uploads'))mkdir(__DIR__.'/uploads',0775,true);$image='uploads/'.bin2hex(random_bytes(8)).'.'.$allowed[$mime];if(!move_uploaded_file($f['tmp_name'],__DIR__.'/'.$image))respond(['message'=>'Image upload failed.'],500);}
  $problems[]=['id'=>'issue-'.bin2hex(random_bytes(4)),'title_en'=>clean('title_en',150),'title_hi'=>clean('title_hi',150),'category'=>clean('category',40),'priority'=>clean('priority',30)?:'New','area'=>clean('area',100)?:'Area to verify','icon'=>clean('icon',8)?:'📍','summary_en'=>clean('summary_en',400),'summary_hi'=>clean('summary_hi',400),'description_en'=>clean('description_en',2000),'description_hi'=>clean('description_hi',2000),'impact_en'=>clean('impact_en',1200),'impact_hi'=>clean('impact_hi',1200),'solution_en'=>clean('solution_en',2000),'solution_hi'=>clean('solution_hi',2000),'authority_en'=>clean('authority_en',1000),'authority_hi'=>clean('authority_hi',1000),'lat'=>(float)clean('lat',30),'lng'=>(float)clean('lng',30),'image'=>$image,'created_at'=>date(DATE_ATOM)];write_json('problems.json',$problems);respond(['ok'=>true]);
}
respond(['message'=>'Unknown action'],404);
