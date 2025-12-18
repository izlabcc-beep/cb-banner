export type ThemeId = 'white' | 'blue' | 'black';

export interface ThemeConfig {
    id: ThemeId;
    name: string;
    backgroundStart: string;
    backgroundEnd: string;
    titleColor: string;
    subtitleColor: string;
    subtitleBackgroundColor: string;
    subtitleColorOnBackground: string;
    titleColorOnSubtitleBackground: string; // New field for title color when subtitle background is active
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
    white: {
        id: 'white',
        name: 'Белый',
        backgroundStart: '#E8E8E8',
        backgroundEnd: '#FFFFFF',
        titleColor: '#000000',
        subtitleColor: '#0065FF',
        subtitleBackgroundColor: '#0065FF',
        subtitleColorOnBackground: '#FFFFFF',
        titleColorOnSubtitleBackground: '#FFFFFF',
    },
    blue: {
        id: 'blue',
        name: 'Синий',
        backgroundStart: '#0065FF',
        backgroundEnd: '#61A4FF',
        titleColor: '#FFFFFF',
        subtitleColor: '#BFFF44',
        subtitleBackgroundColor: '#BFFF44',
        subtitleColorOnBackground: '#000000',
        titleColorOnSubtitleBackground: '#000000',
    },
    black: {
        id: 'black',
        name: 'Черный',
        backgroundStart: '#010205',
        backgroundEnd: '#433100',
        titleColor: '#FFFFFF',
        subtitleColor: '#E0A500',
        subtitleBackgroundColor: '#E0A500',
        subtitleColorOnBackground: '#000000',
        titleColorOnSubtitleBackground: '#000000',
    },
};
