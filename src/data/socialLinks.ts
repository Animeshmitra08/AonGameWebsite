import type { ComponentType, SVGProps } from 'react';
import { FacebookIcon, InstagramIcon, LinkedInIcon, YouTubeIcon } from '../components/BrandIcons';

export interface SocialLink {
  name: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

/** Official AonDigicon profiles — shared by the Contact section and the footer. */
export const socialLinks: SocialLink[] = [
  { name: 'Facebook', icon: FacebookIcon, href: 'https://www.facebook.com/aondigicon/' },
  { name: 'Instagram', icon: InstagramIcon, href: 'https://www.instagram.com/aondigicon/' },
  { name: 'LinkedIn', icon: LinkedInIcon, href: 'https://www.linkedin.com/company/aondigicon/' },
  { name: 'YouTube', icon: YouTubeIcon, href: 'https://www.youtube.com/channel/UC_aSAsPkbLN0luQQtGpV1BA/videos' },
];
