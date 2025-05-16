
type Props = {
  children?: React.ReactNode
};

export const SectionMenu = ({ children }: Props) => {
  return (
    <div className='section-menu'>
      {children}
    </div>
  )
}