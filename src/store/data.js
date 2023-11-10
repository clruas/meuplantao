import { atom } from "recoil";

const initDate = localStorage.getItem('initDate')
const view = localStorage.getItem('view')

export const InitDateState = atom({
    key: "InitDateState",
    default: initDate
})

export const ViewState = atom({
    key: "ViewState",
    default: view
})