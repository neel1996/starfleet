pipeline {
  agent any
  stages {
    stage('checkout') {
      steps {
        git(url: 'https://github.com/neel1996/starfleet.git', branch: 'master')
      }
    },
    stage('install deps') {
      steps{
        sh "npm install"
      }
    }
  }
}