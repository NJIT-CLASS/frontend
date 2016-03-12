document.onload = function() {
    js = {};

    js.toggle = {
        switch: function() {
            if (this.classList.contains('true')) {
                this.dataset.value = 'false';
                this.classList.remove('true');
                this.classList.add('false');
            }
            else {
                this.dataset.value = 'true';
                this.classList.remove('false');
                this.classList.add('true');
            }
        }
    }

    var toggleEls = document.getElementsByClassName('toggle-switch');

    [].forEach.call(toggleEls, function (el) {
        el.addEventListener('click', js.toggle.switch.bind(el))
        el.dataset.value = el.classList.contains('true') ? true : false;
    });
}();