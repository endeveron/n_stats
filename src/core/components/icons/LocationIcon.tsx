// https://www.svgrepo.com/svg/532540/location-pin-alt-1

export function LocationIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
      {...props}
    >
      <path d="M8 14C10.3333 11.6 12.6667 9.45093 12.6667 6.8C12.6667 4.14903 10.5773 2 8 2C5.42267 2 3.33333 4.14903 3.33333 6.8C3.33333 9.45093 5.66667 11.6 8 14Z" />
      <path d="M8 8C8.7364 8 9.33333 7.40307 9.33333 6.66667C9.33333 5.93029 8.7364 5.33333 8 5.33333C7.2636 5.33333 6.66667 5.93029 6.66667 6.66667C6.66667 7.40307 7.2636 8 8 8Z" />
    </svg>
  );
}
