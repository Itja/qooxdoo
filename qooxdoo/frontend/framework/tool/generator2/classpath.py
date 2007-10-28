import os, re
from modules import config, filetool

def getClasses(paths, console, encoding="utf-8"):
    classes = {}

    console.info("Scanning class paths...")
    console.indent()
    
    for path in paths:
        _addClassPath(classes, path, console, encoding)

    console.outdent()
    console.debug("")
    
    return classes


def _addClassPath(classes, classPath, console, encoding):
    console.debug("Scanning: %s" % classPath)

    implCounter = 0
    docCounter = 0
    localeCounter = 0

    for root, dirs, files in os.walk(classPath):

        # Filter ignored directories
        for ignoredDir in config.DIRIGNORE:
            if ignoredDir in dirs:
                dirs.remove(ignoredDir)

        # Searching for files
        for fileName in files:
            if os.path.splitext(fileName)[1] == config.JSEXT and not fileName.startswith("."):
                filePath = os.path.join(root, fileName)
                filePathId = filePath.replace(classPath + os.sep, "").replace(config.JSEXT, "").replace(os.sep, ".")
                fileContent = filetool.read(filePath, encoding)
                fileCategory = "unknown"

                if fileName == "__init__.js":
                    fileContentId = filePathId
                    fileCategory = "qx.doc"
                    docCounter += 1

                else:
                    fileContentId = _extractQxClassContentId(fileContent)

                    if fileContentId == None:
                        fileContentId = _extractQxLocaleContentId(fileContent)

                        if fileContentId != None:
                            fileCategory = "qx.locale"
                            localeCounter += 1

                    else:
                        fileCategory = "qx.impl"
                        implCounter += 1

                    if filePathId != fileContentId:
                        console.error("    - Mismatching IDs in file: %s" % filePath)
                        console.error("      Detail: %s != %s" % (filePathId, fileContentId))

                if fileCategory == "unknown":
                    console.error("    - Invalid file: %s" % filePath)
                    sys.exit(1)

                fileId = filePathId

                classes[fileId] = {
                    "path" : filePath,
                    "encoding" : encoding,
                    "classPath" : classPath,
                    "category" : fileCategory,
                    "id" : fileId,
                    "contentId" : fileContentId,
                    "pathId" : filePathId
                }

    console.indent()
    console.debug("Found: %s impl, %s doc, %s locale" % (implCounter, docCounter, localeCounter))
    console.outdent()


def _extractQxClassContentId(data):
    classDefine = re.compile('qx.(Bootstrap|List|Class|Mixin|Interface|Theme).define\s*\(\s*["\']([\.a-zA-Z0-9_-]+)["\']?', re.M)

    for item in classDefine.findall(data):
        return item[1]

    return None


def _extractQxLocaleContentId(data):
    # 0.8 style
    localeDefine = re.compile('qx.Locale.define\s*\(\s*["\']([\.a-zA-Z0-9_-]+)["\']?', re.M)

    for item in localeDefine.findall(data):
        return item

    # 0.7.x compat
    localeDefine = re.compile('qx.locale.Locale.define\s*\(\s*["\']([\.a-zA-Z0-9_-]+)["\']?', re.M)

    for item in localeDefine.findall(data):
        return item

    return None