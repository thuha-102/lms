import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Avatar,
  Box,
  Breadcrumbs,
  Chip,
  Container,
  Divider,
  Link,
  Stack,
  Typography
} from '@mui/material';
import { forumApi } from '../../../api/forum';
import { userApi } from '../../../api/user';
import { BreadcrumbsSeparator } from '../../../components/breadcrumbs-separator';
import { useMounted } from '../../../hooks/use-mounted';
import { usePageView } from '../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { paths } from '../../../paths';
import { ForumComment } from '../../../sections/dashboard/forum/forum-comment';
import { ForumCommentAdd } from '../../../sections/dashboard/forum/forum-comment-add';

const useForumDetail = () => {
  const isMounted = useMounted();
  const [forumDetail, setForumDetail] = useState(null);
  const [comments, setComments] = useState([]);
  const router = useRouter();

  const getForumDetail = useCallback(async () => {
    try {
      if (router.isReady) {
        const forumId = router.query.forumId;
        const response = await forumApi.getForumDetail(forumId);
        console.log(response);
        const userResponse = await userApi.getUser(response.data.userId);
        if (isMounted()) {
          setForumDetail({
            ...response.data, 
            author: {
              avatar: userResponse.data.avatar,
              name: userResponse.data.username
            }
          });

          const commentsInfo = await Promise.all(response.data.statements.map(async r => {
            const userResponse = await userApi.getUser(r.userId);
            return {
              ...r,
              replies: [], 
              authorAvatar: userResponse.data.avatar,
              authorName: userResponse.data.username,
              authorRole: "",
              isLiked: true,
              likes: 12,
            }
          }))

          let commentsWithRep = [];
          let map = new Map();
          commentsInfo.map(c => {
            map.set(c.id, c);
          })
          commentsInfo.map(c => {
            if (c.statementId != null) {
              map.get(c.statementId).replies.push(c);
            } else {
              commentsWithRep.push(c);
            }
          })
          setComments(commentsWithRep);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted,router.isReady]);

  useEffect(() => {
      getForumDetail();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.isReady]);

  return {forumDetail, comments, setComments};
};

const Page = () => {
  const { forumDetail, comments, setComments } = useForumDetail();
  
  usePageView();

  if (!forumDetail) {
    return null;
  }
 
  return (
    <>
      <Head>
        <title>
          Forum: Forum Detail
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={1}>
            <Typography variant="h3">
              Diễn đàn
            </Typography>
            <Breadcrumbs separator={<BreadcrumbsSeparator />}>
              <Link
                color="text.primary"
                component={NextLink}
                href={paths.dashboard.index}
                variant="subtitle2"
              >
                Dashboard
              </Link>
              <Link
                color="text.primary"
                component={NextLink}
                href={paths.dashboard.forum.index}
                variant="subtitle2"
              >
                Diễn đàn
              </Link>
              <Typography
                color="text.secondary"
                variant="subtitle2"
              >
                {forumDetail.title}
              </Typography>
            </Breadcrumbs>
          </Stack>
          <Stack spacing={3}>
            <div style={{marginTop: 10}}>
             {forumDetail.label.map((l, index) => <Chip key={index} label={l} sx={{mr: 1, mb: 1}} />)}
            </div>
            <Typography variant="h3">
              {forumDetail.title}
            </Typography>
            <Typography
              color="text.secondary"
              variant="subtitle1"
            >
              {forumDetail.shortDescription}
            </Typography>
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
              sx={{ mt: 3 }}
            >
              <Avatar src={forumDetail.author.avatar} />
              <div>
                <Typography variant="subtitle2">
                  Đăng bởi
                  {' '}
                  {forumDetail.author.name}
                  {' '}
                  •
                  {' '}
                  {forumDetail.createdAt}
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  {forumDetail.readTimes} lượt đọc
                </Typography>
              </div>
            </Stack>
            {forumDetail.updatedAt !== forumDetail.createdAt && 
              <Typography
                variant="body2"
                color="text.secondary"
                sx ={{ fontStyle: 'italic' }}
              >
                • Cập nhật lần cuối {forumDetail.updatedAt}
              </Typography>
            }
          </Stack>
          {forumDetail.coverImageType && <Box
            sx={{
              backgroundImage: `url(${process.env.NEXT_PUBLIC_SERVER_API}/forumImages/${forumDetail.id}${forumDetail.coverImageType})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              borderRadius: 1,
              height: 380,
              mt: 3
            }}
          />}
          {forumDetail.content && (
            <Container sx={{ py: 3 }}>
              <Typography dangerouslySetInnerHTML={{__html: forumDetail.content}}></Typography>
            </Container>
          )}
          <Divider sx={{ my: 3 }} />
          <Stack spacing={2}>
            {comments.map((comment) => (
              <ForumComment
                key={comment.id}
                {...comment} 
              />
            ))}
          </Stack>
          <Divider sx={{ my: 3 }} />
          <ForumCommentAdd forumId={forumDetail.id} statementId={null} setComments={setComments}/>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
