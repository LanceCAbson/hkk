/* Lantern Lane: an exterior shopping street, drawn with the game's SVG pipeline.
   No bitmap textures, filters, particles, or extra animation loop. */
(function(global){
  'use strict';
  var art={},paint={},height={},surface={},tall={};
  function add(k,w,h,s,role,cm,top,big){
    art[k]={w:w,h:h,s:s};paint[k]=role;height[k]=cm;
    if(top)surface[k]=1;if(big)tall[k]=1;
  }
  /* Shared shop footprint, individual architecture. Roof surfaces and door
     bottoms keep their original anchors so existing hiding/grounding still works. */
  function shop(k,label,colour,display,decor){
    var theme=k.slice(6).toLowerCase(), windows='', upper='', roof='', detail='';
    var traditional=k==='streetRamen'||k==='streetGrocer';
    if(traditional){
      roof='<path class="st-roof" d="M1 39Q21 35 30 7h220q9 28 28 32Z"/><path class="st-roof-tile" d="M20 27h239M31 17h218M42 8l-8 28M72 8l-5 29M102 8l-2 29M132 8v29M162 8l2 29M192 8l5 29M222 8l8 28"/>';
      windows='<path class="st-upstairs" d="M27 50h222v63H27Z"/><path class="st-timber" d="M20 40h8v90h-8ZM83 44h7v83h-7ZM153 44h7v83h-7ZM242 40h8v90h-8Z"/><path class="st-line" d="M29 71h212M29 93h212M48 50v62M68 50v62M112 50v62M132 50v62M181 50v62M201 50v62M221 50v62"/>';
    }else if(k==='streetBakery'||k==='streetBookshop'){
      roof='<path class="st-roof" d="M2 41 28 7h69l39 24 41-24h73l27 34Z"/><path class="st-roof-tile" d="M13 29h79M23 17h68M185 17h67M176 29h86"/>';
      windows='<path class="st-upstairs" d="M28 112V76a25 25 0 0 1 50 0v36ZM100 112V76a25 25 0 0 1 50 0v36ZM176 112V76a31 25 0 0 1 62 0v36Z"/><path class="st-line" d="M53 55v57M125 55v57M207 55v57M28 82h50M100 82h50M176 82h62"/>';
      if(k==='streetBakery') upper='<circle class="st-shop-sign" cx="136" cy="36" r="21"/><path class="st-line" d="M136 21v15l9 6"/>';
      else upper='<path class="st-timber" d="M18 44h7v83h-7ZM87 42h7v85h-7ZM161 42h7v85h-7ZM248 44h7v83h-7Z"/>';
    }else if(k==='streetFlorist'){
      roof='<path class="st-roof" d="M2 40 27 7h223l27 33Z"/><path class="st-roof-glass" d="M25 30 39 12h43l-7 18ZM96 12h45v18H89ZM155 12h44l7 18h-51ZM213 12h27l15 18h-35Z"/>';
      windows='<path class="st-upstairs" d="M30 112V81q0-37 38-37h145q36 0 36 37v31Z"/><path class="st-line" d="M30 80h219M65 46v66M100 44v68M136 44v68M172 44v68M209 46v66"/>';
      upper='<path class="st-vine" d="M18 129q17-31 8-54M256 131q-17-34-7-56"/><path class="st-leaves" d="M24 105q-20-14-14-24 18 2 14 24ZM26 83q22-15 17-26-17 3-17 26ZM250 105q21-15 16-24-18 2-16 24ZM249 83q-22-15-17-26 17 3 17 26Z"/>';
    }else{
      roof=k==='streetArcade'?'<path class="st-roof" d="M5 40V21h35V7h193v14h40v19Z"/>':k==='streetMusic'?'<path class="st-roof" d="M3 39V7h178l94 32Z"/><path class="st-roof-tile" d="M20 20h152M20 30h183"/>':'<path class="st-roof" d="M1 39 20 7h236l22 32Z"/><path class="st-roof-tile" d="M15 28h249M25 17h228"/>';
      for(var i=0;i<3;i++) windows+='<rect class="st-upstairs" x="'+(26+i*77)+'" y="51" width="54" height="59" rx="3"/><path class="st-line" d="M'+(53+i*77)+' 51v59M'+(26+i*77)+' 80h54"/>';
      if(k==='streetCafe') upper='<path class="st-balcony" d="M20 106h230v20H20Z"/><path class="st-line" d="M25 104h220M32 105v20M55 105v20M78 105v20M101 105v20M124 105v20M147 105v20M170 105v20M193 105v20M216 105v20M239 105v20"/><path class="st-flower" d="M43 107q-8-20 3-22t5 22M104 107q-8-20 3-22t5 22M199 107q-8-20 3-22t5 22"/>';
      if(k==='streetArcade') upper='<path class="st-neon" d="m136 44 8 17 19 3-14 13 3 19-16-9-17 9 4-19-14-13 19-3Z"/><path class="st-neon-line" d="M16 18h26M233 18h27"/>';
      if(k==='streetMusic') upper='<g class="st-disc"><circle class="st-record" cx="130" cy="80" r="27"/><circle class="st-record-label" cx="130" cy="80" r="9"/><path class="st-record-shine" d="M110 77a21 21 0 0 1 20-18M150 83a21 21 0 0 1-20 18"/></g>';
    }
    // Ground-floor mullions, plinths and small notices are part of the façade.
    detail='<path class="st-brick-line" d="M12 313h150M12 323h150M33 308v5m40-5v5m40-5v5M53 313v10m40-10v10m40-10v10"/><path class="st-glass-shine" d="m29 211 27 35m-23-11 12 16M189 216l23 29"/><rect class="st-paper" x="218" y="288" width="18" height="13" rx="2"/><path class="st-fine" d="M221 293h11M221 297h7"/>';
    var badge=k==='streetCafe'?'珈琲':k==='streetRamen'?'らーめん':k==='streetBookshop'?'本':k==='streetFlorist'?'花':k==='streetBakery'?'パン':k==='streetArcade'?'遊':k==='streetGrocer'?'市場':'音';
    var sign='<path class="st-metal" d="M235 121h30v5h-30Z"/><g class="st-hanging-sign"><rect class="st-side-sign" x="242" y="129" width="31" height="64" rx="5"/><text aria-hidden="true" class="st-jp" x="257" y="143" text-anchor="middle" writing-mode="vertical-rl">'+badge+'</text></g>';
    var valance=k==='streetArcade'?'<path class="st-awning" fill="'+colour+'" d="M4 212h264v9H4Z"/>':'<path class="st-valance" fill="'+colour+'" d="M4 212h264v9q-11 14-22 0-11 14-22 0-11 14-22 0-11 14-22 0-11 14-22 0-11 14-22 0-11 14-22 0-11 14-22 0-11 14-22 0-11 14-22 0-11 14-22 0-11 14-22 0Z"/>';
    add(k,280,330,'<g class="st-shop st-shop-'+theme+'">'+
      '<path class="st-side" d="M263 39l15 12v279h-15Z"/>'+
      '<path class="st-wall" d="M9 37h254v293H9Z"/>'+roof+
      windows+upper+'<path class="st-trim" d="M9 123h254v10H9Z"/>'+
      '<rect class="st-shop-sign" x="22" y="140" width="216" height="40" rx="5"/>'+
      '<text aria-hidden="true" class="st-lettering" x="130" y="166" text-anchor="middle">'+label.replace(/&/g,'&amp;')+'</text>'+
      '<path class="st-window" d="M22 200h138v107H22Z"/><path class="st-door" d="M172 200h70v130h-70Z"/>'+
      '<path class="st-window" d="M183 211h48v73h-48Z"/><path class="st-line" d="M225 297h.1M91 201v107M22 305h138"/>'+
      '<g class="st-display">'+display+'</g>'+detail+
      '<path class="st-awning" fill="'+colour+'" d="M15 185h242l11 28H4Z"/>'+valance+
      '<path class="st-awning-stripe" d="M39 185h17l-5 28H30ZM82 185h17l-2 28H76ZM125 185h17v28h-17ZM168 185h17l5 28h-17ZM211 185h17l8 28h-17Z"/>'+sign+
      (decor||'')+'<path class="st-step" d="M170 320h76v10h-76Z"/></g>', 'wood',550,true,true);
  }
  shop('streetCafe','NEKO COFFEE','#75A998',
    '<path class="st-cup" d="M36 270h29v24H36ZM65 274q16-3 13 10t-13 4M103 270h29v24h-29ZM132 274q16-3 13 10t-13 4"/><path class="st-line" d="M39 296h33M104 296h33M31 254h118"/>',
    '<g class="st-curtain"><path class="st-fabric" d="M180 210h22v66l-9-7-13 7ZM213 210h22v66l-9-7-13 7Z"/></g>');
  shop('streetBookshop','HANA BOOKS','#A289B6',
    '<path class="st-line" d="M29 244h123M29 278h123"/><path class="st-book" d="M34 215h12v27H34ZM49 219h10v23H49ZM64 213h14v29H64ZM87 218h10v24H87ZM103 214h12v28h-12ZM126 218h15v24h-15ZM38 250h12v26H38ZM56 253h17v23H56ZM87 250h11v26H87ZM112 251h18v25h-18Z"/>');
  shop('streetRamen','RAMEN RAMEN','#BD6F64',
    '<path class="st-bowl" d="M34 265h44q-3 25-22 25t-22-25ZM99 265h44q-3 25-22 25t-22-25Z"/><path class="st-line" d="M35 260l40-10M100 260l40-10"/><g class="st-steam"><path d="M47 248q-7-10 0-18M65 248q7-10 0-18M113 248q-7-10 0-18M131 248q7-10 0-18"/></g>',
    '<g class="st-curtain"><path class="st-fabric" d="M172 200h70v48l-17-5-17 5-18-5-18 5Z"/><path class="st-line" d="M190 203v40M208 203v45M225 203v40"/></g>');
  shop('streetFlorist','BLOOM & CO','#93AC77',
    '<path class="st-pot" d="M34 268h29l-4 27H39ZM98 268h29l-4 27h-19Z"/><path class="st-stem" d="M48 268v-35M112 268v-35"/><path class="st-flower" d="M48 232q-15-20-22-5-4 11 11 14-15 15 0 19 12 2 11-16 12 16 22 2 4-12-10-11 13-15-1-16-8 0-11 13ZM112 232q-15-20-22-5-4 11 11 14-15 15 0 19 12 2 11-16 12 16 22 2 4-12-10-11 13-15-1-16-8 0-11 13Z"/>');
  shop('streetBakery','KOMUGI BAKERY','#D2A254',
    '<path class="st-bread" d="M31 266q0-18 18-18t18 18v14H31ZM91 266q0-18 22-18t22 18v14H91Z"/><path class="st-line" d="M42 254l-4 13M53 254l-4 13M101 254l-4 13M117 254l-4 13M29 284h117"/>');
  shop('streetArcade','STAR ARCADE','#78A7BD',
    '<path class="st-game" d="M34 233h42v67H34ZM103 233h42v67h-42Z"/><path class="st-window" d="M40 242h29v24H40ZM109 242h29v24h-29Z"/><path class="st-line" d="M43 280h.1M60 280h.1M111 280h.1M128 280h.1"/>');
  shop('streetGrocer','MIDORI MARKET','#8EB49A',
    '<path class="st-crate" d="M29 272h53v25H29ZM95 272h54v25H95Z"/><path class="st-fruit" d="M36 271a9 9 0 1 1 18 0m3 0a9 9 0 1 1 18 0M102 271a9 9 0 1 1 18 0m3 0a9 9 0 1 1 18 0"/>');
  shop('streetMusic','MOON RECORDS','#D2A3AE',
    '<circle class="st-record" cx="58" cy="260" r="25"/><circle class="st-record-label" cx="58" cy="260" r="8"/><circle class="st-record" cx="124" cy="260" r="25"/><circle class="st-record-label" cx="124" cy="260" r="8"/>');
  add('streetVending',106,190,'<rect class="st-machine" x="4" y="3" width="98" height="184" rx="6"/><rect class="st-window" x="12" y="15" width="60" height="98" rx="3"/><path class="st-line" d="M12 47h60M12 80h60M22 27v13m18-13v13m18-13v13M22 59v13m18-13v13m18-13v13M22 92v13m18-13v13m18-13v13M83 28h7M83 45h7M83 62h7M82 93h10M17 162h52"/><path class="st-slot" d="M16 131h70v17H16Z"/><path class="st-machine-light" d="M16 176h72v5H16Z"/>','metal',190,true,true);
  add('streetRamenCart',220,210,'<path class="st-wood" d="M25 102h170v94H25Z"/><path class="st-counter" d="M12 97h196v15H12Z"/><path class="st-wood" d="M24 97V27h9v70M186 97V27h9v70"/><path class="st-awning" d="M12 27 32 5h155l21 22Z"/><g class="st-curtain"><path class="st-fabric" d="M33 28h153v34l-25-7-26 7-26-7-25 7-26-7-25 7Z"/><path class="st-letter-stroke" d="M52 40h18m-9-4v16M91 39h19m-17 9h15M137 39h24m-19 9h14"/></g><path class="st-bowl" d="M65 78h40q-3 18-20 18T65 78ZM130 78h40q-3 18-20 18t-20-18Z"/><g class="st-steam"><path d="M76 71q-8-10 0-17M92 71q8-10 0-17M142 71q-8-10 0-17M158 71q8-10 0-17"/></g><path class="st-line" d="M40 137h140M40 168h140"/><circle class="st-wheel" cx="50" cy="199" r="10"/><circle class="st-wheel" cx="171" cy="199" r="10"/>','wood',210,true,true);
  add('streetTeaTable',150,112,'<ellipse class="st-table" cx="75" cy="29" rx="70" ry="15"/><path class="st-wood" d="M68 44h14v64H68ZM44 108h62"/><path class="st-cup" d="M61 10h25v20H61ZM86 14q12-1 11 7t-11 4"/><g class="st-steam"><path d="M66 6q-4-7 1-12M78 6q4-7 0-12"/></g>','wood',90,true,false);
  add('streetPlanter',115,145,'<path class="st-pot" d="M20 93h75l-10 50H30Z"/><path class="st-stem" d="M57 95V33M57 68 32 49M57 77l28-24"/><g class="st-plant-crown"><path class="st-leaves" d="M56 55Q20 64 18 34q32-8 38 21ZM59 62q35 9 39-24-29-7-39 24ZM57 40Q27 16 50 3q27 9 7 37Z"/></g>','leaf',140,false,true);
  add('streetAFrame',88,132,'<path class="st-wood" d="M7 132 21 6h46l14 126h-10L58 16H30L17 132Z"/><path class="st-chalk" d="M21 19h46v89H21Z"/><path class="st-chalk-line" d="M29 37h30M29 52h23M29 70h30M29 84h19"/>','wood',115,false,true);
  add('streetCrates',130,108,'<path class="st-crate" d="M4 57h122v47H4ZM20 7h92v47H20Z"/><path class="st-line" d="M7 71h116M7 89h116M24 21h84M24 39h84M31 57v47M63 57v47M94 57v47"/><path class="st-fruit" d="M28 8a12 12 0 1 1 24 0m5 0a12 12 0 1 1 24 0m5 0a12 12 0 1 1 24 0"/>','wood',105,true,true);
  add('streetMailbox',75,150,'<path class="st-mailbox" d="M9 87h57v-59Q38-9 9 28Z"/><path class="st-slot" d="M20 28h34v8H20Z"/><path class="st-line" d="M18 48h39M27 54v20M38 54v20M49 54v20"/><path class="st-metal" d="M31 87h13v60H31ZM15 148h45"/>','metal',140,false,true);
  add('streetLanternPost',122,260,'<path class="st-wood" d="M57 257V8h10v249Z"/><path class="st-line" d="M24 35h82M29 35v16M91 35v16"/><g class="st-lantern"><path class="st-lantern-fill" d="M11 65q18-22 36 0v44q-18 22-36 0Z"/><path class="st-line" d="M16 59h25M16 116h25M20 61v52M37 61v52"/></g><g class="st-lantern"><path class="st-lantern-fill" d="M73 65q18-22 36 0v44q-18 22-36 0Z"/><path class="st-line" d="M78 59h25M78 116h25M82 61v52M99 61v52"/></g>','wood',250,false,true);
  add('streetUmbrellaTable',210,225,'<path class="st-metal" d="M101 18h8v200h-8Z"/><g class="st-parasol"><path class="st-fabric" d="M3 67Q24 22 105 3q81 19 102 64-25-13-49 0-25-13-53 0-26-13-51 0-25-13-51 0Z"/><path class="st-line" d="M105 3 54 67M105 3l53 64"/></g><ellipse class="st-table" cx="105" cy="148" rx="65" ry="12"/><path class="st-wood" d="M98 160h14v63H98ZM77 223h56"/>','soft',210,true,true);

  add('streetTaiyakiStall',220,235,'<path class="st-wood" d="M23 93V23h8v70M189 93V23h8v70M23 107h174v109H23Z"/><path class="st-awning" fill="#C97869" d="M8 26 28 4h166l18 22Z"/><g class="st-stall-cloth"><path class="st-fabric" d="M13 26h194v34l-24-6-25 6-24-6-25 6-24-6-25 6-23-6-24 6Z"/><text aria-hidden="true" class="st-stall-label" x="110" y="47" text-anchor="middle">たいやき</text></g><path class="st-counter" d="M9 95h202v15H9Z"/><path class="st-bread" d="M45 83q12-17 26-6l10-5-3 11 3 10-10-4q-14 12-26-6ZM100 83q12-17 26-6l10-5-3 11 3 10-10-4q-14 12-26-6ZM157 83q12-17 26-6l10-5-3 11 3 10-10-4q-14 12-26-6Z"/><path class="st-line" d="M60 77v13M115 77v13M172 77v13M33 130h153M33 192h153"/><circle class="st-shop-sign" cx="110" cy="162" r="25"/><path class="st-bread" d="M91 161q16-21 31-5l10-6-2 12 2 12-10-5q-15 15-31-8Z"/><circle class="st-wheel" cx="48" cy="224" r="10"/><circle class="st-wheel" cx="172" cy="224" r="10"/>','wood',220,true,true);
  add('streetGacha',116,174,'<path class="st-game" d="M4 4h108v157H4Z"/><path class="st-paper" d="M8 146h100v23H8Z"/><text aria-hidden="true" class="st-mini-label" x="58" y="20" text-anchor="middle">GACHA</text><rect class="st-window" x="13" y="29" width="90" height="69" rx="21"/><path class="st-capsule" d="M21 75a12 12 0 1 1 24 0a12 12 0 1 1-24 0M47 75a12 12 0 1 1 24 0a12 12 0 1 1-24 0M73 75a12 12 0 1 1 24 0a12 12 0 1 1-24 0M35 52a12 12 0 1 1 24 0a12 12 0 1 1-24 0M60 51a12 12 0 1 1 24 0a12 12 0 1 1-24 0"/><path class="st-line" d="M21 75h24M47 75h24M73 75h24M35 52h24M60 51h24"/><circle class="st-metal" cx="35" cy="120" r="14"/><path class="st-paper" d="M23 116h24v7H23Z"/><path class="st-slot" d="M68 107h28v26H68Z"/>','metal',170,true,true);
  add('streetBookRack',118,140,'<path class="st-wood" d="M5 139 15 4h85l13 135h-9L93 15H23l-9 124Z"/><path class="st-book" d="M22 24h20v29H22ZM47 24h18v29H47ZM71 24h21v29H71ZM22 65h22v28H22ZM49 65h18v28H49ZM72 65h20v28H72Z"/><path class="st-counter" d="M16 53h83v8H16ZM13 93h89v8H13Z"/><path class="st-paper" d="M23 111h67v17H23Z"/><text aria-hidden="true" class="st-mini-label" x="56" y="124" text-anchor="middle">NEW MANGA</text><path class="st-fine" d="M25 31h14M25 35h10M50 31h12M74 31h14M25 72h14M52 72h12M75 72h13"/>','wood',145,false,true);
  add('streetBlossom',170,245,'<path class="st-pot" d="M48 191h77l-10 50H59Z"/><path class="st-wood" d="M80 194V66h11v128Z"/><path class="st-stem" d="M84 139 42 87M88 116l39-42M86 94 69 44"/><g class="st-blossom-crown"><path class="st-blossom" d="M23 95q-29-26-8-50 12-14 32-8Q50-2 84 9q30-12 45 17 37-1 37 30 12 28-18 38-16 27-42 14-23 28-47 4-24 8-36-17Z"/><path class="st-flower-mark" d="M32 59h12m-6-6v12M75 32h12m-6-6v12M118 51h12m-6-6v12M68 82h12m-6-6v12M123 86h12m-6-6v12"/></g><path class="st-line" d="M53 209h65M59 225h54"/>','leaf',240,false,true);
  add('streetBanner',100,240,'<path class="st-metal" d="M9 232V4h6v228Z"/><path class="st-line" d="M13 18h79"/><g class="st-banner-cloth"><path class="st-banner-fill" d="M18 19h73v145l-36-18-37 18Z"/><text aria-hidden="true" class="st-banner-label" x="55" y="45" text-anchor="middle" writing-mode="vertical-rl">ねこ祭り</text><path class="st-paper" d="m34 122 2-21 11 8h15l11-8 2 21q-20 20-41 0Z"/><path class="st-line" d="M44 120h1m20 0h1"/></g><path class="st-metal" d="M1 230h31v8H1Z"/>','soft',230,false,true);

  /* V3 market details: compact stalls fit the existing dry forecourts. */
  add('streetBobaCart',210,215,'<path class="st-wood" d="M20 102V31h10v71M180 102V31h10v71M21 115h167v84H21Z"/><path class="st-awning" fill="#A585AD" d="M7 31 30 6h151l22 25Z"/><g class="st-boba-fringe"><path class="st-fabric" d="M7 31h196v29l-24-7-25 7-25-7-25 7-25-7-25 7-24-7-23 7Z"/></g><path class="st-counter" d="M8 102h195v13H8Z"/><path class="st-boba-cup" d="M35 71h32l-4 29H39ZM80 71h32l-4 29H84ZM126 71h32l-4 29h-24Z"/><path class="st-line" d="M51 78V53M96 78V53M142 78V53"/><path class="st-boba-pearl" d="M45 93h1m10 0h1m-5-7h1M91 93h1m10 0h1m-5-7h1M137 93h1m10 0h1m-5-7h1"/><rect class="st-shop-sign" x="35" y="133" width="141" height="41" rx="6"/><text class="st-stall-label st-dark-label" x="105" y="159" text-anchor="middle">BOBA &amp; MEOW</text><path class="st-line" d="M31 188h146"/><circle class="st-wheel" cx="43" cy="202" r="11"/><circle class="st-wheel" cx="165" cy="202" r="11"/>','wood',195,true,true);
  add('streetClaw',145,225,'<rect class="st-game" x="7" y="5" width="131" height="212" rx="8"/><rect class="st-window" x="18" y="43" width="109" height="119" rx="4"/><path class="st-paper" d="M16 15h113v23H16Z"/><text class="st-mini-label" x="73" y="31" text-anchor="middle">CATCH A PAW</text><path class="st-line" d="M22 54h102M72 54v17"/><g class="st-claw-arm"><path class="st-metal" d="M65 71h14v12H65Z"/><path class="st-line" d="M65 79 55 92l8 7M79 79 89 92l-8 7"/></g><path class="st-plush" d="M31 147v-18l8-13 8 10 9-10 7 13v18Z M80 146v-16l7-13 9 9 10-9 6 13v16Z"/><path class="st-line" d="M40 137h1m11 0h1M90 137h1m11 0h1"/><path class="st-counter" d="M18 169h109v16H18Z"/><circle class="st-gold" cx="39" cy="177" r="5"/><path class="st-slot" d="M61 194h57v14H61Z"/><path class="st-machine-light" d="M15 7h115v4H15Z"/>','metal',210,true,true);
  add('streetFlowerCart',180,170,'<path class="st-wood" d="M11 93h156v48H11Z"/><path class="st-counter" d="M5 90h169v12H5Z"/><path class="st-line" d="M18 110h142M18 124h142M151 141v-75h17v25"/><g class="st-cart-bouquets"><path class="st-leaves" d="M34 91q-26-26-22-35 25 7 27 29 3-32 23-27-1 20-28 33ZM82 91q-26-26-22-35 25 7 27 29 3-32 23-27-1 20-28 33ZM128 91q-26-26-22-35 25 7 27 29 3-32 23-27-1 20-28 33Z"/><path class="st-stem" d="M36 85V29M81 86V23M128 85V36"/><circle class="st-flower" cx="36" cy="30" r="19"/><circle class="st-gold" cx="81" cy="24" r="19"/><circle class="st-blossom" cx="128" cy="37" r="19"/><path class="st-flower-mark" d="M28 30h16m-8-8v16M73 24h16m-8-8v16M120 37h16m-8-8v16"/></g><circle class="st-wheel" cx="35" cy="153" r="14"/><circle class="st-wheel" cx="143" cy="153" r="14"/>','wood',140,false,true);
  shopsV3();
  function shopsV3(){
    ['streetCafe','streetBookshop','streetRamen','streetFlorist','streetBakery','streetArcade','streetGrocer','streetMusic'].forEach(function(k,i){
      // Warm lintels, brick corners, noticeboards and a small upstairs chime.
      var corner='<path class="st-facade-edge" d="M13 46v78M256 46v78M15 236v60M253 234v71"/><path class="st-fine" d="M17 243h11m-11 11h11m-11 11h11M241 241h11m-11 11h11m-11 11h11"/><path class="st-warm-lintel" d="M29 204h123v5H29ZM187 215h39v4h-39Z"/>';
      var chime='<path class="st-line" d="M234 89v10"/><g class="st-wind-chime"><path class="st-chime-glass" d="M226 110q0-23 16 0Z"/><path class="st-line" d="M234 109v22"/><path class="st-chime-paper" d="M229 126h10v23h-10Z"/></g>';
      art[k].s+=corner+chime;
      if(i%2===0)art[k].s+='<path class="st-paper" d="M119 229h30v30h-30Z"/><text class="st-mini-label" x="134" y="241" text-anchor="middle">OPEN</text><path class="st-fine" d="M124 248h20m-20 6h14"/>';
    });
  }
  var bonus={
    streetCoin:{w:34,h:34,s:'<circle class="st-gold" cx="17" cy="17" r="16"/><circle class="nf" cx="17" cy="17" r="11"/><path class="nf" d="M17 8v18M12 11h7q7 3 0 7h-4q-7 3 0 7h7"/>'},
    streetTicket:{w:52,h:30,s:'<path class="st-paper" d="M1 1h50v8q-9 6 0 12v8H1v-8q9-6 0-12Z"/><path class="nf" d="M15 7v16M24 9h17M24 16h12M24 22h17"/>'},
    streetCharm:{w:30,h:48,s:'<path class="nf" d="M12 7Q0-2 15 1q15-3 3 6"/><path class="st-fabric" d="M4 10h22v36H4Z"/><path class="st-gold" d="M15 17 22 25l-7 8-7-8Z"/><path class="nf" d="M8 40h14M15 7v7"/>'},
    streetFan:{w:56,h:43,s:'<path class="st-paper" d="M1 22Q10-7 28 1q18-8 27 21L28 37Z"/><path class="nf" d="M28 42V25M28 35 8 12M28 35 18 3M28 35 38 3M28 35 49 12"/>'},
    streetPostcard:{w:52,h:36,s:'<path class="st-paper" d="M1 1h50v34H1Z"/><path class="nf" d="M5 29 15 14l9 10 6-8 16 13M35 8h10"/><circle class="st-gold" cx="36" cy="11" r="4"/>'},
    streetKey:{w:48,h:26,s:'<circle class="st-gold" cx="12" cy="13" r="11"/><circle class="nf" cx="12" cy="13" r="5"/><path class="st-gold" d="M23 10h24v7h-6v7h-6v-7H23Z"/>'},
    streetBag:{w:38,h:43,s:'<path class="st-paper" d="M3 12h32l2 29H1Z"/><path class="nf" d="M11 13V7q8-12 16 0v6"/><path class="st-flower" d="M19 22q-5-7-8-1-2 4 4 5-5 5 0 7 4 1 4-5 5 5 8 1 2-4-4-5 4-6-1-6-2 0-3 4Z"/>'},
    streetUmbrella:{w:24,h:60,s:'<path class="st-fabric" d="M12 1 2 39h20Z"/><path class="nf" d="M12 3v47q0 16-9 6M12 11l-5 26M12 11l5 26"/>'},
    streetTaiyaki:{w:52,h:32,s:'<path class="st-bread" d="M2 16Q19-7 38 8l12-5-3 13 3 13-12-5Q19 39 2 16Z"/><circle cx="11" cy="14" r="1"/><path class="nf" d="M21 8v16M30 10v14M17 13h17M17 20h17M4 19h9"/>'},
    streetRibbon:{w:46,h:38,s:'<path class="st-fabric" d="M21 11 1 2v25l20-10-7 19 9-4 7 5-5-20 20 10V2L25 11Z"/><circle class="st-fabric" cx="23" cy="14" r="6"/>'}
  };
  Object.keys(bonus).forEach(function(k){art[k]=bonus[k];paint[k]='paper'});
  var things={};
  function find(k,name,clue,ph,anchor,max,line,rooms){things[k]={name:name,clue:clue,ph:ph,anchor:anchor,alt:anchor==='top'?'floor':'top',outdoor:1,max:max||1,rooms:rooms||{streetCafe:1,streetBookshop:1,streetRamen:1,streetFlorist:1,streetBakery:1,streetArcade:1,streetGrocer:1,streetMusic:1,streetSquare:1},lines:[line]};}
  find('streetCoin','Lucky coin','Low down beside the vending machines and shop signs.',30,'floor',2,'A lucky coin. Pickle recommends spending it immediately.');
  find('streetTicket','Train ticket','Beside shop fronts, benches and the post box.',28,'floor',2,'A train ticket. Sixpence refuses to reveal her destination.');
  find('streetCharm','Lucky charm','Beside the lanterns, crates and shop displays.',40,'floor',1,'A little lucky charm. Duchess says she requires no assistance.');
  find('streetFan','Folding fan','On an outdoor table or beside a shop.',31,'top',1,'A folding fan. Noodle prefers the breeze to be delivered personally.');
  find('streetPostcard','Postcard','Near the bookshop or on an outdoor table.',29,'top',1,'A postcard from Lantern Lane. Shadow declined to appear in the picture.');
  find('streetKey','Shop key','On a table, crate or beside a shop entrance.',24,'floor',1,'The shop key. Marmalade was guarding it by sitting in the doorway.');
  find('streetBag','Shopping bag','On the pavement beside shops and stalls.',39,'floor',1,'A shopping bag. Pudding would like to try it for size.');
  find('streetUmbrella','Folded umbrella','Beside shop signs, planters and café tables.',49,'floor',1,'A forgotten umbrella. Biscuit is hoping the owner comes back.');
  find('streetTaiyaki','Taiyaki cake','On an outdoor table or beside the food stalls.',27,'top',1,'A fish-shaped cake. Rumble has questions about this particular fish.');
  find('streetRibbon','Hair ribbon','Beside flower displays, shop signs and benches.',33,'floor',1,'A pretty ribbon. Crumpet is pretending he did not chase it.');
  var shops=['streetCafe','streetBookshop','streetRamen','streetFlorist','streetBakery','streetArcade','streetGrocer','streetMusic'];
  function plan(tall,s){
    var w=tall?5680:7200,n=tall?8:10,step=(w-200)/n,rooms=[],order=shops.slice(),state=(s^0x4A91B53D)|0;
    function random(){state=(Math.imul(state,1664525)+1013904223)|0;return (state>>>0)/4294967296;}
    for(var a=order.length-1;a>0;a--){var b=Math.floor(random()*(a+1)),saved=order[a];order[a]=order[b];order[b]=saved;}
    for(var i=0;i<n;i++){
      var shopKind=order[i%order.length],shopHeight=(shopKind==='streetArcade'?610:shopKind==='streetRamen'?545:580)+Math.round(random()*45);
      rooms.push({id:shopKind,x:100+i*step,y:110,w:step-20,h:720,outside:1,
        floor:['streetPlanter','streetAFrame','streetMailbox','streetVending','streetBlossom','streetBanner','bike'],
        setpieces:[{k:shopKind,fx:.02,h:shopHeight,on:'floor'},
          {k:shopKind==='streetBookshop'?'streetBookRack':shopKind==='streetArcade'?'streetClaw':shopKind==='streetFlorist'?'streetBlossom':shopKind==='streetGrocer'?'streetCrates':shopKind==='streetRamen'?'streetBanner':'streetAFrame',fx:.98,h:shopKind==='streetFlorist'?145:shopKind==='streetBookshop'||shopKind==='streetArcade'?115:shopKind==='streetGrocer'?80:135,on:'floor'}]});
    }
    var m=tall?6:8,span=(w-200)/m;
    for(var j=0;j<m;j++){
      var pieces=j%3===0?[{k:j%2?'streetTaiyakiStall':'streetRamenCart',fx:.08,on:'floor'},{k:'streetLanternPost',fx:.68,on:'floor'}]
        :j%3===1?[{k:'streetUmbrellaTable',fx:.1,on:'floor'},{k:'streetBobaCart',fx:.65,h:170,on:'floor'}]
        :[{k:'streetTeaTable',fx:.08,on:'floor'},{k:'streetFlowerCart',fx:.43,h:130,on:'floor'},{k:'streetVending',fx:.72,on:'floor'}];
      rooms.push({id:'streetSquare',x:100+j*span,y:980,w:span-25,h:310,outside:1,
        floor:['streetBlossom','streetBanner','streetBookRack','streetPlanter','streetAFrame','streetCrates','bike','bench','streetGacha','streetFlowerCart','streetClaw'],setpieces:pieces});
    }
    return {w:w,h:1450,rooms:rooms};
  }
  function landscape(node,make,w,h,s,reduced){
    var d='<path class="st-alley-ground" d="M-7200 350H14400V825H-7200Z"/>'+'<path class="st-paving" d="M-7200 825H14400V3000H-7200Z"/>'+
      '<path class="st-shop-pavement" d="M-7200 770H14400v105H-7200Z"/>'+
      '<path class="st-curb" d="M-7200 870H14400M-7200 1165H14400"/>'+
      '<path class="st-forecourt" d="M-7200 1170H14400v400H-7200Z"/>';
    for(var x=0;x<w;x+=160){d+='<path class="st-paving-line" d="M'+x+' 875l-35 290M'+x+' 1170l-30 310"/>';}
    d+='<path class="st-paving-line" d="M0 973H'+w+'M0 1070H'+w+'M0 1345H'+w+'"/>';
    node.appendChild(make('g',{'class':'street-landscape','pointer-events':'none'},d));
    var skyline='';
    for(var b=0;b<w;b+=300){
      var bh=140+((b/300+s)%4)*32, by=380-bh;
      skyline+='<path d="M'+b+' 380V'+by+'h45v-12h130v12h55v'+bh+'Z"/><path class="st-city-detail" d="M'+(b+25)+' '+(by+32)+'h25m30 0h25m30 0h25M'+(b+25)+' '+(by+66)+'h25m30 0h25m30 0h25M'+(b+80)+' '+(by-12)+'v-28h64v28"/>';
    }
    // Insert skyline before pavement; the real shops cover its bottom edge.
    var city=make('g',{'class':'st-skyline','pointer-events':'none'},skyline);node.insertBefore(city,node.lastChild);
    // Low alley fences give the spaces between shops a real back edge.
    var alleys='';
    for(var ax=0;ax<w;ax+=240){
      alleys+='<path class="st-alley-fence" d="M'+ax+' 824V672h228v152Z"/><path class="st-alley-detail" d="M'+(ax+16)+' 678v142m24-142v142m24-142v142m24-142v142m24-142v142m24-142v142m24-142v142m24-142v142M'+ax+' 716h228M'+ax+' 778h228"/>';
    }
    node.appendChild(make('g',{'class':'street-alley-fences','pointer-events':'none'},alleys));
    var gardens='', backShops=plan(w<6000,s).rooms.filter(function(r){return r.id!=='streetSquare'});
    backShops.forEach(function(r,i){
      if(i%2) return;
      var crown;
      // Separate lobes read clearly at the wide overview without extra textures.
      crown='<path class="st-blossom" d="M-87-206q-54-37-15-86-18-53 34-67 21-49 69-22 51-23 67 28 53 3 46 56 31 46-21 72-22 36-62 19-43 35-75 0-30 20-43 0Z"/><path class="st-flower-mark" d="M-67-280h15m-8-8v16M-12-337h15m-8-8v16M50-273h15m-8-8v16M-10-233h15m-8-8v16"/>';
      if(!reduced)crown+='<animateTransform attributeName="transform" type="rotate" values="-2 0 -210;3 0 -210;-2 0 -210" dur="7.8s" begin="-'+(i*.7)+'s" repeatCount="indefinite"/>';
      gardens+='<g transform="translate('+(r.x+r.w-80).toFixed(0)+' 809)"><path class="st-wood" d="M-8 0v-233H6V0Z"/><path class="st-stem" d="M-1-152-54-229M0-185l51-64"/><g>'+crown+'</g></g>';
    });
    node.appendChild(make('g',{'class':'street-alley-gardens','pointer-events':'none'},gardens));
    var drains='';
    for(var dx=340;dx<w;dx+=690) drains+='<g transform="translate('+dx+' 852)"><path class="st-drain" d="M0 0h68l-3 13H-3Z"/><path class="st-drain-slot" d="M8 3l-2 7m12-7-2 7m12-7-2 7m12-7-2 7m12-7-2 7m12-7-2 7"/></g>';
    node.appendChild(make('g',{'class':'street-drains','pointer-events':'none'},drains));
    var wire='<path class="st-wire" d="M90 90Q'+(w/2)+' 220 '+(w-90)+' 90"/>';
    for(var lx=230;lx<w;lx+=560){
      var y=90+65*4*(lx/w)*(1-lx/w);
      var glow='<path class="st-lantern-fill" d="M-22 24q22-18 44 0v45q-22 18-44 0Z"/><path class="st-line" d="M-16 18h32M-16 75h32M-10 21v51M10 21v51"/>';
      if(!reduced)glow+='<animateTransform attributeName="transform" type="rotate" values="-5 0 0;5 0 0;-5 0 0" dur="5.5s" begin="-'+(lx/w*4).toFixed(2)+'s" repeatCount="indefinite"/>';
      wire+='<g transform="translate('+lx+' '+y.toFixed(1)+')"><path class="st-wire" d="M0 0v21"/><g class="st-lantern">'+glow+'</g></g>';
    }
    for(var px=440;px<w;px+=560){
      var py=90+65*4*(px/w)*(1-px/w), flag='';
      ['#D89AA6','#A4BCA0','#ECC181'].forEach(function(c,i){flag+='<path class="st-pennant" fill="'+c+'" d="M'+(i*30)+' 0h26l-13 34Z"/>'});
      if(!reduced)flag+='<animateTransform attributeName="transform" type="skewX" values="-6;8;-6" dur="6.4s" begin="-'+(px/w*5).toFixed(2)+'s" repeatCount="indefinite"/>';
      wire+='<g transform="translate('+px+' '+py.toFixed(1)+')"><g>'+flag+'</g></g>';
    }
    node.appendChild(make('g',{'class':'street-lantern-string','pointer-events':'none'},wire));
    // Festival entrance ornaments stay above the shops, away from both walking lanes.
    var festival='';
    for(var fa=0;fa<2;fa++){
      var gateX=fa===0?110:w-475;
      festival+='<g transform="translate('+gateX+' 120)"><path class="st-festival-roof" d="M0 18Q30 16 42 0h270q12 16 42 18l-11 17H11Z"/><path class="st-festival-sign" d="M43 38h268v61H43Z"/><text class="st-festival-label" x="177" y="78" text-anchor="middle">ねこ祭り · NEKO MATSURI</text><path class="st-fine" d="M50 91h254M28 26h296"/></g>';
    }
    node.appendChild(make('g',{'class':'street-festival','pointer-events':'none'},festival));
    // A small fixed number of petals, regardless of screen resolution.
    var petals='';
    for(var p=0;p<8;p++){
      var petal='<path class="st-petal" d="M0 0q18-15 22 0-8 19-22 0Z"/>';
      if(!reduced)petal+='<animateTransform attributeName="transform" type="translate" values="-100 -30;130 15;340 70" dur="'+(15+p%3*3)+'s" begin="-'+(p*2.1).toFixed(1)+'s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;.85;.85;0" keyTimes="0;.15;.75;1" dur="'+(15+p%3*3)+'s" begin="-'+(p*2.1).toFixed(1)+'s" repeatCount="indefinite"/>';
      petals+='<g transform="translate('+(180+p*w/8).toFixed(0)+' '+(920+p%3*55)+')"><g>'+petal+'</g></g>';
    }
    node.appendChild(make('g',{'class':'street-breeze-petals','pointer-events':'none'},petals));

  }
  function motion(k,inner,x,w,reduced,breeze){
    if(reduced)return inner;
    var phase=(x/w*6).toFixed(2);
    inner=inner.replace(/<g class="st-curtain">/g,'<g class="st-curtain">'+breeze(k==='streetRamenCart'?110:207,k==='streetRamenCart'?28:200,5.5,6.5,phase));
    inner=inner.replace(/<g class="st-steam">/g,'<g class="st-steam"><animateTransform attributeName="transform" type="translate" values="0 4;3 -10;0 -20" dur="2.5s" begin="-'+phase+'s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;.9;0" dur="2.5s" begin="-'+phase+'s" repeatCount="indefinite"/>');
    inner=inner.replace(/<g class="st-stall-cloth">/g,'<g class="st-stall-cloth">'+breeze(110,26,6,6,phase));
    inner=inner.replace(/<g class="st-banner-cloth">/g,'<g class="st-banner-cloth">'+breeze(18,19,9,5.8,phase));
    inner=inner.replace(/<g class="st-parasol">/g,'<g class="st-parasol">'+breeze(105,67,3,7,phase));
    inner=inner.replace(/<g class="st-plant-crown">/g,'<g class="st-plant-crown">'+breeze(57,95,8,6.2,phase));
    inner=inner.replace(/<g class="st-blossom-crown">/g,'<g class="st-blossom-crown">'+breeze(86,108,4,7.5,phase));
    inner=inner.replace(/<g class="st-hanging-sign">/g,'<g class="st-hanging-sign">'+breeze(250,123,4,6.7,phase));
    inner=inner.replace(/<g class="st-disc">/g,'<g class="st-disc"><animateTransform attributeName="transform" type="rotate" from="0 130 80" to="360 130 80" dur="18s" repeatCount="indefinite"/>');
    if(k==='streetArcade') inner=inner.replace('19-3Z"/>','19-3Z"><animate attributeName="opacity" values="1;.55;1" dur="3.8s" repeatCount="indefinite"/></path>');
    if(k==='streetLanternPost'){
      var lamp=0;
      inner=inner.replace(/<g class="st-lantern">/g,function(){return '<g class="st-lantern">'+breeze(lamp++?91:29,51,6,5.5,phase)});
    }
    inner=inner.replace('<g class="st-wind-chime">','<g class="st-wind-chime">'+breeze(234,99,9,7.1,phase));
    if(k==='streetBobaCart')inner=inner.replace('<g class="st-boba-fringe">','<g class="st-boba-fringe">'+breeze(105,31,6,6.2,phase));
    if(k==='streetFlowerCart')inner=inner.replace('<g class="st-cart-bouquets">','<g class="st-cart-bouquets">'+breeze(90,91,5,7.4,phase));
    if(k==='streetClaw')inner=inner.replace('<g class="st-claw-arm">','<g class="st-claw-arm"><animateTransform attributeName="transform" type="translate" values="-12 0;12 0;12 18;-12 0" keyTimes="0;.4;.6;1" dur="8s" begin="-'+phase+'s" repeatCount="indefinite"/>');
    return inner;
  }
  function clear(x,bottom,w,h){return bottom<=875 || bottom-Math.min(36,h*.3)>=1170;}
  function catMeta(kind,c){
    var pref={cat_highsit:{streetCafe:1,streetBookshop:1,streetVending:1},cat_loaf:{streetRamenCart:1,streetTaiyakiStall:1,streetTeaTable:1},cat_curled:{streetTeaTable:1,bench:1},cat_peek:{streetVending:1,streetGacha:1,streetPlanter:1,streetMailbox:1},cat_flop:{streetUmbrellaTable:1,bench:1},cat_playing:{streetCrates:1,streetBookRack:1,streetAFrame:1},cat_walking:{streetCrates:1,streetRamenCart:1,streetTaiyakiStall:1}};
    return Object.assign({},c,{rooms:null,must:null,prefer:pref[kind]||{streetPlanter:1,streetAFrame:1}});
  }
  function hides(kind){return {cat_highsit:'On shop roofs or vending machines',cat_loaf:'Above the food stalls or beside warm tea',cat_curled:'On café tables and benches',cat_peek:'Behind vending and capsule machines, planters and post boxes',cat_flop:'Sprawled beside the outdoor café furniture',cat_playing:'Around market crates, manga racks and shop signs',cat_walking:'Low down beside market crates and food stalls'}[kind]||'Along the shop fronts and outdoor tables';}
  var occasion={id:'shopping',hook:'Lanterns on.',hookSub:'Gather the cats before the shops close',goal:'every cat found before the shops close',eyebrow:'An evening on Lantern Lane',title:'Everyone together on Lantern Lane',lede:'Shutters coming down, one last bowl of ramen, and every familiar face accounted for.',payoff:'Everyone found.',payoffSub:'{n} cats, one lovely evening',foundMsg:' is joining us on Lantern Lane',room:'streetSquare',weathers:['breezy','clear'],sky:'evening',prop:'streetTeaTable',propH:40,on:'beside'};
  global.HKKStreet=Object.freeze({art:art,paint:paint,height:height,surface:surface,surfaceY:{streetTeaTable:14,streetUmbrellaTable:136,streetRamenCart:5,streetTaiyakiStall:4,streetBobaCart:6,streetClaw:5},tall:tall,things:things,plan:plan,landscape:landscape,motion:motion,clear:clear,catMeta:catMeta,hides:hides,occasion:occasion});
})(window);
