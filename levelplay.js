/* One ad provider. The browser remains ad-free; native requests use LevelPlay. */
(function(global){
  'use strict';
  function nativePlugin(){
    var c=global.Capacitor;
    return c&&c.isNativePlatform&&c.isNativePlatform()&&c.Plugins&&c.Plugins.HKKLevelPlay||null;
  }
  function config(){var c=global.Capacitor;return (global.HKKLevelPlayConfig||{})[c&&c.getPlatform&&c.getPlatform()]||{}}
  function configured(){var c=global.Capacitor,k=config();return !!(nativePlugin()&&k.appKey&&k.banner&&k.rewarded&&(!c.DEBUG||global.HKKLevelPlayConfig.debugTestsEnabled))}
  function testSuiteOnly(){return !!(configured()&&global.Capacitor.DEBUG&&global.HKKLevelPlayConfig.debugTestSuiteOnly)}
  var initFlight=null,bannerListener=null,bannerSize=null;
  function initialize(){
    if(!configured())return Promise.resolve(false);
    if(initFlight)return initFlight;
    initFlight=new Promise(function(resolve){
      var done=false,cap=setTimeout(function(){finish(false)},20000);
      function finish(ok){if(done)return;done=true;clearTimeout(cap);resolve(ok)}
      Promise.resolve().then(function(){var options=Object.assign({},config(),{testSuite:!!global.Capacitor.DEBUG&&!!global.HKKLevelPlayConfig.debugTestsEnabled});return nativePlugin().initialize(options)}).then(function(){finish(true)},function(){finish(false)});
    }).then(function(ok){initFlight=null;return ok});
    return initFlight;
  }
  function banner(size){
    if(!configured()||testSuiteOnly())return Promise.resolve(false);
    bannerSize=size;
    if(!bannerListener)bannerListener=Promise.resolve(nativePlugin().addListener('bannerSize',function(data){if(bannerSize)bannerSize(data)})).catch(function(){bannerListener=null;return null});
    return bannerListener.then(function(handle){if(!handle)throw new Error('Banner listener unavailable');return nativePlugin().banner()}).then(function(){return true}).catch(function(){size({height:0});return false});
  }
  function removeBanner(){var p=nativePlugin();return Promise.resolve().then(function(){return p&&p.removeBanner()}).catch(function(){}).then(function(){if(bannerSize)bannerSize({height:0})})}
  function rewarded(){
    if(!configured()||testSuiteOnly())return Promise.resolve('none');
    return nativePlugin().rewarded().then(function(r){return r&&['earned','skipped','none'].indexOf(r.outcome)>=0?r.outcome:'none'}).catch(function(){return 'none'});
  }
  function testSuite(){if(!configured()||!global.Capacitor.DEBUG)return Promise.resolve(false);return initialize().then(function(ok){return ok?nativePlugin().testSuite().then(function(){return true}):false}).catch(function(){return false})}
  global.HKKLevelPlay=Object.freeze({native:function(){return !!nativePlugin()},configured:configured,testSuiteOnly:testSuiteOnly,initialize:initialize,banner:banner,removeBanner:removeBanner,rewarded:rewarded,testSuite:testSuite,units:config});
})(window);
