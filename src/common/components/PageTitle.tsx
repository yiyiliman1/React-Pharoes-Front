import { SectionMenu } from './SectionMenu/SectionMenu';

type PageTitleProps = {
  title: string
  buttonsSection?: React.ReactNode
  children?: React.ReactNode
};

export default function PageTitle({ title, children, buttonsSection }: PageTitleProps) {
  return (
    <div className='section-header'>
      <div className='section-header__title'>
        <h1>{title}</h1>
        <SectionMenu>{buttonsSection}</SectionMenu>
      </div>
      <div className='section-header__content'>
        {children}
      </div>
    </div>
  );
}