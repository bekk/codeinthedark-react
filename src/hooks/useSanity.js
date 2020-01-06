const React = require('react');
const sanityClient = require('@sanity/client');

const client = sanityClient({
    dataset: 'production',
    projectId: 'an0jzjry',
    useCdn: true, // `false` if you want to ensure fresh data
});

export const useSanity = query => {
    const [content, setContent] = React.useState([]);

    React.useEffect(() => {
        client.fetch(query).then(fetchedContent => {
            setContent(fetchedContent);
        });
    }, []);

    return content;
};
