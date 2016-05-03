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

            if (this.dataset.onclick) {
                function toggleClick(value, userId) {
                    fetch('http://localhost:4000/api/change-admin-status', {  
                        method: 'post',  
                        headers: {  
                          "Content-type": "application/json"  
                        },  
                        body: JSON.stringify({
                            'userId': userId,
                            'makeAdmin': true
                        })
                    }).then(function (response) {
                        console.log(response);
                    });
                }

                toggleClick(this.dataset.value, this.dataset.userid);
            }
        }
    };

    var toggleEls = document.getElementsByClassName('toggle-switch');

    [].forEach.call(toggleEls, function (el) {
        el.addEventListener('click', js.toggle.switch.bind(el));
        el.dataset.value = el.classList.contains('true') ? true : false;
    });

    js.checkbox = {
        switch: function() {
            this.classList.toggle('checked');
            this.dataset.checked = this.dataset.checked === 'true' ? false : true;

            if (this.dataset.onClick) {
                this.dataset.onClick(this.dataset.checked);
            }
        }
    };

    var checkboxEls = document.getElementsByClassName('checkbox');

    [].forEach.call(checkboxEls, function (el) {
        el.addEventListener('click', js.checkbox.switch.bind(el));
        el.dataset.checked = el.classList.contains('checked') ? true : false;
    });
}();