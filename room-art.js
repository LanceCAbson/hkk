/* Room finishes and lighting are decorative: they never consume the house's
   random stream, change its layout, or create interactive objects. */
(function(global){
  'use strict';
  var NS='http://www.w3.org/2000/svg';
  var THEMES={
    hall:{wall:'#F4EDDD',floor:'#CDA77F',soft:'#B4BEA7',wood:'#C59A70',pattern:'panel',material:'wood'},
    landing:{wall:'#F3EDDF',floor:'#CBA781',soft:'#C3B29C',wood:'#C59A70',pattern:'stripe',material:'wood'},
    living:{wall:'#E7EDDF',floor:'#C99B75',soft:'#A9BDA5',wood:'#BC8B66',pattern:'panel',material:'wood'},
    kitchen:{wall:'#F5F0DE',floor:'#D7E4DE',soft:'#D6AAA1',wood:'#CEA277',pattern:'tile',material:'tile'},
    bed:{wall:'#EEE7F1',floor:'#C9BED0',soft:'#B9AEC9',wood:'#C6A27E',pattern:'stripe',material:'carpet'},
    kids:{wall:'#F8E8E1',floor:'#DDC7BD',soft:'#D5A7A9',wood:'#D1A67D',pattern:'dot',material:'carpet'},
    study:{wall:'#E2EBED',floor:'#BBA080',soft:'#BCA779',wood:'#B48D69',pattern:'panel',material:'wood'},
    bath:{wall:'#E5F0E9',floor:'#C6DCD6',soft:'#AAC4B9',wood:'#BFA889',pattern:'tile',material:'tile'},
    utility:{wall:'#EBEBE2',floor:'#D2D7CC',soft:'#B8C4B7',wood:'#C4A682',pattern:'tile',material:'tile'},
    garage:{wall:'#E4E4E3',floor:'#C3C7C7',soft:'#A6B6AE',wood:'#AF967E',pattern:'brick',material:'concrete'},
    attic:{wall:'#EFE5D6',floor:'#BE9C76',soft:'#C1B5A2',wood:'#B78E64',pattern:'stripe',material:'wood'},
    cons:{wall:'#EDF1DC',floor:'#D6DAB8',soft:'#B0C4A0',wood:'#C9A278',pattern:'panel',material:'tile'}
  };
  function mix(a,b,t){return '#'+[1,3,5].map(function(i){return Math.round(parseInt(a.slice(i,i+2),16)*(1-t)+parseInt(b.slice(i,i+2),16)*t).toString(16).padStart(2,'0')}).join('')}
  function node(tag,attrs,html){var n=document.createElementNS(NS,tag);Object.keys(attrs).forEach(function(k){n.setAttribute(k,attrs[k])});if(html)n.innerHTML=html;return n}
  function theme(id){return THEMES[id]||THEMES.hall}
  function key(id){return THEMES[id]?id:'hall'}
  function install(defs){
    if(defs.querySelector('#room-wall-hall'))return;
    Object.keys(THEMES).forEach(function(id){
      var t=THEMES[id],line=mix(t.wall,'#796B76',.18),grain='';
      if(t.pattern==='stripe')grain='<path d="M8 0V28M20 0V28" stroke="'+line+'" stroke-width=".8"/>';
      if(t.pattern==='dot')grain='<circle cx="7" cy="7" r="1.3" fill="'+line+'"/><circle cx="21" cy="21" r="1.3" fill="'+line+'"/>';
      if(t.pattern==='tile')grain='<path d="M0 0H28V28H0Z" fill="none" stroke="'+line+'" stroke-width="1"/>';
      if(t.pattern==='brick')grain='<path d="M0 0H28M0 14H28M14 0V14M0 14V28M28 14V28" fill="none" stroke="'+line+'" stroke-width="1"/>';
      defs.appendChild(node('pattern',{id:'room-wall-'+id,width:28,height:28,patternUnits:'userSpaceOnUse'},'<rect width="28" height="28" fill="'+t.wall+'"/>'+grain));
      var f=mix(t.floor,'#71616D',.24),floor='';
      if(t.material==='wood')floor='<path d="M0 0H80M0 12H80M0 24H80M28 0V12M61 12V24" fill="none" stroke="'+f+'" stroke-width=".8" opacity=".6"/>';
      if(t.material==='tile')floor='<path d="M0 0H32V32H0Z" fill="none" stroke="'+f+'" stroke-width="1" opacity=".5"/><path d="M14 16L16 14L18 16L16 18Z" fill="'+f+'" opacity=".18"/>';
      if(t.material==='carpet')floor='<path d="M6 6l2 1M18 18l2 1" stroke="'+f+'" stroke-width=".8" opacity=".35"/>';
      defs.appendChild(node('pattern',{id:'room-floor-'+id,width:t.material==='wood'?80:32,height:t.material==='wood'?24:32,patternUnits:'userSpaceOnUse'},'<rect width="80" height="32" fill="'+t.floor+'"/>'+floor));
    });
  }
  function apply(n,id){
    var t=theme(id),k=key(id);
    n.setAttribute('data-finish',k);
    n.style.setProperty('--room-wall',t.wall);n.style.setProperty('--room-floor',t.floor);
    n.style.setProperty('--room-side',mix(t.wall,'#8A7A89',.19));
    n.style.setProperty('--room-ceiling',mix(t.wall,'#8A7A89',.3));
    n.style.setProperty('--room-trim',mix(t.wall,'#ffffff',.45));
    n.style.setProperty('--room-wall-surface','url(#room-wall-'+k+')');
    n.style.setProperty('--room-floor-surface','url(#room-floor-'+k+')');
    n.style.setProperty('--k-wall',t.wall);n.style.setProperty('--k-soft',t.soft);n.style.setProperty('--k-wood',t.wood);
    n.style.setProperty('--k-metal',mix(t.wall,'#98B6BE',.5));
  }
  function details(group,room,back){
    var k=key(room.id),left=back(room.x,room.y),right=back(room.x+room.w,room.y+room.h);
    var bw=right[0]-left[0],bh=right[1]-left[1],y=right[1],trim=6;
    // A solid cornice shadow stays visible during a pan; no full-wall gradient layer.
    group.appendChild(node('rect',{class:'room-edge-shade',x:left[0],y:left[1],width:bw,height:7,fill:mix(theme(room.id).wall,'#8A7A89',.16),stroke:'none'}));
    if(theme(room.id).pattern==='panel'){
      var dado=bh*.25,step=Math.max(50,bw/Math.max(2,Math.round(bw/110))),d='M'+left[0]+' '+(y-dado)+'H'+right[0];
      for(var x=left[0]+step;x<right[0]-8;x+=step)d+='M'+x.toFixed(1)+' '+(y-dado)+'V'+y;
      group.appendChild(node('path',{class:'room-panels',d:d,fill:'none'}));
    }
    group.appendChild(node('path',{class:'room-trim',d:'M'+left[0]+' '+(y-trim)+'H'+right[0]+'V'+y+'H'+left[0]+'Z'}));
    group.appendChild(node('path',{class:'room-cornice',d:'M'+left[0]+' '+(left[1]+5)+'H'+right[0],fill:'none'}));
    // Architectural details live on the back wall, behind furniture and cats.
    // A narrow frieze and corner mouldings give every room its own character.
    var t=theme(k), sx=left[0], sy=left[1], accent=mix(t.soft,'#685365',.25);
    var border='M'+(sx+12)+' '+(sy+14)+'H'+(right[0]-12)+'M'+(sx+12)+' '+(sy+14)+'v22M'+(right[0]-12)+' '+(sy+14)+'v22';
    group.appendChild(node('path',{class:'rv3-moulding',d:border,fill:'none',stroke:accent,'stroke-width':1.5,opacity:.55}));
    var motifs='', spacing=Math.max(70,bw/Math.max(2,Math.floor(bw/100)));
    for(var mx=sx+spacing*.5;mx<right[0]-22;mx+=spacing){
      var mark=k==='kids'?'<path d="m0-6 2 4 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1Z"/>':
        k==='bath'||k==='utility'?'<path d="M-9 0q5-5 9 0t9 0M-9 5q5-5 9 0t9 0" fill="none"/>':
        k==='kitchen'?'<path d="M-6-4h12v7q-6 8-12 0Z M6-2q7 0 5 4H6" fill="none"/>':
        k==='garage'||k==='attic'?'<path d="M-8 0H8m-8-4v8" fill="none"/>':
        '<path d="M0 0q-12-12-13-1 5 7 13 1 8-6 13 1-1 11-13-1Zm0 0v8" fill="none"/>';
      motifs+='<g transform="translate('+mx.toFixed(1)+' '+(sy+27).toFixed(1)+')">'+mark+'</g>';
    }
    group.appendChild(node('g',{class:'rv3-frieze',fill:accent,stroke:accent,'stroke-width':1.2,opacity:.6},motifs));
    if(t.pattern==='panel'){
      var panelY=y-bh*.25+8, panelH=Math.max(10,bh*.25-18), panels='';
      for(var px=sx+12;px<right[0]-35;px+=step){
        var pw=Math.min(step-24,right[0]-px-12);
        if(pw>12)panels+='<rect x="'+px.toFixed(1)+'" y="'+panelY.toFixed(1)+'" width="'+pw.toFixed(1)+'" height="'+panelH.toFixed(1)+'" rx="3"/>';
      }
      group.appendChild(node('g',{class:'rv3-panelling',fill:'none',stroke:accent,'stroke-width':1,opacity:.35},panels));
    }
    var floor=[[room.x,room.y+room.h],[room.x+room.w,room.y+room.h],back(room.x+room.w,room.y+room.h),back(room.x,room.y+room.h)];
    var id='room-light-'+Math.round(room.x)+'-'+Math.round(room.y);
    group.appendChild(node('clipPath',{id:id},'<polygon points="'+floor.map(function(p){return p.join(',')}).join(' ')+'"/>'));
    var lights=node('g',{class:'room-lights','clip-path':'url(#'+id+')','pointer-events':'none'});group.appendChild(lights);
    room.lightLayer=lights; room.lightFloorY=right[1];
  }
  function windowLight(r,room,hour){
    if(!room.lightLayer)return;
    var floor=room.y+room.h,backY=room.lightFloorY;
    var spread=Math.min(room.w*.2,r.w*.8),shift=r.x<room.x+room.w/2?spread:-spread;
    var points=[[r.x,backY],[r.x+r.w,backY],[r.x+r.w+shift+spread,floor],[r.x+shift-spread,floor]];
    var light=node('polygon',{class:'room-window-light',points:points.map(function(p){return p.join(',')}).join(' '),fill:hour==='night'?'#E3EBFF':'#FFF7D5',opacity:hour==='day'?'.38':'.24',stroke:'none'});
    room.lightLayer.appendChild(light);
    var mid=r.x+r.w*.5;
    room.lightLayer.appendChild(node('path',{class:'room-light-frame',d:'M'+mid+' '+backY+'L'+(mid+shift)+' '+floor,fill:'none',stroke:theme(room.id).floor,'stroke-width':3}));
  }
  function tone(role,id){
    var t=theme(id),base=role==='soft'?t.soft:role==='wood'?t.wood:role==='metal'?mix(t.wall,'#98B6BE',.5):null;
    return base?mix(base,'#51404F',.32):null;
  }
  function enrich(table){
    var extras={
      sofa:'<path class="rv3-stitch" d="M29 31h40v13H29ZM91 31h40v13H91ZM27 58h45m17 0h42"/><path class="rv3-piping" d="M26 65h108"/>',
      bed:'<path class="rv3-quilt" d="M77 58h71v20H77Z"/><path class="rv3-stitch" d="M88 58v20M105 58v20M122 58v20M139 58v20M77 68h71M29 38h17M55 38h12"/>',
      dresser:'<path class="rv3-piping" d="M12 14h85M12 58h18m50 0h18M13 68h83"/>',
      bookshelf:'<path class="rv3-bookbands" d="M13 33h5m13 0h6m25 3h5M13 69h4m5-5h5"/><path class="rv3-piping" d="M11 87h57v27H11Z"/>',
      fridge:'<path class="rv3-note" d="M18 57h22v25H18Z"/><path class="rv3-stitch" d="M22 65h14m-14 6h9"/><circle class="rv3-magnet" cx="29" cy="57" r="3"/>',
      counter:'<path class="rv3-piping" d="M17 55h56v30H17ZM106 55h56v30h-56Z"/>',
      window:'<g class="rv3-curtain"><path class="rv3-fabric" d="M5 5h18q-4 29-13 41l10 34H5Z M62 5h19v75H66l10-34Q66 34 62 5Z"/><path class="rv3-stitch" d="M11 9v24M74 9v24M9 47h9m50 0h10"/></g>'
    };
    Object.keys(extras).forEach(function(k){if(table[k])table[k]=Object.assign({},table[k],{s:table[k].s+'<g class="room-v3-detail">'+extras[k]+'</g>'})});
  }
  function motion(k,inner,x,w,reduced,breeze){
    if(reduced||k!=='window')return inner;
    return inner.replace('<g class="rv3-curtain">','<g class="rv3-curtain">'+breeze(43,5,2.5,8.4,(x/w*6).toFixed(2)));
  }
  global.HKKRoomArt=Object.freeze({themes:THEMES,theme:theme,tone:tone,apply:apply,install:install,details:details,windowLight:windowLight,enrich:enrich,motion:motion});
})(window);
