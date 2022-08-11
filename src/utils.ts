export const parseTitle = (url: string): string => {
    const regex = /problems\/([^\/]+)\/*/;
    const match = url.match(regex);
    let title = '';
    if (match) {
        // clean up the title
        title = match[1]!;
        // remove dashes
        title = title.replace(/-/g, ' ');
        // capitalize first letters
        title = title.split(' ').map(word => word[0]!.toUpperCase() + word.slice(1)).join(' ');
    }
    return title;
}