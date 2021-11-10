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
    INSP: 'Inspection',
    UNKN: 'Unknown'
}
let workSpaceMode = undefined
//pastel colors
const colors = {
    'RED': '#FF8989',
    'GREEN': '#7ABD91'
}
let isNewSet = false

/*
    TO-DOs:
    - classerize board
      - properties: position(nofn)in the current picrutesets, workmods, normalindexes, filenum(3digs)
    - move topbutton comps
    - cover moving to another page
    - catch exception to init checkongreen while painting params
    - memo func by pressing btns
    - append btns next to filebutttons not as childs
    finish-btn
*/

const renderFileListComps = (isUpdating) => {
    //render colorful buttons based on sets of pictures
    //copy currfilename
    const btnGroup = document.querySelector('.list-group.list-group-flush').children
    if (btnGroup.length > 0) {
        for (let i = 0; i < btnGroup.length; i++) {
            const fileName = btnGroup[i].innerText.split('.png')[0]
            if (btnGroup[i].classList.contains('active') && !isUpdating) currFileName = fileName
            const btn = document.createElement('button') = {
                'className': 'btn-file-num',
                'style': {
                    'position': 'absolute',
                    'right': '4px',
                    'bottom': '1px'
                },
                'innerHTML': fileName.substr(fileName.length - 3, 3)
            }
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
    boardWrapper.style.position = 'absolute'
    boardWrapper.style.display = 'grid'
    boardWrapper.style.gridTemplateColumns = '300px 300px 300px 300px'

    //todo repplace placeholder
    placeHolder.append(boardWrapper)
    for (let i = 0; i < 8; i++) {
        const boardElem = document.createElement('div')
        boardElem.className = 'board'
        boardElem.style.backgroundColor = ''
        boardElem.style.padding = '1rem'
        boardElem.style.fontSize = '24px'
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
//convert to parseRadio, parse and sav globvar fieldsets, radiodata, and paint normal radios. add clickListeners
const parseParams = () => {
    let tempParams = []
    let tempParamsStr = []
    if (fieldsets === undefined) fieldsets = document.querySelectorAll("fieldset")
    if (params !== []) params = []
    fieldsets.forEach((fieldset) => {
        //todo:val
        if (firstRun) boardsTitle.push(fieldset.children[0].name)
        const blocks = fieldset.children[0].children[0].children
        for (let j = 0; j < blocks.length; j++) {
            const input = blocks[j].children[0].children[0]
            if (input.checked) {
                tempParams.push(j)
                tempParamsStr.push(input.children[2].innerText)
            }
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
    const fieldsets = document.querySelectorAll("fieldset")
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
    tempElem.value = btnGroup.children[0].innerText
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

//script entry
if (window.sessionStorage !== "undefined") {
    console.log("script started:'altera-script'")
    document.addEventListener("keydown", (e) => {
        // if (e.key === 'c') 
        if (e.key === 'v') pasteParams()
        else if (e.key === 'e') copyFileName()
    })
    const target = document.documentElement || document.body;
    const observer = new MutationObserver((mutation) => {
        //changing page index from file list detected
        if (mutation[0].target.className === 'attr-wrapper mt-3' && mutation[0].addedNodes.length > 0) renderFileListComps(true)
        //file list finished loading
        else if (mutation[0].target.className === 'list-group.list-group-flush' && mutation[0].addedNodes.length > 0) renderFileListComps(false)
        //validation for app finished loading
        else if (mutation[0].target.className === 'attr-wrapper mt-3' && mutation[0].addedNodes.length > 0) {
            if (currWorkSpaceNum === '' || currWorkSpaceNum !== document.URL.split('/')[4]) {
                console.log('detected new workspace')
                currWorkSpaceNum = document.URL.split('/')[4]
                workSpaceMode = undefined
                checkWorkMode()
            }
            if (workSpaceMode === undefined) {
                console.error('workSpaceMode is null')
                return
            }
            
            renderBoards()
        }
    })
    const config = {
        childList: true,
        subtree: true
    }
    observer.observe(target, config);
}