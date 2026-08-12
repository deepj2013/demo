(function(){
  function setText(id, val){
    var el = document.getElementById(id);
    if(el) el.textContent = val;
  }

  function setBranding(){
    var school = (typeof getSchoolData === 'function') ? getSchoolData() : null;
    if(!school) return;
    document.documentElement.style.setProperty('--primary', school.colors.primary);
    document.documentElement.style.setProperty('--secondary', school.colors.secondary);

    setText('school-name', school.name);
    setText('school-name-hindi', school.nameHindi);
    setText('school-name-footer', school.name);
    setText('school-name-hindi-footer', school.nameHindi);
    setText('school-phone', school.phone);
    setText('school-address', school.address);
    setText('school-email', school.email);
    setText('school-tagline', school.tagline);
    setText('school-grades', school.grades);
    setText('school-name-copy', school.name);
    setText('school-phone-2', school.phone);
    setText('school-address-2', school.address);
    setText('year', String(new Date().getFullYear()));

    var motto = document.getElementById('school-motto');
    if(motto) motto.textContent = school.motto;

    document.querySelectorAll('[data-bg]').forEach(function(el){
      var key = el.getAttribute('data-bg');
      if(!key) return;
      var url = school.images && school.images[key];
      if(!url) return;
      if(el.tagName && el.tagName.toLowerCase() === 'img') el.src = url;
      else el.style.backgroundImage = "url('"+url+"')";
    });
  }

  function courseCard(c){
    var card = document.createElement('article');
    card.className = 'course-card fade-in';
    var instructor = (window.TEACHERS && TEACHERS[0]) ? TEACHERS[0].name : '';
    card.innerHTML = ''+
      '<div class="pill">'+(c.category||'')+'</div>'+
      '<h3>'+c.title+'</h3>'+
      '<div class="meta">Lessons: <b>'+c.lessons+'</b> • Duration: <b>'+c.duration+'</b><br/>Level: <b>'+c.level+'</b></div>'+
      '<div class="meta" style="margin-top:auto">Instructor: <b>'+instructor+'</b></div>';
    return card;
  }

  function teacherCard(t){
    var card = document.createElement('article');
    if(document.body.classList.contains('theme-edusion')){
      card.className = 'team-card fade-in';
      card.innerHTML = ''+
        '<div class="team-avatar" aria-hidden="true"></div>'+
        '<div><b>'+t.name+'</b><span>'+t.role+'<br/>Subject: '+t.subject+'<br/>Experience: '+t.experience+'</span></div>';
    } else {
      card.className = 'course-card fade-in';
      card.innerHTML = ''+
        '<div class="pill">'+t.subject+'</div>'+
        '<h3>'+t.name+'</h3>'+
        '<div class="meta">'+t.role+'<br/>Experience: '+t.experience+'<br/>Focus: '+t.subject+'</div>';
    }
    return card;
  }

  function renderCourses(){
    var grid = document.getElementById('course-grid');
    if(!grid || !window.COURSES) return;
    grid.innerHTML = '';
    window.COURSES.forEach(function(c){ grid.appendChild(courseCard(c)); });
  }

  function renderTeachers(){
    var grid = document.getElementById('teacher-grid');
    if(!grid || !window.TEACHERS) return;
    grid.innerHTML = '';
    window.TEACHERS.forEach(function(t){ grid.appendChild(teacherCard(t)); });
  }

  function renderEvents(){
    if(!window.EVENTS) return;
    var timeline = document.getElementById('event-timeline');
    if(timeline){
      timeline.innerHTML='';
      window.EVENTS.forEach(function(e, idx){
        var li = document.createElement('li');
        li.className = 'fade-in';
        li.innerHTML = ''+
          '<div class="event-dot">'+(idx+1)+'</div>'+
          '<div class="event-content"><b>'+e.title+'</b><span>'+e.date+' • '+e.time+'<br/>Location: '+e.location+'</span></div>';
        timeline.appendChild(li);
      });
      return;
    }

    var grid = document.getElementById('event-grid');
    if(!grid) return;
    grid.innerHTML='';
    window.EVENTS.forEach(function(e){
      var card = document.createElement('article');
      if(grid.classList.contains('two-col')){
        card.className = 'kid-card fade-in';
        card.innerHTML = '<p>Join us for <b>'+e.title+'</b> on '+e.date+'.</p><b>'+e.location+'</b>';
      } else {
        card.className = 'event-card fade-in';
        card.innerHTML = '<b>'+e.title+'</b><div class="meta">'+e.date+' • '+e.time+'<br/>Location: '+e.location+'</div>';
      }
      grid.appendChild(card);
    });
  }

  function renderGallery(){
    var grid = document.getElementById('gallery-grid');
    if(!grid) return;
    var school = getSchoolData();
    var keys = ['hero','about','classroom','students','sports','lab','library','event','graduation'];
    var imgs=[]; keys.forEach(function(k){ if(school.images && school.images[k]) imgs.push(school.images[k]); });
    imgs = Array.from(new Set(imgs)).slice(0,6);
    grid.innerHTML='';
    imgs.forEach(function(src){
      var item = document.createElement('div');
      item.className = 'gallery-item fade-in';
      item.innerHTML = '<img alt="School gallery" src="'+src+'" />';
      grid.appendChild(item);
    });
  }

  function renderBlog(){
    var list = document.getElementById('blog-list');
    if(!list || !window.BLOG_POSTS) return;
    list.innerHTML='';
    window.BLOG_POSTS.forEach(function(p){
      var card = document.createElement('article');
      card.className = 'course-card fade-in';
      card.innerHTML = ''+
        '<div class="pill">'+p.category+'</div>'+
        '<h3>'+p.title+'</h3>'+
        '<div class="meta">'+p.date+'</div>'+
        '<div class="meta" style="margin-top:8px">'+p.excerpt+'</div>';
      list.appendChild(card);
    });
  }

  function initEdusionTabs(){
    if(!document.body.classList.contains('theme-edusion')) return;
    var grid = document.getElementById('course-grid');
    if(!grid) return;
    var tabs = Array.from(document.querySelectorAll('.tab[data-tab]'));
    if(!tabs.length) return;

    function setActive(tab){
      tabs.forEach(function(t){ t.classList.toggle('active', t.dataset.tab===tab); });
      Array.from(grid.children).forEach(function(card){
        var text = card.textContent || '';
        var show = (
          (tab==='Academic' && (text.includes('Mathematics') || text.includes('Science') || text.includes('Social Studies'))) ||
          (tab==='Language' && (text.includes('English') || text.includes('Hindi') || text.includes('Sanskrit'))) ||
          (tab==='Technology' && (text.includes('Computer') || text.includes('Technology') || text.includes('IT'))) ||
          (tab==='Sports' && (text.includes('Physical') || text.includes('Sports'))) 
        );
        card.style.display = show ? '' : 'none';
      });
    }

    tabs.forEach(function(btn){ btn.addEventListener('click', function(){ setActive(btn.dataset.tab); }); });
    setActive('Academic');
  }

  function initContact(){
    var form = document.getElementById('contact-form');
    if(!form) return;
    form.addEventListener('submit', function(e){
      e.preventDefault();
      alert('Thanks! Your enquiry has been prepared (demo form).');
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    setBranding();
    renderCourses();
    renderTeachers();
    renderEvents();
    renderGallery();
    renderBlog();
    initEdusionTabs();
    initContact();
  });
})();
