import React from 'react';

export type IconName =
  | 'local_fire_department'
  | 'fire'
  | 'person'
  | 'school'
  | 'check'
  | 'check_circle'
  | 'task_alt'
  | 'play_arrow'
  | 'play'
  | 'play_circle'
  | 'pause'
  | 'videocam'
  | 'videocam_off'
  | 'slow_motion_video'
  | 'smart_display'
  | 'visibility'
  | 'eye'
  | 'front_hand'
  | 'pan_tool'
  | 'sign_language'
  | 'waving_hand'
  | 'lock'
  | 'flag'
  | 'play_lesson'
  | 'verified'
  | 'verified_user'
  | 'shield'
  | 'lightbulb'
  | 'radio_button_checked'
  | 'radio_button_unchecked'
  | 'arrow_back'
  | 'arrow_forward'
  | 'close'
  | 'schedule'
  | 'closed_caption'
  | 'near_me'
  | 'sentiment_satisfied'
  | '360'
  | 'flip'
  | 'mirror'
  | 'sync'
  | 'replay'
  | 'bolt'
  | 'grid_view'
  | 'grid'
  | 'accessibility_new'
  | 'spellcheck'
  | 'ads_click'
  | 'star'
  | 'psychology'
  | 'workspace_premium'
  | 'my_location'
  | 'waves'
  | 'touch_app'
  | 'roofing'
  | 'warning';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName | string;
  size?: number | string;
  className?: string;
}

function renderIcon(name: string, baseClass: string, sizeStyle: any, props: any) {
  switch (name) {
    case 'local_fire_department':
    case 'fire':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M12 23c-4.97 0-9-4.03-9-9 0-3.93 2.53-7.27 6.13-8.47.45-.15.93.12 1.05.58.07.28-.01.58-.21.78-.96.96-1.54 2.22-1.63 3.56 1.4-.73 2.97-1.12 4.66-1.12 1.25 0 2.44.22 3.53.64.44.17.65.68.47 1.11-.12.28-.38.48-.69.52-1.37.18-2.61.83-3.53 1.8-1.07 1.13-1.66 2.62-1.66 4.17 0 .54.07 1.06.2 1.56 1.15-.9 2.56-1.43 4.1-1.43 3.59 0 6.5 2.91 6.5 6.5 0 4.97-4.03 9-9 9z" />
        </svg>
      );

    case 'person':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
        </svg>
      );

    case 'school':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
        </svg>
      );

    case 'check':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );

    case 'check_circle':
    case 'task_alt':
    case 'verified':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      );

    case 'play_arrow':
    case 'play':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      );

    case 'play_circle':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
        </svg>
      );

    case 'pause':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
      );

    case 'videocam':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
        </svg>
      );

    case 'videocam_off':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.55-.18L19.73 21 21 19.73 3.27 2z" />
        </svg>
      );

    case 'slow_motion_video':
    case 'smart_display':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-10 12.5v-9l6 4.5-6 4.5z" />
        </svg>
      );

    case 'visibility':
    case 'eye':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
        </svg>
      );

    case 'front_hand':
    case 'pan_tool':
    case 'hand':
    case 'sign_language':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M18 11V6c0-1.66-1.34-3-3-3s-3 1.34-3 3v5h-1V3.5C11 2.12 9.88 1 8.5 1S6 2.12 6 3.5V11H5c-1.66 0-3 1.34-3 3 0 4.97 4.03 9 9 9h3c4.97 0 9-4.03 9-9v-4c0-1.66-1.34-3-3-3h-2zm-1 3v2c0 3.86-3.14 7-7 7-3.86 0-7-3.14-7-7 0-.55.45-1 1-1h3v-8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V13h2V6c0-.83.67-1.5 1.5-1.5S15 5.17 15 6v7h2v-2c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V14z" />
        </svg>
      );

    case 'waving_hand':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M23 5.5V20c0 2.2-1.8 4-4 4h-7.3c-1.6 0-3.1-.7-4.2-1.8L2 16.7l1.4-1.4c.4-.4.9-.6 1.4-.6h.5L9 17V5.5C9 4.7 9.7 4 10.5 4S12 4.7 12 5.5V12h1V3.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5V12h1V4.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5V12h1V5.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5z" />
        </svg>
      );

    case 'lock':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
        </svg>
      );

    case 'flag':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
        </svg>
      );

    case 'play_lesson':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 16.5v-9l6 4.5-6 4.5z" />
        </svg>
      );

    case 'verified_user':
    case 'shield':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
        </svg>
      );

    case 'lightbulb':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 017 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" />
        </svg>
      );

    case 'radio_button_checked':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
        </svg>
      );

    case 'radio_button_unchecked':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <circle cx="12" cy="12" r="9" />
        </svg>
      );

    case 'arrow_back':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      );

    case 'arrow_forward':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      );

    case 'close':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      );

    case 'schedule':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
        </svg>
      );

    case 'closed_caption':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z" />
        </svg>
      );

    case 'near_me':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z" />
        </svg>
      );

    case 'sentiment_satisfied':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
        </svg>
      );

    case '360':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-4h2v4zm0-6h-2V8h2v2z" />
        </svg>
      );

    case 'flip':
    case 'mirror':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M15 21h2v-2h-2v2zm4-12h2V7h-2v2zM3 5v14c0 1.1.9 2 2 2h4v-2H5V5h4V3H5c-1.1 0-2 .9-2 2zm16-2v2h2c0-1.1-.9-2-2-2zm-8 20h2V1h-2v22zm8-6h2v-2h-2v2zM15 5h2V3h-2v2zm4 8h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2z" />
        </svg>
      );

    case 'sync':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
        </svg>
      );

    case 'replay':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
        </svg>
      );

    case 'bolt':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M11 21h-1l1-7H7.5c-.88 0-.33-.75-.31-.78C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.9 17.55 11 21 11 21z" />
        </svg>
      );

    case 'grid_view':
    case 'grid':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M3 3h8v8H3zm0 10h8v8H3zM13 3h8v8h-8zm0 10h8v8h-8z" />
        </svg>
      );

    case 'accessibility_new':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M20.5 6c-2.61.7-5.67 1-8.5 1s-5.89-.3-8.5-1L3 8c1.86.5 4 .83 6 1v13h2v-6h2v6h2V9c2-.17 4.14-.5 6-1l-.5-2zM12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
        </svg>
      );

    case 'spellcheck':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M12.45 16h2.09L9.43 3H7.57L2.46 16h2.09l1.12-3h5.66l1.12 3zM6.43 11.25L8.5 5.67l2.07 5.58H6.43zM21.59 11.59L13.5 19.68l-3.09-3.09L9 18l4.5 4.5 9.5-9.5-1.41-1.41z" />
        </svg>
      );

    case 'ads_click':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      );

    case 'star':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      );

    case 'psychology':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 6.23 11.08 6 12 6c3.04 0 5.6 2.11 6.22 5.01l.44 2.05 1.99.64c1.4.45 2.35 1.74 2.35 3.2 0 1.93-1.57 3.5-3.5 3.5h-1.5v2h1.5c3.03 0 5.5-2.47 5.5-5.5 0-2.36-1.53-4.46-3.65-5.18l-1.5-.68zM6.5 14H4.5c-.83 0-1.5-.67-1.5-1.5 0-.71.51-1.33 1.2-1.47l1.98-.39.46-1.95C7.26 6.13 9.42 4.4 12 4.07V2.05C8.36 2.4 5.38 4.89 4.47 8.44 3.01 8.84 2 10.15 2 11.66c0 1.93 1.57 3.5 3.5 3.5h1v-1.16zm5.5 4c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm0-4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
        </svg>
      );

    case 'workspace_premium':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm0 10c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm-4 7l2-1 2 1v3H8v-3zm8 0l-2-1-2 1v3h4v-3z" />
        </svg>
      );

    case 'my_location':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
        </svg>
      );

    case 'waves':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M2 10c2.5-3 5-3 7.5 0s5 3 7.5 0 5-3 7-0" />
          <path d="M2 14c2.5-3 5-3 7.5 0s5 3 7.5 0 5-3 7-0" />
        </svg>
      );

    case 'touch_app':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z" />
        </svg>
      );

    case 'roofing':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M13 18h-2v-2h2v2zm0-4h-2v-2h2v2zm6-4v10H5V10l7-5 7 5zm2.31-.78l-8.62-6.16a1.18 1.18 0 0 0-1.38 0L2.69 9.22A1 1 0 0 0 3.29 11h.71v9c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-9h.71c.8 0 1.25-.9 1.6-1.78z" />
        </svg>
      );

    case 'warning':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={baseClass}
          style={sizeStyle}
          aria-hidden="true"
          {...props}
        >
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
        </svg>
      );

    default:
      return (
        <span
          className={`inline-block text-current text-center font-bold ${baseClass}`}
          style={sizeStyle}
          aria-hidden="true"
        >
          ●
        </span>
      );
  }
}

export function Icon({ name, size = 20, className = '', ...props }: IconProps) {
  const defaultSize = size || 20;
  const sizeStyle = size ? { width: size, height: size } : undefined;
  const baseClass = className || 'w-5 h-5';
  const element = renderIcon(name, baseClass, sizeStyle, props);

  if (React.isValidElement(element)) {
    return React.cloneElement(element as React.ReactElement<any>, {
      width: (element.props as any).width || defaultSize,
      height: (element.props as any).height || defaultSize,
      className: (element.props as any).className || baseClass,
    });
  }

  return element;
}
