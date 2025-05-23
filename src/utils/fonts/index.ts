import localFont from 'next/font/local';

export const Inter = localFont({
  src: [
    {
      path: './inter/Inter18pt-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: './inter/Inter18pt-ThinItalic.woff2',
      weight: '100',
      style: 'italic',
    },
    {
      path: './inter/Inter18pt-ExtraLight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: './inter/Inter18pt-ExtraLightItalic.woff2',
      weight: '200',
      style: 'italic',
    },
    {
      path: './inter/Inter18pt-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './inter/Inter18pt-LightItalic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: './inter/Inter18pt-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './inter/Inter18pt-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './inter/Inter18pt-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './inter/Inter18pt-MediumItalic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: './inter/Inter18pt-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './inter/Inter18pt-SemiBoldItalic.woff2',
      weight: '600',
      style: 'italic',
    },
    {
      path: './inter/Inter18pt-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './inter/Inter18pt-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: './inter/Inter18pt-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: './inter/Inter18pt-ExtraBoldItalic.woff2',
      weight: '800',
      style: 'italic',
    },
    {
      path: './inter/Inter18pt-Black.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: './inter/Inter18pt-BlackItalic.woff2',
      weight: '900',
      style: 'italic',
    },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-family-inter',
});
