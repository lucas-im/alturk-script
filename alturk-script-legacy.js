// ==UserScript==
// @name         alturk-script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://alturk.alcherainc.com/workspace/*
// @icon         https://www.google.com/s2/favicons?domain=alcherainc.com
// @grant        none
// @run-at       document-end
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

let currentFileName = ''
let currentWorkSpace = ''
let radioData = []
let fieldsets = {}


//there are 3 mods: work-norm, work-fold, audit,?
//in work-norm mode: compare file number. if not +15 of prev, pause autopaste for current file

const renderButtonComps = () => {
//render colorful buttons based on sets of pictures
    const btnGroup = document.querySelector('.list-group.list-group-flush').children
    if (btnGroup.length > 0) {
        let lastDigit = ''
        for (let i = 0; i < btnGroup.length; i++) {
            const fileName = btnGroup[i].innerText.split('.png')[0]
            if (btnGroup[i].classList.contains('active')) {
                currentFileName = fileName
            }

            const btn = document.createElement('button')
            btn.style.position = 'absolute'
            btn.style.right = '5px'
            btn.style.bottom = '1px'
            btn.innerText = fileName.substr(fileName.length - 3, 3)
            btnGroup[i].appendChild(btn)
        }
    }
}

//can check parameter simmertic by checking input's names

//Array.shift() => removes the first elem.

// const tempElem = document.createElement('textarea')
// tempElem.value = btnGroup.children[0].innerText
// document.body.appendChild(tempElem);
// tempElem.select();
// document.execCommand("copy");
// document.body.removeChild(tempElem);

// btnGroup.children[0].innerText
// btnGroup.children[0].classList.contains('active')
// btnGroup.children[0].innerText.split('.png')[0]

const renderBoards = () => {
    const placeHolder = document.querySelector('.row.mt-5')
    const textBtnGroup = document.querySelector('.text-center.btn-group')
    placeHolder.className = 'col mt-5'
    let boardWrapper = document.createElement('div').className = 'd'
placeHolder.append(boardWrapper)
    console.log(boardWrapper)

    for (let i = 0; i < 8; i++) {
        let boardElem = document.createElement('div')
        boardWrapper.appendChild(boardElem)
    }
}
const renderCopyButtons = () => {
    const placeHolder = document.querySelector('.attr-title')
    if(placeHolder === undefined) {
        console.warn('app not finished loading')
        return
    }
    placeHolder.children[0].remove()
    const copyBtn = document.createElement('button')
    const pasteBtn = document.createElement('button')
}

//convert to parseRadio, parse and sav globvar fieldsets, radiodata, and paint normal radios. add clickListeners
const copyRadio = () => {
    let tempRadioData = []
    const fieldsets = document.querySelectorAll("fieldset")
    if (fieldsets !== undefined) {
        if (fieldsets.length < 3) { console.warn('missing checks!'); return }
        if (radioData !== []) radioData = []
        fieldsets.forEach((fieldset, i) => {
            const blocks = fieldset.children[0].children[0].children
            for (let j = 0; j < blocks.length; j++) {
                const input = blocks[j].children[0].children[0]
                //can find params nname by checking children[2]'s innerhtml
                if (input.checked) tempRadioData.push(j)
            }
        })
    }
    if (tempRadioData.length !== fieldsets.length) {
        console.warn('invalid check data, reverting to previous copy')
        return;
    }
    radioData = tempRadioData
    console.log(`copied:${radioData}`)
}

const pasteRadio = () => {
    const fieldsets = document.querySelectorAll("fieldset")
    if (fieldsets.length !== radioData.length) console.warn('copied data corrupt. please copy again.')
    if (fieldsets !== undefined) {
        fieldsets.forEach((fieldset, i) => {
            fieldset.children[0].children[0].children[radioData[i]].children[0].children[0].click()
        })
    }
    console.log('pasted successfully')
}

const copyFileName = () => {
    const tempElem = document.createElement('textarea')
    tempElem.value = currentFileName + '.png'
    document.body.appendChild(tempElem);
    tempElem.select();
    document.execCommand("copy");
    document.body.removeChild(tempElem);
}

const updateParams = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', {
        'keyCode': '32'
      }))
}

const saveAndNextFile = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', {
        'keyCode': '32'
    }))
}

const customizeLayouts = () => {
    $('.mb-2.px-0.ocr.col-md-7.col-xl-7.col-6')[0].style.maxWidth = '50%'
    const paramBar = $('.mb-2.py-2.ocr-text.col-md-3.col-xl-3.col-4')[0]
    paramBar.style.maxWidth = '36%'
    paramBar.style.flex = '36%'
    paramBar.style.height = '854px'
    const workListWrapper = $('.work-list-wrapper')[0]
    workListWrapper.style.top = '30px'
    workListWrapper.style.flex = '13%'
    workListWrapper.style.maxWidth = '13%'
    const nextButton = document.createElement('button')
    nextButton.innerHTML = '     >>>     '
    nextButton.style.height = '2.5rem'
    nextButton.style.width = '200px'
    nextButton.onclick = saveAndNextFile
    workListWrapper.appendChild(nextButton)
    $('.attr-title')[0].remove()
    $('.button-row')[0].style.height = '38px'
    $('.row.mt-5')[0].style.setProperty('margin-top', '1rem', 'important')
    $('hr').each((i, e) => {
        e.remove()
    })
}

const valGreenStr = (str) => {
    str = str.slice(1)
    //if(workspaceMode === workspaceModes.INSP)
    switch (str) {
        case '보통':
        case '그림자_없음':
        case '해당없음':
        case '원활':
        case '평지':
        case '일반':
            return true
        default:
            return false
    }
}

const colors = {
    'RED': '#ffc9c9',
    'GREEN': '#bdffd3'
}

//for legacy only
const paintFieldsets = () => {
    const tempFieldsets = $('.form-group')
    tempFieldsets.each((i, e) => {
        e.style.marginBottom = '0rem'
        const blocks = e.children[0].children[0].children
        for (let j = 0; j < blocks.length; j++) {
            const radio = blocks[j].children[0].children[0]
            const field = blocks[j].children[0].children[2]
            if(radio.checked) {
                const result = valGreenStr(field.innerHTML)
                //blocks[j].style.backgroundColor = result ? colors.GREEN : colors.RED
            }
        }
    })
}



if (window.sessionStorage !== "undefined") {
    console.log("script started:'altera-script'")

    document.addEventListener("keydown", (e) => {
        if (e.key === 'd' || e.key === '[') copyRadio()
        else if (e.key === 'f' || e.key === ']') pasteRadio()
        else if (e.key === 's') copyFileName()
    })
    const target = document.documentElement || document.body;
    const observer = new MutationObserver((mutation) => {
        if (mutation.length === 1) return
//console.log(mutation)
        //validating app finished loading
        if (mutation[0].target.className === 'attr-wrapper mt-3' && mutation[0].addedNodes.length > 0) {
            //clearing file history when opening new workspace
            if(currentWorkSpace === '' || currentWorkSpace !== document.URL.split('/')[4]) {
                console.log('detected new workspace..')
                currentFileName = ''
                currentWorkSpace = document.URL.split('/')[4]
            }
            renderButtonComps()
            customizeLayouts()
            //renderBoards()
            paintFieldsets()
        }

        //to prevent too much invoke.
        // observer.disconnect();
    })
    const config = {
        childList: true,
        subtree: true
    }
    observer.observe(target, config);
}

//https://alturk.alcherainc.com/workspace/47419/work/33168139
//reset by def workspace, check if it's auditing unfinished work(whitemode)
//move checkedfiles and prefs to sessionstorage or localstorage

//append buttons on next to board, not param box
//append buttonComps when buttons finished loading

//autofill-mode

//attr-wrapper mt-3 class ->
//document.querySelector('input[name="radioName"]:checked').value;

/* TODO:

rq header=> vuex={"user":{"loginToken":"945d14cb167a4236c5765913c330aa92f11cabe0","isAuthenticated":true,"id":922,"email":"meta03@acr.com","username":"메타03","is_staff":false}}
authorization: Token 945d14cb167a4236c5765913c330aa92f11cabe0

{
    "id": 0,
    "task_id": 403,
    "type": "binary",
    "category": "카메라_조건",
    "options": [
        "보통",
        "얼룩",
        "물_맺힘",
        "부분가림",
        "전체가림",
        "대시보드_물체_반사"
    ],
    "selected": 0
}
https://alturk.alcherainc.com/api/project/workspace/46978/work/33009724/


const btnGroup = document.querySelector('.list-group.list-group-flush')
btnGroup.children[0].innerText
btnGroup.children[0].classList.contains('active')
btnGroup.children[0].innerText.split('.png')[0]
✅❗❗
- replace copy and paste function to automatic copy, paste manually.
- check finished loading screen first
- every elem we use is refreshed every time file changes..
- Lgt green on vied files
- grn on norm stat on edit mode.
- check on greens func.
- gbl var of curr files last digits of file num.
- on top: index stats., last digits, weeks, green on norm, org on abnorm.
  - only visible on insp. mode => checkc green on curr file.
  - must be destroyed after selecting completed file.
- check on curr file name to find refresh stat

*/