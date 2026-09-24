import clsx from "clsx";

export function PageHeader({ className, children }){
  return <div className={clsx("flex justify-between bg-neutral-100", className)}>
    {children}
  </div>
}