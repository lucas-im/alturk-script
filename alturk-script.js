// ==UserScript==
// @name         alturk-script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  alturk helper
// @author       You
// @match        https://alturk.alcherainc.com/workspace/*
// @icon         https://www.google.com/s2/favicons?domain=alcherainc.com
// @grant        none
// @run-at       document-end
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

//global vars
let currFileName = ''
let currWorkSpaceNum = ''
//array of parameter indexes
let params = []
//array of normal parameter indexes
let greenParams = []
let paramsStr = ['']
//parameter blocks
let fieldsets = []
//overview boards
let boards = []
let boardsTitle = []
//workspace modes: WORK(Work-Normal), FOLDER(Work-Folder), INSP(Inspection), UNKN(Unknown: Not yet supported)
const workSpaceModes = {
    WORK: 'Work-Normal',
    FOLDER: 'Work-Folder',
    INSP: 'Work-Inspection',
    FOLINS: 'Folder-Inspection',
    UNKN: 'Unknown'
}
let workSpaceMode = undefined
//pastel colors
const colors = {
    'RED': '#ffc9c9',
    'GREEN': '#bdffd3'
}
let isNewSet = false

/*
    TO-DOs:
    - 맑음 평지 아스팔트 일반 일반도로 왕복_6차선_도로
    - input.type ? check
    - 해당없음, 흰_차선
*/

const renderFileListComps = (isUpdating) => {
    //render colorful buttons based on sets of pictures
    const btnGroup = document.querySelector('.list-group.list-group-flush').children
    if (btnGroup.length > 0) {
        let prevFileNum = 0
        for (let i = 0; i < btnGroup.length; i++) {
            const fileName = btnGroup[i].innerText.split('.png')[0]
            if (btnGroup[i].classList.contains('active') && !isUpdating) currFileName = fileName
            const btn = document.createElement('button')
            const fileNum = fileName.substr(fileName.length - 3, 3)
            btn.className = 'btn-file-num'
            btn.innerHTML = fileNum
            btn.style = {
                'position': 'absolute',
                'right': '4px',
                'bottom': '1px'
            }
            if ((workSpaceMode === workSpaceModes.WORK || workSpaceMode === workSpaceModes.INSP) && parseInt(prevFileNum) + 15 === parseInt(fileNum)) {
                btn.style.backgroundColor = colors.RED
                greenParams[i] = j
            }
            prevFileNum = fileNum
            btnGroup[i].append(btn)
        }
    }
}

const renderBoards = () => {
    const placeHolder = document.querySelector('.row.mt-5')
    const textBtnGroup = document.querySelector('.text-center.btn-group')
    placeHolder.className = 'col mt-5'
    textBtnGroup.append(placeHolder)
    placeHolder.style.position = 'absolute'
    placeHolder.style.top = '0px'
    const boardWrapper = document.createElement('div')
    boardWrapper.className = 'board-wrapper'
    boardWrapper.style = {
        'position': 'absolute',
        'display': 'grid',
        'grid-template-columns': '300px 300px 300px 300px'
    }

    //todo repplace placeholder
    placeHolder.append(boardWrapper)
    for (let i = 0; i < 8; i++) {
        const boardElem = document.createElement('div')
        boardElem.className = 'board'
        boardElem.style = {
            'background-color': '',
            'padding': '1rem',
            'font-size': '24px'
        }
        boardElem.innerHTML = ''
        boardWrapper.append(boardElem)
    }
}
const renderBtns = () => {
    const placeHolder = document.querySelector('.attr-title')
    placeHolder.children[0].remove()
    const copyBtn = document.createElement('button')
    const pasteBtn = document.createElement('button')
}

const checkWorkMode = () => {
    fieldsets = document.querySelectorAll("fieldset")
    let isWork = false
    let checkCnt = 0
    fieldsets.forEach((fieldset) => {
        const blocks = fieldset.children[0].children[0].children
        for (let j = 0; j < blocks.length; j++) {
            const input = blocks[j].children[0].children[0]
            if (input.checked) checkCnt++
        }
        if (fieldset.children[0].name === '교통상황') isWork = true
    })
    if (fieldsets.length !== checkCnt - 1) {
        workSpaceMode = workSpaceModes.INSP
    }
    else workSpaceMode = isWork ? workSpaceModes.WORK : workSpaceModes.FOLDER
}

const checkToGreens = () => {

}

const updateBoard = (column, row, str) => {

}

const radioClicked = (column, row, str) => {
    params[column] = row
    paramsStr[column] = str


}

const parseParams = () => {
    let tempParams = []
    let tempParamsStr = []
    if (fieldsets === undefined) fieldsets = document.querySelectorAll("fieldset")
    if (params !== []) params = []
    fieldsets.forEach((fieldset, i) => {
        //todo:val
        if (firstRun) boardsTitle.push(fieldset.children[0].name)
        const blocks = fieldset.children[0].children[0].children
        for (let j = 0; j < blocks.length; j++) {
            const input = blocks[j].children[0].children[0]
            if (input.checked) {
                tempParams.push(j)
                tempParamsStr.push(input.children[2].innerText)
            }
            input.addEventListener('click', radioClicked(i, j, input.children[2].innerText))
            console.log(`radio checks on row${i} column${j}`)
        }
    })
    if (tempParams.length !== fieldsets.length) {
        console.error('failed to parse params')
        return
    }
    params = tempParams
    paramsStr = tempParamsStr
    console.log(`copied:${params}`)
}

const pasteParams = () => {
    if (fieldsets === undefined) fieldsets = document.querySelectorAll("fieldset")
    if (fieldsets.length !== params.length) console.error('copied data corrupt. please copy again.')
    if (fieldsets !== undefined) {
        fieldsets.forEach((fieldset, i) => {
            fieldset.children[0].children[0].children[params[i]].children[0].children[0].click()
        })
    }
    console.log('pasted successfully')
}

//copies name of the current file for python script
const copyFileName = () => {
    const tempElem = document.createElement('textarea')
    tempElem.value = currFileName + '.png'
    document.body.appendChild(tempElem);
    tempElem.select();
    document.execCommand("copy");
    document.body.removeChild(tempElem);
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
    nextButton.style.height = '2,5rem'
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

//ZONE START: LEAGCY ONLY

const paintFieldsets = () => {
    const tempFieldsets = $('.form-group')
    tempFieldsets.each((i, e) => {
        e.style.marginBottom = '0rem'
        const blocks = e.children[0].children[0].children
        for (let j = 0; j < blocks.length; j++) {
            console.log(blocks[j])
            const radioWrapper = blocks[j].children[0]
            const radio = radioWrapper.children[0]
            const field = radioWrapper.children[2]
            if (radio.checked && valGreenStr(field).innerHTML) radioWrapper.style.backgroundColor = colors.GREEN
            else radioWrapper.style.backgroundColor = colors.RED
        }
    })
}

const radioClicked = (radio) => {

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

//ZONE END

//const stylizeFieldsets => margin bottom to 0rem;

//script entry
if (window.sessionStorage !== "undefined") {
    console.log("script started:'altera-script'")
    document.addEventListener("keydown", (e) => {
        if (e.key === 'v') pasteParams()
        else if (e.key === 'e') copyFileName()
    })
    const target = document.documentElement || document.body;
    const observer = new MutationObserver((mutation) => {
        //changing page index from file list detected
        if (mutation[0].addedNodes.length < 0) return
        switch (mutation[0].target.clasName) {
            //changing page index from file list detected
            case ('attr-wrapper mt-3'):
                renderFileListComps(true)
                break
            //file list finished loading
            case ('list-group.list-group-flush'):
                renderFileListComps(false)
                break
            //validation for app finished loading
            case ('attr-wrapper mt-3'):
                if (currWorkSpaceNum === '' || currWorkSpaceNum !== document.URL.split('/')[4]) {
                    console.log('detected new workspace')
                    currWorkSpaceNum = document.URL.split('/')[4]
                    workSpaceMode = undefined
                    checkWorkMode()
                }
                switch(workSpaceMode) {
                    case undefined || workSpaceModes.UNKN:
                        console.error('workSpaceMode is null or unknown')
                        return
                    case workSpaceModes.FOLDER || workSpaceModes.FOLINS:
                        try { 
                        parseParams()
                        }
                        catch (e) {
                            checkToGreens()
                        }
                        break
                    case workSpaceModes.WORK || workSpaceModes.INSP:
                        parseParams()
                        break
                }
                //not completed
                //renderBoards()
                break


        }
    })
    const config = {
        childList: true,
        subtree: true
    }
    observer.observe(target, config);
}