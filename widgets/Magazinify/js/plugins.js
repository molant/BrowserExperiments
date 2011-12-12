
// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  arguments.callee = arguments.callee.caller;  
  if(this.console) console.log( Array.prototype.slice.call(arguments) );
};
// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c})(window.console=window.console||{});

/* ========================================================
 * bootstrap-tabs.js v1.3.0
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2011 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */
!function($){function activate(element,container){container.find('> .active').removeClass('active').find('> .dropdown-menu > .active').removeClass('active')
element.addClass('active')
if(element.parent('.dropdown-menu')){element.closest('li.dropdown').addClass('active')}}
function tab(e){var $this=$(this),$ul=$this.closest('ul:not(.dropdown-menu)'),href=$this.attr('href'),previous
if(/^#\w+/.test(href)){e.preventDefault()
if($this.parent('li').hasClass('active')){return}
previous=$ul.find('.active a').last()[0]
$href=$(href)
activate($this.parent('li'),$ul)
activate($href,$href.parent())
$this.trigger({type:'change',relatedTarget:previous})}}
$.fn.tabs=$.fn.pills=function(selector){return this.each(function(){$(this).delegate(selector||'.tabs li > a, .pills > li > a','click',tab)})}
$(document).ready(function(){$('body').tabs('ul[data-tabs] li > a, ul[data-pills] > li > a')})}(window.jQuery||window.ender);
