#ifndef ENVMAPDIRSELECTOR_H
#define ENVMAPDIRSELECTOR_H

#include <QLineEdit>

class EnvMapDirSelector : public QLineEdit
{
public:
    EnvMapDirSelector(QWidget*& widget);
    EnvMapDirSelector();

protected:
    void mousePressEvent(QMouseEvent* event);
};

#endif // ENVMAPDIRSELECTOR_H
