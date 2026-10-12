/* Comic vignettes live only on the menu. One cat is animated at a time.
   SVG transforms/opacity need no frame loop, particles, filters or timers.

   Noodle's runs to a script, as a percentage of the 7.4 s loop, and the cloud, sun, beam,
   head, eyes, captions and the body (ui.css, menuOverstretch) all keep to it. She only
   stretches once the sun is fully out from behind the cloud. This only holds if the SVG's
   own clock and the CSS animation start together, which showCat() makes sure of.
      0-7    normal size, the sun behind a cloud
      7-20   the cloud moves off; the sun is fully out by 20
     12-26   Noodle sees the sun and looks up at it
     21-41   says "stretch!" (not before the sun is out)
     26-45   gathers, then stretches
     45-62   a little too far, and says "too far!"
     60-78   bounces back to normal size
     82-100  a cloud drifts back over the sun and it starts again

   Sixpence's runs to a script too (the coin is the one on her card, at x 272):
      0-12   sits; the coin glints once, and she has not noticed
     10-20   she notices: head turns to it, eyes wide
     20-31   crouches and wiggles
     31-41   pounces in an arc and lands on the coin (it goes under her), a "ching"
     41-58   "mine!", smug, then a guilty look left and right
     58-78   "what coin?", innocent; trots back, and the floor is bare where the coin was
     88-100  the coin is back, with a glint, for the next time round */
(function(global){
  'use strict';
  var PERIOD=7.4;
  function turn(cx,cy,values,seconds,times){
    return '<animateTransform attributeName="transform" type="rotate" values="'+values.map(function(v){return v+' '+cx+' '+cy}).join(';')+'" keyTimes="'+(times||'0;.3;.45;.6;.8;1')+'" dur="'+seconds+'s" repeatCount="indefinite"/>';
  }
  function pulse(values,times){
    return '<animate attributeName="opacity" values="'+values+'" keyTimes="'+times+'" dur="'+PERIOD+'s" repeatCount="indefinite"/>';
  }
  function move(values,times){
    return '<animateTransform attributeName="transform" type="translate" values="'+values+'" keyTimes="'+times+'" dur="'+PERIOD+'s" repeatCount="indefinite"/>';
  }
  var HEADS={
    cat_sitting:[0,-6,-13,22,-14,4,0,0],
    cat_walking:[0,-5,0,-18,11,-4,0,0],
    /* up at the sun, then back and up through the stretch, then snapped down with the rest of her */
    cat_stretch:[0,0,16,16,12,20,22,22,-8,5,0,0],
    cat_flop:[0,4,8,-8,4,0,0,0],
    cat_playing:[0,-12,-20,14,-13,5,0,0],
    cat_peek:[0,-12,-12,16,-7,0,0,0],
    cat_curled:[0,4,7,-4,3,0,0,0],
    cat_loaf:[0,0,-7,8,-4,0,0,0],
    cat_highsit:[0,-8,-8,20,-18,7,0,0],
    /* Sixpence is looking at her coin on her right, so her head dips that way, then glances
       left and right when she has it, tilts to look innocent, and comes back upright */
    cat_tortie:[0,0,14,14,20,6,-14,14,0,10,10,0,0]
  };
  var HEAD_TIMES={cat_stretch:'0;.12;.19;.26;.31;.40;.46;.62;.66;.69;.75;1',
                  cat_tortie:'0;.08;.16;.30;.38;.46;.48;.53;.58;.62;.72;.78;1'};
  // Noodle's eyes: wide at the sun, a blink, squeezed shut while she stretches, wide again at
  // "too far", and a blink before the loop comes round.
  var EYES={cat_stretch:{
    v:'1 1;1 1;1.2 1.25;1.2 1.25;1 .05;1 1;1 1;1 .12;1 .12;1.25 1.3;1.25 1.3;1 1;1 1;1 .05;1 1',
    t:'0;.12;.17;.24;.26;.28;.31;.34;.44;.46;.62;.66;.88;.91;1'},
  // Sixpence's: wide when she sees the coin, narrowed on it as she pounces, smug once she has it,
  // wide and innocent for "what coin?", and a blink on the way back
  cat_tortie:{
    v:'1 1;1 1;1.2 1.25;1.2 1.25;1 .9;1 .9;1 .5;1 .5;1.15 1.2;1.15 1.2;1 .05;1 1;1 1',
    t:'0;.08;.14;.30;.32;.42;.44;.56;.58;.72;.75;.78;1'}};
  function faceGag(kind){
    if(kind==='cat_flop'||kind==='cat_curled'){
      return '<g class="menu-snore" opacity="0"><g transform="translate(54 76)"><g>'+
        '<circle cx="14" cy="0" r="17"/><path d="M5-10q5-5 11-1" fill="none"/>'+
        '<animateTransform attributeName="transform" type="scale" values=".1 .1;.1 .1;1.5 1.5;1.5 1.5;.1 .1;.1 .1" keyTimes="0;.13;.37;.39;.41;1" dur="7.4s" repeatCount="indefinite"/>'+
        '</g></g>'+pulse('0;0;1;1;0;0','0;.12;.16;.39;.4;1')+'</g>';
    }
    if(kind==='cat_stretch'||kind==='cat_loaf'||kind==='cat_tortie'){
      return '<g class="menu-blep" opacity="0"><path d="M48 81h9v8q-4 10-9 0Z"/><path d="M52.5 83v7"/>'+
        pulse('0;0;1;1;0;0',kind==='cat_stretch'?'0;.47;.5;.62;.66;1':kind==='cat_tortie'?'0;.44;.47;.55;.58;1':'0;.38;.42;.62;.67;1')+'</g>';
    }
    return '';
  }
  function cat(kind,raw,reduced){
    if(reduced)return raw;
    raw=raw.replace(/<g class="h-character"([^>]*)>/,'<g class="h-character"$1>'+
      turn(52,91,HEADS[kind]||HEADS.cat_sitting,PERIOD,HEAD_TIMES[kind]||'0;.18;.26;.34;.4;.48;.68;1'));
    raw=raw.replace(/<g class="h-detail">/,'<g class="h-detail">'+faceGag(kind));
    raw=raw.replace(/<g class="h-eye"([^>]*)>([\s\S]*?)<\/g>/g,function(_,attrs,eye){
      var startled=kind==='cat_walking'||kind==='cat_peek'||kind==='cat_playing';
      var lid=EYES[kind]||{v:'1 1;1 1;1 .05;1 1;'+(startled?'1.22 1.25':'1 1')+';1 1;1 .05;1 1;1 1',t:'0;.16;.19;.22;.34;.43;.67;.71;1'};
      return '<g class="h-eye"'+attrs+'><g class="menu-eyelid">'+eye+
        '<animateTransform attributeName="transform" type="scale" values="'+lid.v+'" keyTimes="'+lid.t+'" dur="7.4s" repeatCount="indefinite"/></g></g>';
    });
    // The crown itself slides over one eye; a head flick puts it back.
    if(kind==='cat_highsit'){
      raw=raw.replace(/(<path d="M36 25L35 12L43 18L52 7L60 18L68 12L67 25Z"[^>]*\/>)(<path[^>]*d="M49 18L52 14L55 18L52 22Z"[^>]*\/>)?/,
        '<g class="menu-crown"><g>$1$2'+turn(52,25,[0,0,-24,-24,18,0,0],PERIOD,'0;.2;.28;.38;.43;.5;1')+'</g>'+
        move('0 0;0 0;-9 38;-9 38;2 -14;0 0;0 0','0;.2;.28;.38;.43;.5;1')+'</g>');
    }
    // Sixpence's coin is on her right: her pupils sit that way, so she is looking at it.
    if(kind==='cat_tortie')raw=raw.replace(/<ellipse cx="0" cy="3" rx="4.5" ry="7.5"/g,'<ellipse cx="3.3" cy="3.5" rx="4.5" ry="7.5"');
    // Rumble is mirrored on the stage, which turns his drawn pupil offset away from the mouse.
    if(kind==='cat_walking')raw=raw.replace(/<ellipse cx="2.5" cy="3" rx="4.5" ry="7.5"/g,'<ellipse cx="-3.6" cy="3" rx="4.5" ry="7.5"');
    var tail=/^<path(?![^>]*class="ct-bd")[^>]*d="M\s*(-?[\d.]+)[ ,]+(-?[\d.]+)[^"]*"[^>]*\/>/.exec(raw);
    if(tail)raw='<g class="menu-tail">'+tail[0]+turn(+tail[1],+tail[2],[0,18,-25,27,-10,0],PERIOD)+'</g>'+raw.slice(tail[0].length);
    if(kind==='cat_sitting'){
      raw=raw.replace(/<ellipse class="ct-pw"[^>]*cx="([\d.]+)"[^>]*cy="([\d.]+)"[^>]*\/>/,function(paw,x,y){
        return '<g class="menu-wave-paw">'+paw+turn(+x,+y-7,[0,0,-45,18,-35,0],PERIOD)+'</g>';
      });
    }
    if(kind==='cat_walking'){
      raw=raw.replace(/<path class="ct-sh" d="M24 42v10M38 42v10M54 42v10M66 42v10"\/>/,function(){
        return [24,38,54,66].map(function(x,i){return '<g><path class="ct-sh" d="M'+x+' 42v10"/><animateTransform attributeName="transform" type="rotate" values="-13 '+x+' 42;13 '+x+' 42;-13 '+x+' 42" dur="1s" begin="'+(i%2?'-0.5s':'0s')+'" repeatCount="indefinite"/></g>'}).join('');
      });
    }
    return raw;
  }
  function props(kind,raw,reduced){
    if(reduced)return raw;
    if(kind==='cat_tortie'){
      // The coin glints (4-12%) before she has noticed it, goes under her when she lands (41%),
      // and is back, glinting again, for the next time round (90%).
      return '<g class="menu-coin">'+raw+
        '<animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0;.41;.43;.9;.93;1" dur="'+PERIOD+'s" repeatCount="indefinite"/></g>'+
        '<g class="menu-glint" opacity="0"><g transform="translate(260 141)"><g>'+
        '<path d="M0-11v22M-11 0h22M-7-7l14 14M7-7l-14 14"/>'+
        '<animateTransform attributeName="transform" type="scale" values=".3;.3;1.15;.3;.3;1.15;.3;.3" keyTimes="0;.04;.07;.12;.9;.93;.97;1" dur="'+PERIOD+'s" repeatCount="indefinite"/></g></g>'+
        pulse('0;0;1;0;0;1;0;0','0;.04;.07;.12;.9;.93;.97;1')+'</g>';
    }
    // Crumpet's radiator gives off its own heat, animated in scene(); the two still wisps
    // drawn at its ends are only for reduced motion.
    if(kind==='cat_loaf')return raw.replace('<path d="M138 120q5-9 0-16M282 120q5-9 0-16"/>','');
    if(kind==='cat_stretch'){
      // The sun is a disc and its rays. The disc pops as the cloud leaves it; the rays are only
      // out while the sun is, so they never poke round the cloud.
      var sun=/^(<circle[^>]*\/>)(<path[^>]*\/>)$/.exec(raw);
      if(!sun)return raw;
      return '<g class="menu-sun"><g transform="translate(52 42)"><g><g transform="translate(-52 -42)">'+sun[1]+'</g>'+
        '<animateTransform attributeName="transform" type="scale" values="1;1;1.18;1;1" keyTimes="0;.11;.18;.27;1" dur="'+PERIOD+'s" repeatCount="indefinite"/></g></g>'+
        '<g class="menu-rays" opacity="0">'+sun[2]+pulse('0;0;1;1;0;0','0;.13;.22;.78;.9;1')+'</g></g>';
    }
    return raw;
  }
  function scene(kind,reduced){
    if(kind==='cat_loaf'){
      // Eight wavy trails climb off the radiator (its top is y=126) all the time, each on its
      // own cycle, sway and height, so it reads as heat coming up and not as a loop. They are
      // behind the loaf: the ones over it only show once they are clear of its back.
      if(reduced)return '';
      var heat='<g class="menu-heat" aria-hidden="true">';
      for(var i=0;i<8;i++){
        var dur=(2.7+((i*7)%5)*0.25).toFixed(2), begin=(-(i*0.41)).toFixed(2),
            tall=(0.85+((i*3)%4)*0.1).toFixed(2), sway=(1+(i%3)*0.15).toFixed(2);
        heat+='<g transform="translate('+(131+i*23.4).toFixed(1)+' 126)"><g>'+
          '<g><path d="M0 0q-6-9 0-17t0-17" transform="scale(1 '+tall+')"/>'+
          '<animateTransform attributeName="transform" type="translate" values="-2.5 0;2.5 0;-2.5 0" dur="'+sway+'s" begin="'+begin+'s" repeatCount="indefinite"/></g>'+
          '<animateTransform attributeName="transform" type="translate" values="0 0;0 -64" dur="'+dur+'s" begin="'+begin+'s" repeatCount="indefinite"/>'+
          '<animate attributeName="opacity" values="0;.95;.95;0" keyTimes="0;.18;.7;1" dur="'+dur+'s" begin="'+begin+'s" repeatCount="indefinite"/>'+
          '</g></g>';
      }
      return heat+'</g>';
    }
    if(kind==='cat_stretch'){
      var beam='<g class="menu-sunbeam" opacity=".3"><path d="M42 68h46l100 104H98Z"/>'+
        (reduced?'':'<animate attributeName="opacity" values="0;0;.42;.42;.3;0;0" keyTimes="0;.11;.22;.62;.78;.9;1" dur="'+PERIOD+'s" repeatCount="indefinite"/>')+'</g>';
      if(reduced)return beam;
      // A cloud over the sun to begin with. It drifts off to the right and is gone, and a new
      // one comes in from beyond the left edge while Noodle is bouncing back, to cover it again.
      return beam+'<g class="menu-sun-cloud" opacity="1"><g transform="translate(52 43) scale(1.15) translate(-5 28)">'+
        '<path d="M-29-16q-9-15 6-22 6-15 19-8 14-12 25 0 18-3 18 15 12 13-4 22h-51Z"/></g>'+
        '<animateTransform attributeName="transform" type="translate" values="0 0;0 0;96 -3;96 -3;-120 0;0 0" keyTimes="0;.07;.20;.82;.83;1" dur="'+PERIOD+'s" repeatCount="indefinite"/>'+
        pulse('1;1;0;0;1;1','0;.07;.20;.82;.85;1')+'</g>';
    }
    return '';
  }
  var LINES={
    cat_sitting:'ACHOO!',cat_walking:'EEP!',cat_stretch:'too far!',
    cat_flop:'snort!',cat_playing:'RUDE!',cat_peek:'NOPE!',
    cat_curled:'fish pls',cat_loaf:'loaf mode',cat_highsit:'still regal.',
    cat_tortie:'mine!'
  };
  function punchline(kind,reduced){
    // Effects are held at zero until their gag, and disappear before the reset.
    if(reduced)return '';
    var s='<g class="menu-gag menu-gag-'+kind+'" aria-hidden="true">';
    function caption(text,values,times,small){
      return '<g class="menu-comic-caption" opacity="0"><path d="M264 27h133q9 0 9 9v27q0 9-9 9h-51l-14 13 2-13h-70q-9 0-9-9V36q0-9 9-9Z"/>'+
        '<text x="330" y="56" text-anchor="middle"'+(small?' style="font-size:'+small+'px"':'')+'>'+text+'</text>'+pulse(values,times)+'</g>';
    }
    if(kind==='cat_stretch'){
      // Noodle says what she is about to do once the sun is out (21-41%), does it, and owns up
      // to it once she has gone a little too far (45-66%).
      s+=caption('stretch!','0;0;1;1;0;0','0;.21;.24;.37;.41;1')+
         caption(LINES[kind],'0;0;1;1;0;0','0;.45;.48;.62;.66;1');
    }else if(kind==='cat_peek'){
      // Shadow is caught, says so, then ducks behind the wardrobe and says the other thing.
      // The second caption is up while hidden (42-65% of the loop) and goes as the peek begins.
      s+=caption(LINES[kind],'0;0;1;1;0;0','0;.3;.34;.4;.43;1')+
         caption("Can't see me",'0;0;1;1;0;0','0;.43;.47;.7;.75;1',20);
    }else if(kind==='cat_tortie'){
      // Sixpence claims it as she lands (40-58%), then plays innocent (58-76%).
      s+=caption(LINES[kind],'0;0;1;1;0;0','0;.40;.43;.56;.6;1')+
         caption('what coin?','0;0;1;1;0;0','0;.58;.62;.72;.76;1',22)+
         '<g class="menu-ching" opacity="0"><path d="M272 114v-10M257 120l-8-7M287 120l8-7"/>'+
         pulse('0;0;1;1;0;0','0;.4;.42;.48;.52;1')+'</g>';
    }else s+=caption(LINES[kind]||'mrrp!','0;0;1;1;0;0','0;.3;.34;.65;.72;1');
    if(kind==='cat_sitting'){
      s+='<g class="menu-sneeze" opacity="0"><path d="M285 96l17-8M287 107l23 3M283 118l15 10"/>'+
        '<g><circle cx="280" cy="108" r="5"/><circle cx="292" cy="101" r="4"/><circle cx="289" cy="116" r="3"/>'+
        move('0 0;0 0;32 -4;45 -6;45 -6','0;.28;.34;.4;1')+'</g>'+
        pulse('0;0;1;0;0','0;.28;.3;.41;1')+'</g>';
    }
    if(kind==='cat_walking'||kind==='cat_peek'||kind==='cat_playing'){
      s+='<g class="menu-surprise" opacity="0"><path d="M264 90l8-16M277 94l13-9M250 87l-1-16"/>'+
        pulse('0;0;1;1;0;0','0;.28;.32;.41;.48;1')+'</g>';
    }
    if(kind==='cat_flop'||kind==='cat_curled'){
      s+='<g class="menu-snore-pop" opacity="0"><path d="M249 85l-9-8M253 68l-2-12M269 71l8-10M275 89l13-2M267 101l8 9"/>'+
        pulse('0;0;1;0;0','0;.39;.4;.46;1')+'</g>';
    }
    if(kind==='cat_curled'){
      s+='<g class="menu-fish-dream" opacity="0"><circle cx="273" cy="99" r="3"/><circle cx="282" cy="85" r="5"/>'+
        '<g transform="translate(332 122)"><g><path class="menu-dream-cloud" d="M-29-16q-9-15 6-22 6-15 19-8 14-12 25 0 18-3 18 15 12 13-4 22h-51Z"/>'+
        '<path class="menu-dream-fish" d="M-20-17Q-6-32 12-17Q-6-2-20-17Z M12-17l13-10v20Z"/><circle cx="-11" cy="-18" r="2"/>'+
        turn(0,-17,[0,-12,12,-12,12,0],PERIOD)+'</g></g>'+
        pulse('0;0;1;1;0;0','0;.12;.2;.64;.72;1')+'</g>';
    }
    s+='</g>';return s;
  }
  global.HKKMenuMotion=Object.freeze({cat:cat,scene:scene,props:props,punchline:punchline});
})(window);
