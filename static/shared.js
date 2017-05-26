/*if ('serviceWorker' in navigator) {

  // register service worker
    navigator.serviceWorker.register('/service-worker.js').then(reg => {
        console.log('Scope', reg.scope);
    });
}
*/


function addLanguageQuery(str) {
    if(window.location.search.includes('&lang')){
        window.location.search = window.location.search.replace(/lang=../, str);
    }else{
        window.location.search += '&' + str;
    }
}

function uploadFiles(e, url, vars){
    e.preventDefault();

    if(!document.getElementById('upload-input')){
        return;
    }

    let formData = new FormData();
    formData.append('uploadTarget', e.target.name);
    [].forEach.call(document.getElementById('upload-input').files, function (file) {
        formData.append('files', file);
    });

    if(vars !== undefined){
        Object.keys(vars).forEach(function(key){
            formData.append(`${key}`, vars[key]);
        });
    }
    let inputParent = document.getElementById('upload-input').parentNode;

    var xhr = new XMLHttpRequest();
    xhr.open( 'POST', `${url}/api/upload/profile-picture`, true);
    xhr.onreadystatechange = function(){
        if(this.readyState == 4) {
            if(this.status == 200){
                console.log('Uploads successful', this.responseText);
                inputParent = document.getElementById('upload-started').parentNode;
                inputParent.removeChild(document.getElementById('upload-started'));
                inputParent.insertAdjacentHTML('beforeend','<div id="upload-finished">Upload Complete</div>');
            }
            else{
                console.log('Sorry, there was an error', this.responseText);
            }
        }
        else{
            console.log('Uploading...');
        }

    };
    xhr.send(formData);
    inputParent.removeChild(document.getElementById('upload-input'));
    inputParent.insertAdjacentHTML('beforeend','<div id="upload-started"><i class="fa fa-spinner" aria-hidden="true"></i></div>');

    //e.submit();

}

function showMessage(message){
    document.getElementById('message-view').innerText = message;
    document.getElementById('message-view').classList.remove('closed');
}

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
                            'Content-type': 'application/json'
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

    js.message = {
        close: function(){
            this.classList.add('closed');
        }
    };

    var messageViewEl = document.getElementById('message-view');
    messageViewEl.addEventListener('click', js.message.close.bind(messageViewEl));

}();
