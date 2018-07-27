/*!
 * ${copyright}
 */
sap.ui.define(["jquery.sap.global","sap/ui/model/json/JSONModel","sap/m/MessageBox"],function(e,i,a){"use strict";return i.extend("ui5lab.browser.model.SampleModel",{constructor:function(){i.apply(this,arguments);this.setSizeLimit(1e4);setTimeout(function(){this._iStartTime=(new Date).getTime();this._loadLibraries()}.bind(this),0);return this},loaded:function(){if(!this._oSamplesLoadedPromise){this._oSamplesLoadedPromise=new Promise(function(e,i){this._fnSamplesLoadedResolve=e;this._fnSamplesLoadedReject=i}.bind(this))}return this._oSamplesLoadedPromise},_loadLibraries:function(){var i=new Promise(function(i,t){e.ajax(e.sap.getModulePath("ui5lab.browser","/libraries.json"),{dataType:"json",success:function(e){var t=e.libraries;this._oMetadata={};this._iLibraryCount=t.length;this._iLibraryLoadedCount=0;if(t.length>0){for(var s=0;s<t.length;s++){this._loadSamples(t[s],i)}}else{a.information("No libraries configured, please add a libraries.json file");i()}}.bind(this),error:t})}.bind(this));i.then(this._onMetadataLoaded.bind(this),this._onError.bind(this))},_loadSamples:function(i,a,t){e.ajax(e.sap.getModulePath("libs."+i,"/index.json"),{dataType:"json",success:function(e){this._oMetadata[i]=e[i];this._iLibraryLoadedCount++}.bind(this),error:function(){e.sap.log.warning("Library metadata for '"+i+"' could not be loaded, check if index.json file is configured properly");this._iLibraryCount--}.bind(this),complete:function(){if(this._iLibraryCount===this._iLibraryLoadedCount){a()}}.bind(this)})},_onMetadataLoaded:function(){e.sap.log.info("SampleModel: Loaded all samples in "+((new Date).getTime()-this._iStartTime)+" ms");var i=this._processMetadata(this._oMetadata);this.setProperty("/",i);this.updateBindings(true);this._fnSamplesLoadedResolve()},_processMetadata:function(e){var i={libraries:[],assets:[],samples:[]};a=e;var a=Object.keys(a);for(var t=0;t<a.length;t++){e[a[t]].id=a[t];i.libraries.push(e[a[t]]);var s=Object.keys(e[a[t]].content);for(var o=0;o<s.length;o++){var r=e[a[t]].content[s[o]];r.id=a[t]+"."+r.id;r.library=a[t];i.assets.push(r);for(var n=0;n<r.samples.length;n++){var d=r.samples[n];d.id=r.id+"."+d.id;d.asset=r.id;d.library=a[t];i.samples.push(d)}}}return i},_onError:function(e){e.error="Failed to load the metadata, check for parse errors";this.fireRequestFailed({response:e});this._fnSamplesLoadedReject()}})});