import React, {Component} from 'react'
import {Flex, WingBlank, WhiteSpace, Toast} from 'antd-mobile'
import * as Yup from 'yup'

import {Link} from 'react-router-dom'

import {Form, Field, ErrorMessage, withFormik} from 'formik'

import {API, setToken} from '../../utils'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  // state = {
  //   username: 'test2',
  //   password: 'test2'
  // }

  handleValue = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = async e => {
    e.preventDefault()
    const {username, password} = this.state
    const res = await API.post('/user/login', {
      username,
      password
    })
    console.log(res)
    if (res.data.status === 200) {
      console.log()
      setToken(res.data.body.token)
      this.props.history.go(-1)
    }
  }

  render() {
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size="xl" />
        {/* 登录表单 */}
        <WingBlank>
          <Form>
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name="username"
                placeholder="请输入账号"
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* {errors.username && touched.username ? (
              <div className={styles.error}>{errors.username}</div>
            ) : null} */}
            <ErrorMessage
              name="username"
              component="div"
              className={styles.error}
            />

            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                // onChange={}
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            <ErrorMessage
              name="password"
              component="div"
              className={styles.error}
            />
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formSubmit}>
              <button
                className={styles.submit}
                type="submit"
                // onClick={() => handleSubmit(values)}
              >
                登 录
              </button>
            </div>
          </Form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

// 表单验证规则
// console.log(Yup)
const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .required('请输入用户名')
    .matches(REG_UNAME, '长度为5到8位，只能出现数字、字母、下划线'),
  password: Yup.string()
    .required('请输入密码')
    .matches(REG_PWD, '长度为5到12位，只能出现数字、字母、下划线')
})

Login = withFormik({
  mapPropsToValues: () => ({username: '', password: ''}),
  handleSubmit: async (value, {props}) => {
    console.log('提交事件', value)
    const res = await API.post('/user/login', value)
    if (res.data.status === 200) {
      setToken(res.data.body.token)
      props.history.location.state &&
        props.history.replace(props.history.location.state.from)
      props.history.go(-1)
    } else {
      Toast.info('账号或密码错误')
    }
  },
  validationSchema: SignupSchema
})(Login)

export default Login
