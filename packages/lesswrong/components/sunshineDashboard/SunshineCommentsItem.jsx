import { Components, registerComponent, withEdit, withCurrentUser } from 'meteor/vulcan:core';
import React, { Component } from 'react';
import { Comments, Posts } from 'meteor/example-forum';
import Users from 'meteor/vulcan:users';
import { Link } from 'react-router'
import FontIcon from 'material-ui/FontIcon';
import moment from 'moment';

class SunshineCommentsItem extends Component {

  handleReview = () => {
    const { currentUser, comment, editMutation } = this.props
    editMutation({
      documentId: comment._id,
      set: {reviewedByUserId : currentUser._id},
      unset: {}
    })
  }

  handleDelete = () => {
    const { currentUser, comment, editMutation } = this.props
    if (confirm("Are you sure you want to immediately delete this comment?")) {
      editMutation({
        documentId: comment._id,
        set: {
          deleted: true,
          deletedDate: new Date(),
          deletedByUserId: currentUser._id,
          deletedReason: "spam"
        },
        unset: {}
      })
    }
  }

  render () {
    const comment = this.props.comment
    let commentExcerpt = comment.body.substring(0,40).split("\n\n");
    if (comment) {
      return (
        <div className="sunshine-sidebar-posts-item new-comment">
          { commentExcerpt }
          <div className="sunshine-sidebar-content-hoverover">
            <Link to={Posts.getPageUrl(comment.post) + "#" + comment._id}>
              on <strong>{ comment.post.title }</strong>
            </Link>
            <div dangerouslySetInnerHTML={{__html:comment.htmlBody}} />
          </div>
          <div className="sunshine-sidebar-posts-meta">
            <Link
              className="sunshine-sidebar-posts-author"
              to={Users.getProfileUrl(comment.user)}>
                {comment.user.displayName}
            </Link>
            <div className="posts-item-vote">
              <Components.Vote
                collection={Comments}
                document={comment}
                currentUser={this.props.currentUser}/>
            </div>
            { comment.post && (
              <Link to={Posts.getPageUrl(comment.post) + "#" + comment._id}>
                {moment(new Date(comment.postedAt)).fromNow()}
                <FontIcon className="material-icons comments-item-permalink"> link </FontIcon>
              </Link>
            )}
          </div>
          <div className="sunshine-sidebar-posts-actions new-comment">
            <Link
              className="sunshine-sidebar-posts-action new-comment clear"
              target="_blank"
              title="Spam/Eugin (delete immediately)"
              to={Users.getProfileUrl(comment.user)}
              onTouchTap={this.handleDelete}>
                <FontIcon
                  style={{fontSize: "18px", color:"rgba(0,0,0,.25)"}}
                  className="material-icons">
                    clear
                </FontIcon>
                <div className="sunshine-sidebar-posts-item-delete-overlay">

                </div>
            </Link>
            <span
              className="sunshine-sidebar-posts-action new-comment review"
              title="Approve"
              onTouchTap={this.handleReview}>
              <FontIcon
                style={{fontSize: "18px", color:"rgba(0,0,0,.25)"}}
                className="material-icons">
                  done
              </FontIcon>
            </span>
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}

const withEditOptions = {
  collection: Comments,
  fragmentName: 'SelectCommentsList',
}
registerComponent('SunshineCommentsItem', SunshineCommentsItem, [withEdit, withEditOptions], withCurrentUser);