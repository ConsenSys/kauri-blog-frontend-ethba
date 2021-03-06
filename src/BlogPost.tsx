import React from 'react'
import { Query } from 'react-apollo'
import { withStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import { Link } from 'react-router-dom'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import ShareIcon from '@material-ui/icons/Share'
import Typography from '@material-ui/core/Typography'
import red from '@material-ui/core/colors/red'
import styled from 'styled-components'
import Comments from './Comments'
import { getBlogPost } from './queries'
import { getBlogPostQuery, getBlogPostQueryVariables } from './__generated__/types'
import MarkdownShortcuts from './MarkdownEditor'
import TipDialog from './TipDialog'

const styles = theme => ({
  card: {
    height: '100vh',
    overflowY: 'scroll'
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
    margin: '20px 0'
  },
  actions: {
    display: 'flex'
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    }),
    marginLeft: 'auto'
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  avatar: {
    backgroundColor: red[500]
  },
  shortContent: {
    textAlign: 'left'
  },
  headline: {
    textAlign: 'left'
  },
  date: {
    textAlign: 'left'
  },
  share: {
    marginLeft: 'auto',
    color: '#1976d2'
  }
})

export const Date = styled.div`
  font-family: Roboto-Medium;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.87);
  margin-left: 2px;
  letter-spacing: 2px;
  line-height: 16px;
  text-align: left;
`

const ViewLink = styled(Link)`
  /* Button: */
  font-family: Roboto-Medium;
  font-size: 14px;
  color: #1976d2;
  letter-spacing: 1.25px;
  text-align: center;
  line-height: 16px;
  text-transform: uppercase;
  text-decoration: none;
  :nth-child(2) {
    margin-left: 30px;
  }
  :first-child {
    margin-left: 13px;
  }
`

const ViewTip = styled.a`
  /* Button: */
  font-family: Roboto-Medium;
  font-size: 14px;
  color: #1976d2;
  letter-spacing: 1.25px;
  text-align: center;
  line-height: 16px;
  text-transform: uppercase;
  text-decoration: none;
  color: #1976d2;
  :nth-child(2) {
    margin-left: 30px;
  }
  :first-child {
    margin-left: 13px;
  }
`

class GetBlogPostComponent extends Query<getBlogPostQuery> {}

class PostCard extends React.Component {
  state = {
    open: false
  }

  handleClickOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render() {
    const {
      classes,
      match: {
        params: { id }
      }
    } = this.props
    return (
      <GetBlogPostComponent
        query={getBlogPost}
        variables={{
          id
        }}
      >
        {({ data, loading, error }) => {
          if (loading) return <p>loading...</p>
          if (error) return <p>Error</p>
          const { getBlogPost } = data
          if (!getBlogPost) return <p>No data</p>

          if (getBlogPost) {
            return (
              <Card className={classes.card}>
                <TipDialog
                  handleClickOpen={this.handleClickOpen}
                  handleClose={this.handleClose}
                  open={this.state.open}
                  id={id}
                  author={getBlogPost.user}
                />
                <CardHeader
                  avatar={
                    <Avatar aria-label="Recipe" className={classes.avatar}>
                      {getBlogPost.user.charAt(0)}
                    </Avatar>
                  }
                  action={<IconButton />}
                  title={
                    <Typography variant="headline" component="h2" className={classes.headline}>
                      {getBlogPost.title}
                    </Typography>
                  }
                  subheader={
                    <div>
                      <Date>{getBlogPost.dateUpdated}</Date>
                      <Date>{global.window && window.web3.fromWei(getBlogPost.totalTips, 'ether')} ETH tipped</Date>
                    </div>
                  }
                />
                <CardContent>
                  <MarkdownShortcuts content={getBlogPost.content} />
                  {/* <CardMedia
                className={classes.media}
                image=" https://material-ui.com/static/images/cards/contemplative-reptile.jpg"
                title="Contemplative Reptile"
              /> */}
                  {/* <Typography className={classes.shortContent} component="p">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Provident cupiditate quasi non quibusdam
                quisquam reprehenderit nulla alias similique! Corporis quia voluptatem vel maxime ipsa sequi ipsum
                doloremque tempora quisquam ducimus.
              </Typography> */}
                </CardContent>
                <CardActions>
                  <ViewTip onClick={this.handleClickOpen}>Tip Post</ViewTip>
                  <ViewLink to={`/profile/${getBlogPost.user}`}>View Profile</ViewLink>
                  <IconButton className={classes.share} aria-label="Share">
                    <ShareIcon />
                  </IconButton>
                </CardActions>
                <Comments />
              </Card>
            )
          }
        }}
      </GetBlogPostComponent>
    )
  }
}

export default withStyles(styles)(PostCard)
