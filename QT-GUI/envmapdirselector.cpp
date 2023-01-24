#include "envmapdirselector.h"
#include <QFileDialog>

EnvMapDirSelector::EnvMapDirSelector(QWidget *&widget) : QLineEdit(widget)
{

}

EnvMapDirSelector::EnvMapDirSelector()
{

}

void EnvMapDirSelector::mousePressEvent(QMouseEvent *event)
{
    QFileDialog dialog(this);
    dialog.setFileMode(QFileDialog::Directory);

    if (dialog.exec())
    {
        auto fileName = dialog.selectedFiles()[0];
        setText(fileName);
    }
    else
    {
        setText("Wybierz folder...");
    }
}
