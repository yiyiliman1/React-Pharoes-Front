
type Props = {
  children?: React.ReactChild | React.ReactChild[]
}

export const ModalLayout = ({ children }: Props) => {
  return (
    <div className="modal-layout">
      <div className="modal-layout__content">
        {children}
      </div>
    </div>
  )
}