import '@babel/polyfill'
import { AppRegistry } from "react-native"
import Router from "./Router"

AppRegistry.registerComponent("publish", () => Router)
AppRegistry.runApplication("publish", {
  rootTag: document.getElementById("root")
})