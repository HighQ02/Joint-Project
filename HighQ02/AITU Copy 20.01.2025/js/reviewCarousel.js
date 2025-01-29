const reviewSlider = document.querySelector(".reviews-slider")
const reviewControlsSlider = document.querySelector(".reviews-controls")
const reviewControls = ["previous", "next"]
const reviewItems = document.querySelectorAll(".review-item")
const reviewSwitch = document.querySelectorAll(".switch");

class reviewCarousel {
    constructor(slider, items, controls, switchs) {
        this.carouselSlider = slider;
        this.carouselControls = controls;
        this.carouselArray = [...items];
        this.carouselSwitch = [...switchs]
    }

    updateReview() {
        this.carouselArray.forEach(el => {
            el.classList.remove("review-item-1")
            el.classList.remove("review-item-2")
            el.classList.remove("review-item-3")
        })
        this.carouselSwitch.slice(0, 3).forEach(sw => {
            sw.classList.remove("switch-color-1")
            sw.classList.remove("switch-color-2")
            sw.classList.remove("switch-color-3")
        })

        this.carouselArray.slice(0, 3).forEach((el, i) => {
            el.classList.add(`review-item-${i+1}`)
            this.carouselSwitch.slice(0, 3).forEach((sw, j) => {
                sw.classList.add(`switch-color-${j+1}`)
            })
        })

        this.updateSwitches();
    }

    setCurrentState(direction) {
        if (direction.className == "review-controls-previous") {
            this.carouselArray.unshift(this.carouselArray.pop())
            this.carouselSwitch.unshift(this.carouselSwitch.pop())
        } else {
            this.carouselArray.push(this.carouselArray.shift());
            this.carouselSwitch.push(this.carouselSwitch.shift());
        }
        this.updateReview();
    }

    setControls() {
        this.carouselControls.forEach(control => {
            reviewControlsSlider.appendChild(document.createElement("button")).className = `review-controls-${control}`
        })
    }

    useControls() {
        const triggers = [...reviewControlsSlider.childNodes]
        triggers.forEach(control => {
            control.addEventListener("click", e => {
                e.preventDefault()
                this.setCurrentState(control)
            })
        })
    }
}

const review = new reviewCarousel(reviewSlider, reviewItems, reviewControls, reviewSwitch)
review.setControls()
review.useControls()