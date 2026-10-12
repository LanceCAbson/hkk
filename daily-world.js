/* Shared daily briefs. No device settings or random layout draws enter here. */
(function(global){
  'use strict';
  function goal(name,hook,sub,weather,sky,line){return {goalName:name,hook:hook,hookSub:sub,goal:sub.charAt(0).toLowerCase()+sub.slice(1),weathers:weather,sky:sky,line:line||'likes'}}
  var goals={
    park:[
      goal('Picnic reunion','Picnic time.','Gather every cat for a picnic on the lawn',['clear','breezy'],'day'),
      goal('Vet pickup','Vet van at the gates.','Find every cat before the vet van arrives',['clear','rain'],'dawn','vet'),
      goal('Storm shelter','Rain on the way.','Bring every cat to shelter before the storm',['storm'],'evening','storm'),
      goal('Closing time','One last park walk.','Gather every cat before the park gates close',['breezy','rain'],'evening','sleeps')
    ],
    shopping:[
      goal('Market closing','Lanterns on.','Gather every cat before the shops close',['clear','breezy'],'evening'),
      goal('Breakfast club','Fresh buns are ready.','Find every cat for breakfast in the square',['clear','breezy'],'dawn'),
      goal('Rainy rendezvous','Umbrellas up.','Bring every cat under cover before the downpour',['rain','storm'],'day','storm'),
      goal('Vet delivery','The vet is on the way.','Gather every cat for a checkup by the square',['clear','rain'],'day','vet')
    ],
    harbour:[
      goal('All aboard','The boats are leaving.','Find every cat before the boats set sail',['clear','breezy'],'day'),
      goal('Tide watch','The tide is turning.','Gather every cat from the shore before high tide',['breezy','rain'],'evening','storm'),
      goal('Vet ferry','Vet ferry at nine.','Bring every cat together before the vet ferry docks',['clear','rain'],'dawn','vet'),
      goal('Harbour storm','Storm off the coast.','Find every cat and take shelter from the storm',['storm'],'evening','storm')
    ],
    onsen:[
      goal('Mountain tea','Tea is getting cold.','Gather every cat for tea in the mountain garden',['clear','breezy'],'evening'),
      goal('Rain retreat','Rain in the mountains.','Find every cat before the mountain rain arrives',['rain','storm'],'day','storm'),
      goal('Morning checkup','The village vet is here.','Gather every cat for a gentle morning checkup',['clear','rain'],'dawn','vet'),
      goal('Lantern bedtime','Last lanterns glowing.','Bring every cat together before the village sleeps',['clear','breezy'],'night','sleeps')
    ]
  };
  var houseNames={bedtime:'Bedtime roundup',supper:'Dinner reunion',vet:'Vet at nine',storm:'Storm shelter'};
  var labels={clear:'Clear skies',breezy:'Breezy',rain:'Rain',storm:'Storm coming'};
  function brief(day,location,base,houses){
    var visit=Math.floor((day-283)/5), list=goals[location], result;
    if(list){
      var index=((visit%list.length)+list.length)%list.length;
      result=Object.assign({},houses[1],base,list[index]);
      result.eyebrow=result.goalName;
      result.title=result.goalName+' · everyone together';
      result.lede='Every familiar face accounted for. Safe paws, happy cats, and a moment to breathe.';
      result.payoff="Everyone's here.";result.payoffSub='{n} cats, all safe and together';
      result.foundMsg=' is joining the others';
    }else{
      result=Object.assign({},houses[Math.abs(day)%houses.length]);
      result.goalName=houseNames[result.id];
    }
    result.weather=result.weathers[Math.floor(Math.abs(day)/houses.length)%result.weathers.length];
    return result;
  }
  global.HKKDailyWorld=Object.freeze({brief:brief,weatherLabel:function(w){return labels[w]||labels.clear}});
})(window);
