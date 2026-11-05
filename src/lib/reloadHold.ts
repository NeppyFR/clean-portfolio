/** Where the cinematic section keeps a retired visitor's position across a reload. */
export const LEFT_AT = "cinematic-left-at";
export const HOLD_ID = "cinematic-hold";

/**
 * Runs in <head>, before anything paints. Restoring that position has to wait for
 * hydration, and until then a slow phone would show the hero and then jump, so the
 * page stays blank instead, in the colour of the light sections below the hero. A
 * position still on the hero needs no hold, and only the home page has the section
 * that lifts it. The timeout makes sure a failed script cannot leave it blank for
 * good. CinematicSection takes the hold off as soon as it has restored.
 */
export const HOLD_SCRIPT = `(function(){try{
var n=performance.getEntriesByType("navigation")[0];
if(location.pathname!=="/"||!n||(n.type!=="reload"&&n.type!=="back_forward"))return;
var l=JSON.parse(sessionStorage.getItem("${LEFT_AT}"));
if(!l||!(l.y>innerHeight))return;
var s=document.createElement("style");
s.id="${HOLD_ID}";
s.textContent="html{background:#f7f7f8}body{visibility:hidden}";
document.head.appendChild(s);
setTimeout(function(){s.remove()},2500);
}catch(e){}})()`;
