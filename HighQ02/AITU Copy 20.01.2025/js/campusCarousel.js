const galleryContainer = document.querySelector(".gallery-container")
const galleryControlsContainer = document.querySelector(".gallery-controls")
const galleryControls = ["previous", "next"]
const galleryItems = document.querySelectorAll(".gallery-item")
const videoBlock = document.querySelector(".video-block");
const videos = document.querySelectorAll(".video-container video");
const closeButton = document.querySelector(".close-button");
const navigationBlock = document.querySelector(".navigation-block");

class Carousel {
    constructor(container, items, controls) {
        this.carouselContainer = container;
        this.carouselControls = controls;
        this.carouselArray = [...items];
    }

    updateGallery() {
        this.carouselArray.forEach(el => {
            el.classList.remove("gallery-item-1")
            el.classList.remove("gallery-item-2")
            el.classList.remove("gallery-item-3")
            el.classList.remove("gallery-item-4")
            el.classList.remove("gallery-item-5")
        })

        this.carouselArray.slice(0, 5).forEach((el, i) => {
            el.classList.add(`gallery-item-${i+1}`)
        })

        this.updatePlayButtonEvents();
    }

    setCurrentState(direction) {
        if (direction.className == "gallery-controls-previous") {
            this.carouselArray.unshift(this.carouselArray.pop())
        } else {
            this.carouselArray.push(this.carouselArray.shift());
        }
        this.updateGallery();
    }

    setControls() {
        this.carouselControls.forEach(control => {
            galleryControlsContainer.appendChild(document.createElement("button")).className = `gallery-controls-${control}`
        })
    }

    useControls() {
        const triggers = [...galleryControlsContainer.childNodes]
        triggers.forEach(control => {
            control.addEventListener("click", e => {
                e.preventDefault()
                this.setCurrentState(control)
            })
        })
    }

    updatePlayButtonEvents() {
        if (this.currentGalleryItem3) {
            this.currentGalleryItem3.removeEventListener("mouseenter", this.handleMouseEnter);
            this.currentGalleryItem3.removeEventListener("mouseleave", this.handleMouseLeave);
            this.currentGalleryItem3.removeEventListener("click", this.handleClick);
        }

        this.currentGalleryItem3 = document.querySelector(".gallery-item-3");
        this.playButtons = document.querySelector(".play-button");

        if (this.currentGalleryItem3) {
            this.currentGalleryItem3.addEventListener("mouseenter", this.handleMouseEnter);
            this.playButtons.addEventListener("mouseenter", this.handleMouseEnter)
            this.currentGalleryItem3.addEventListener("mouseleave", this.handleMouseLeave);
            this.playButtons.addEventListener("mouseleave", this.handleMouseLeave)
            this.currentGalleryItem3.addEventListener("click", this.handleClick.bind(this));
            this.playButtons.addEventListener("click", this.handleClick.bind(this))
        }

    }

    handleMouseEnter() {
        const playButtonSvgs = document.querySelectorAll(".play-button-svg");

        playButtonSvgs.forEach(element => {
            element.style.width = "85px";
            element.style.height = "85px";
            element.style.transition = "all 0.2s ease-out"
        });
    }

    handleMouseLeave() {
        const playButtonSvgs = document.querySelectorAll(".play-button-svg");

        playButtonSvgs.forEach(element => {
            element.style.width = "70px";
            element.style.height = "70px";
        });
    }

    handleClick() {
        const index = this.currentGalleryItem3.getAttribute("data-index");
        const videoToPlay = [...videos].find(video => video.getAttribute("data-index") === index);

        if (videoToPlay) {
            videos.forEach(v => {
                v.style.visibility = "hidden";
                v.pause();
            });
            videoBlock.style.display = "none";
            navigationBlock.style.position = "absolute";

            videoToPlay.style.visibility = "visible";
            videoBlock.style.display = "block";

            videoToPlay.play();
        }
    }
}

const exampleCarousel = new Carousel(galleryContainer, galleryItems, galleryControls)
exampleCarousel.setControls()
exampleCarousel.useControls()
exampleCarousel.updatePlayButtonEvents();

function hideVideo() {
    videos.forEach(video => {
        video.style.visibility = "hidden";
        video.pause();
    });
    videoBlock.style.display = "none";
    navigationBlock.style.position = "fixed";
}

closeButton.addEventListener("click", hideVideo);

window.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        hideVideo();
    }
});