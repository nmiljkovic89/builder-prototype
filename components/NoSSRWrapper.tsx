import dynamic from "next/dynamic";

const NonSSRWrapper = dynamic(
  () => Promise.resolve((props: any) => <>{props.children}</>),
  {
    ssr: false,
  }
);

export default NonSSRWrapper;
