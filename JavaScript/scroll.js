document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');

    if (slides.length > 0) {
        const firstSlide = slides[0];
        const firstImg = firstSlide.querySelector('img');
        const firstLayout = firstSlide.querySelector('.slide-layout');

        if (firstImg) {
            firstImg.style.filter = 'brightness(0.7)';
            firstImg.style.transform = 'rotate(180deg) scale(1)';
        }

        if (firstLayout) {
            firstLayout.style.opacity = '1';
            firstLayout.style.transform = 'translateY(0)';
        }

        firstSlide.style.setProperty('--overlay-opacity', '0');
        firstSlide.style.zIndex = '100';
    }


    const calculateProgress = (element) => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        let progress = 1 - (rect.top / windowHeight);

        progress = Math.min(Math.max(progress, 0), 1);

        return progress;
    };

    const smoothStep = (t) => {
        return t * t * (3 - 2 * t);
    };

    const updateSlides = () => {
        const windowHeight = window.innerHeight;

        slides.forEach((slide, index) => {
            const progress = calculateProgress(slide);
            const smoothProgress = smoothStep(progress);

            const img = slide.querySelector('img');
            const layout = slide.querySelector('.slide-layout');

            if (progress > 0 && progress < 1) {
                if (img) {
                    const brightness = 0.4 + (smoothProgress * 0.6);
                    img.style.filter = `brightness(${brightness})`;
                    img.style.transform = `rotate(180deg) scale(${1.05 - smoothProgress * 0.05})`;
                }

                if (layout) {
                    layout.style.opacity = smoothProgress.toString();
                    layout.style.transform = `translateY(${40 * (1 - smoothProgress)}px)`;
                }

                slide.style.setProperty('--overlay-opacity', '0');

                slide.style.zIndex = slides.length - index;
            }

            if (index > 0 && progress > 0) {
                const prevSlide = slides[index - 1];
                const prevProgress = calculateProgress(prevSlide);

                if (prevProgress > 0) {
                    const prevSmoothProgress = smoothStep(progress); // Используем прогресс текущего слайда

                    const prevImg = prevSlide.querySelector('img');
                    if (prevImg) {
                        const prevBrightness = 0.7 - (prevSmoothProgress * 0.3);
                        prevImg.style.filter = `brightness(${Math.max(prevBrightness, 0.4)})`;
                    }

                    const prevLayout = prevSlide.querySelector('.slide-layout');
                    if (prevLayout) {
                        prevLayout.style.opacity = (1 - prevSmoothProgress).toString();
                        prevLayout.style.transform = `translateY(${-40 * prevSmoothProgress}px)`;
                    }


                    prevSlide.style.setProperty('--overlay-opacity', prevSmoothProgress.toString());

                    prevSlide.style.zIndex = slides.length - index - 1;
                }
            }

            if (progress <= 0 && index > 0) {
                slide.style.setProperty('--overlay-opacity', '1');
                if (img) {
                    img.style.filter = 'brightness(0.4)';
                }
                if (layout) {
                    layout.style.opacity = '0';
                }
            }
        });
    };

    let isScrolling = false;
    const handleScroll = () => {
        if (!isScrolling) {
            isScrolling = true;
            requestAnimationFrame(() => {
                updateSlides();
                isScrolling = false;
            });
        }
    };

    const handleResize = () => {
        updateSlides();
    };


    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);


    updateSlides();
});