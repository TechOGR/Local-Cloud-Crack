const user_agent = navigator.userAgent

const footer = document.querySelector("footer")
const main_content_index = document.querySelector(".main_content")

const all_links = {
    youtube: "https://www.youtube.com/@OnelCrack",
    facebook: "https://www.facebook.com/profile.php?id=100092376152191",
    twitter: "https://twitter.com/Onel_Crack?t=NFwmb3M7Gb8dr-B9oUubaw&s=09",
    instagram: "https://www.instagram.com/onel_crack/",
    github: "https://github.com/TechOGR",
};

const instagram = document.getElementById("instagram");
const youtube = document.getElementById("youtube");
const facebook = document.getElementById("facebook");
const twitter = document.getElementById("twitter");
const github = document.getElementById("github");

if (user_agent.match(/Android/i) || user_agent.match(/iPhone/i)) {
    footer.style.cssText = "top: 80vh";
    main_content_index.style.cssText = "height: 80vh";

    instagram.addEventListener("click", (event) => {
        window.open(all_links.instagram);
    });

    facebook.addEventListener("click", (event) => {
        window.open(all_links.facebook);
    });

    twitter.addEventListener("click", (event) => {
        window.open(all_links.twitter);
    });

    github.addEventListener("click", (event) => {
        window.open(all_links.github);
    });

    youtube.addEventListener("click", (event) => {
        window.open(all_links.youtube);
    });
}