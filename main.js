function loco(){
    gsap.registerPlugin(ScrollTrigger);

// Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

const locoScroll = new LocomotiveScroll({
  el: document.querySelector("#main"),
  smooth: true
});
// each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
locoScroll.on("scroll", ScrollTrigger.update);

// tell ScrollTrigger to use these proxy methods for the "#main" element since Locomotive Scroll is hijacking things
ScrollTrigger.scrollerProxy("#main", {
  scrollTop(value) {
    return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
  }, // we don't have to define a scrollLeft because we're only scrolling vertically.
  getBoundingClientRect() {
    return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
  },
  // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
  pinType: document.querySelector("#main").style.transform ? "transform" : "fixed"
});

// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
ScrollTrigger.refresh();
}
loco()

// ----------- Scrool Type

var clutter1 = "";

document.querySelector(".about .scroll-typer").textContent.split("").forEach(function(dets){
    clutter1 += `<span>${dets}</span>`

    document.querySelector(".about .scroll-typer").innerHTML = clutter1;
})


gsap.to(".about .scroll-typer>span",{
    scrollTrigger:{
        trigger:`.about .scroll-typer> span`,
        start:`top bottom`,
        end:`bottom 25%`,
        scroller:`#main`,
        scrub:.5,
    },
    stagger:.2,
    color:`#fefefe`
})

gsap.to(".skills-sect .skill", {
  scrollTrigger: {
    trigger: ".skills-sect .skill",
    start: "center bottom",
    end: "bottom top",
    scroller: '#main',
    scrub: .5
  },
  stagger: 1,
  opacity: 1
})

var clutter2 = "";

document.querySelector(".skills .topic-title").textContent.split("").forEach(function(dets){
    clutter2 += `<span>${dets}</span>`

    document.querySelector(".skills .topic-title").innerHTML = clutter2;
})

gsap.to(".skills .topic-title > span", {
  scrollTrigger:{
    trigger:`.skills .topic-title > span`,
    start:`bottom bottom`,
    end:`bottom 25%`,
    scroller:`#main`,
    scrub:.5,
  },
  stagger:.2,
  color:`#fefefe`
})

var clutter3 = "";

document.querySelector(".projects .topic-title").textContent.split("").forEach(function(dets){
    clutter3 += `<span>${dets}</span>`

    document.querySelector(".projects .topic-title").innerHTML = clutter3;
})

gsap.to(".projects .topic-title > span", {
  scrollTrigger:{
    trigger:`.projects .topic-title > span`,
    start:`bottom bottom`,
    end:`bottom 25%`,
    scroller:`#main`,
    scrub:.5,
  },
  stagger:.2,
  color:`#fefefe`
})

gsap.to(".semi-about", {
  scrollTrigger:{
    trigger:`.semi-about`,
    start:`top bottom`,
    end:`bottom 80%`,
    scroller:`#main`,
    scrub: .2,
  },
  opacity: 1
})


gsap.to(".projects .grid-wrapper", {
  scrollTrigger:{
    trigger:`.projects .grid-wrapper`,
    start:`top bottom`,
    end:`bottom 80%`,
    scroller:`#main`,
    scrub: .2,
  },
  opacity: 1
})