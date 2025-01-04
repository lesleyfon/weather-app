interface DashboardHeaderProps {
  heading: string | React.ReactNode;
  text?: string;
  children?: React.ReactNode;
  summarySlot?: React.ReactNode;
}

export function Header({
  heading,
  text,
  children,
  summarySlot,
}: DashboardHeaderProps) {
  return (
    <header className="tw-flex tw-items-center tw-justify-between tw-px-2 tw-fixed tw-top-0 tw-left-0 tw-right-0 tw-z-10 tw-bg-white tw-shadow-md tw-py-2 tw-mb-4">
      <div className="tw-grid tw-gap-1">
        <h1 className="tw-font-heading tw-text-3xl tw-md:tw-text-4xl">
          {heading}
        </h1>
        {text ? (
          <p className="tw-text-lg tw-text-muted-foreground">{text}</p>
        ) : null}
      </div>
      {children}
      {summarySlot ? summarySlot : null}
    </header>
  );
}
