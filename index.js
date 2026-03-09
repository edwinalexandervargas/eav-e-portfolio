// template_7lhjvjq
// service_yep9wjg
// dbLyKxuFSb-dZwgDR

function contact(event) {
    event.preventDefault();
    const loading = document.querySelector('.modal__overlay--loading')
    const success = document.querySelector('.modal__overlay--success')
    loading.classlist += " modal__overlay--visible"
    emailjs
        .sendForm(
            'service_yep9wjg',
            'template_7lhjvjq',
            event.target,
            'dbLyKxuFSb-dZwgDR'
        ).then(() => {
            loadingoading.classList.remove("modal__overlay--visible");
            success.classList += " modal__overlay--visible";
        }).catch(() => {
            loading.classList.remove("modal__overlay--visible")
            alert(
                "The email service is temporarily unavailable. Please contact me directly on edwinalexandervargas07@gmail.com"
            );
        })
}