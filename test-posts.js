const { getSortedPostsData } = require('./src/lib/posts');

try {
    const posts = getSortedPostsData();
    console.log('Posts:', posts);
} catch (error) {
    console.error('Error fetching posts:', error);
}
