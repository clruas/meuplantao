import { cn } from "../utils/cn"

function Page({ children }){
    return <>{ children }</>
}

function Header({ children, className = '' }){
  return <div className={cn("flex justify-between bg-neutral-100", className)}>{children}</div>
}

function Body({ children, className = '' }){
    return <div className={cn("flex-1 flex", className)}>{ children }</div>
}

function Footer({ children, className = '' }){
    return <div className={cn("bg-neutral-50", className)}>{ children }</div>
}

Page.Header = Header
Page.Body = Body
Page.Footer = Footer

export default Page