export const CHANNEL_NAME = '#ChowPea';

export const BLOCKED_WORDS = [
    'carried',
    'blaming'
];

// Commands will be of the format !command argument where argument is optional
export const REGEX_COMMAND = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);