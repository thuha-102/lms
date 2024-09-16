import Image from 'next/image'


export const Logo = () => {
  return (
    <Image
      src="/apple-touch-icon.png"
      width={32}
      height={32}
      alt="Picture of the author"
    />
  );
};
