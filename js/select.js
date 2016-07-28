// Get all the "select" menus on the form:
    // Replace the "select" tag with "a"
    // Replace all the options of the "select" tag with unordered list (ul).
function selectToUl() {
    var select = document.getElementsByTagName('select');
    for (var i = 0; i < select.length; i++) {
        
        var parent = select[i].parentNode;
        var selId = select[i].id;
        var options = select[i].children;
        var div = document.createElement('div');
        var ul = document.createElement('ul');
        var trigger = document.createElement('a');
        div.className = 'dropdown-container';
        ul.className = 'dropdown';
        trigger.id = selId;
        trigger.className = 'trigger';
        trigger.href = '#';
        trigger.innerText = options[0].text;
        trigger.setAttribute('value', options[0].value);
        trigger.addEventListener('click', triggerClickEvent);

        div.appendChild(ul);

        for (var o = 0; o < options.length; o++) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.setAttribute('value', options[o].value);
            a.innerText = options[o].text;
            a.href = '#';
            a.addEventListener('click', optionClickEvent);
            li.appendChild(a);
            ul.appendChild(li);
        }
        parent.insertBefore(trigger,select[i]);
        parent.insertBefore(div,select[i]);
    }

    // Remove selects from the DOM
    while (select.length > 0) {
        select[0].parentNode.removeChild(select[0]);
    }

    function triggerClickEvent(evt) {
        evt.preventDefault();
        var activeTriggers = document.getElementsByClassName('on');
        for (var i = 0; i < activeTriggers.length; i++) {
            if (activeTriggers[i].getAttribute('value') !== this.getAttribute('value')) {
                activeTriggers[i].nextSibling.classList.remove('visible');
                activeTriggers[i].classList.remove('on');
            }
        }
        this.classList.toggle('on');
        this.nextSibling.classList.toggle('visible');
    }
}

function optionClickEvent(evt) {
    evt.preventDefault();
    var trigger = this.parentNode.parentNode.parentNode.previousSibling;
    trigger.innerText = this.innerText;
    trigger.setAttribute('value', this.getAttribute('value'));
    trigger.classList.toggle('on');
    trigger.nextSibling.classList.toggle('visible');
}

selectToUl();