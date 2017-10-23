$(function () {
    let arrow = document.getElementById('arrow');
    let music_btn = document.querySelector('.music_btn');
    music_btn.style.display = 'none';
    arrow.style.display = 'none';
    let page = document.getElementById('page');
    let finger_div = page.getElementsByClassName('finger_div')[0];
    let finger_img = page.getElementsByClassName('finger-img')[0];
    let finger_line = page.getElementsByClassName('finger-line')[0];
    //解决click 300ms
    if ('addEventsListener' in window) {
        document.addEventListener('DOMContentLoaded', function () {
            FastClick.attach(document.body);
        })
    }
    //指纹扫码
    finger_img.addEventListener('click', function () {
        finger_line.style.display = finger_div.style.display = 'block';
    });
    finger_line.addEventListener('webkitAnimationEnd', function () {
        finger_div.innerText = '扫描成功';
        finger_line.style.display = 'none';
        new Swiper('#container', {
            direction: 'vertical',
            loop: true,
            onTransitionEnd: function (swiper) {
                let cn = 'page';
                let curInd = swiper.activeIndex;
                let slides = swiper.slides;
                let len = slides.length;
                console.log(curInd);
                switch (curInd) {
                    case len - 1:
                        cn += 1;
                        break;
                    case 0:
                        cn += len - 2;
                        break;
                    default:
                        cn += curInd;
                }
                slides.eq(curInd).attr('id', cn).siblings().removeAttr('id');
            }
        });
        setTimeout(function () {
            page.style.display = 'none';
            arrow.style.display = 'block';
            music_btn.style.display = 'block';
        }, 200);
    });
    //music
    let $music_btn = $('.music_btn');
    let music = $('.music')[0];
    $(music).on('canplay', function () {
        $music_btn.attr('id', 'rotate');
        music.play();
    });
    $music_btn.on('click', function () {
        if (music.paused) {
            music.play();
            $music_btn.attr('id', 'rotate');
        }
        else {
            $(this).removeAttr('id');
            music.pause();
        }
    });
});