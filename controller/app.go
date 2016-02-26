package controller

import (
	"fmt"
	"github.com/eaciit/knot/knot.v1"
	"os"
)

type App struct {
	Server *knot.Server
}

var (
	LayoutFile   string   = "views/layout.html"
	IncludeFiles []string = []string{"views/_head.html", "views/_loader.html", "views/page-servers.html", "views/page-databrowserdesign.html"}
	AppBasePath  string   = func(dir string, err error) string { return dir }(os.Getwd())
	EC_APP_PATH  string   = os.Getenv("EC_APP_PATH")
	EC_DATA_PATH string   = os.Getenv("EC_DATA_PATH")
)

func init() {
	fmt.Println("Base Path ===> ", AppBasePath)

	if EC_APP_PATH != "" {
		fmt.Println("EC_APP_PATH ===> ", EC_APP_PATH)
	}
	if EC_DATA_PATH != "" {
		fmt.Println("EC_DATA_PATH ===> ", EC_DATA_PATH)
	}
}
