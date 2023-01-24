#include "trak_mainwindow.h"
#include "./ui_trak_mainwindow.h"
#include <QMessageBox>
#include <stdlib.h>
#include <QDir>

TRAK_MainWindow::TRAK_MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::TRAK_MainWindow)
{
    ui->setupUi(this);
}

TRAK_MainWindow::~TRAK_MainWindow()
{
    delete ui;
}


void TRAK_MainWindow::on_pushButton_released()
{
    QString binningString = getBinningParameterString();
    QString reflectionsNumString = getReflectionsNumParameterString();

    if (reflectionsNumString.isEmpty())
    {
        QMessageBox msgBox;
        msgBox.setText("Liczba odbić musi być w przedziale <0; 10>");
        msgBox.exec();
        return;
    }

    QString lightColorString = getLightColorParameterString();

    QString systemCallCommand = prepareSystemCallCommand(binningString, reflectionsNumString, lightColorString);
    system(systemCallCommand.toStdString().c_str());
}


void TRAK_MainWindow::on_NumOfReflectionsSlider_valueChanged(int value)
{
    auto valueString = QString::number(value);
    ui->NumOfReflectionsLabel->setText(valueString);
}


QString TRAK_MainWindow::sliderValueToQString(int value)
{
    if (value == 0.0)
    {
        return "0.00";
    }
    else if (value == 20.0)
    {
        return "1.00";
    }
    float valueF = static_cast<float>(value) * 0.05;
    auto valueS = QString::number(valueF);

    if (fmod(valueF, 0.1) < 0.001)
    {
        valueS += "0";
    }

    return valueS;
}

void TRAK_MainWindow::showBinningTable()
{
    toggleBinningTable(true);
	
	ui->color_400_label->setText("400");
	ui->color_430_label->setText("430");
	ui->color_460_label->setText("460");
	
	ui->table_header_left_label->setText("Długość fali [nm]");
}

void TRAK_MainWindow::showNonBinningTable()
{
    toggleBinningTable(false);
	
	ui->color_400_label->setText("R");
	ui->color_430_label->setText("G");
	ui->color_460_label->setText("B");

    ui->table_header_left_label->setText("Kolor RGB");
}

void TRAK_MainWindow::toggleBinningTable(bool show)
{
    ui->color_670_valueSlider->setVisible(show);
    ui->color_640_valueSlider->setVisible(show);
    ui->color_610_valueSlider->setVisible(show);
    ui->color_580_valueSlider->setVisible(show);
    ui->color_550_valueSlider->setVisible(show);
    ui->color_520_valueSlider->setVisible(show);
    ui->color_490_valueSlider->setVisible(show);

    ui->color_670_valueLabel->setVisible(show);
    ui->color_640_valueLabel->setVisible(show);
    ui->color_610_valueLabel->setVisible(show);
    ui->color_580_valueLabel->setVisible(show);
    ui->color_550_valueLabel->setVisible(show);
    ui->color_520_valueLabel->setVisible(show);
    ui->color_490_valueLabel->setVisible(show);

    ui->color_670_label->setVisible(show);
    ui->color_640_label->setVisible(show);
    ui->color_610_label->setVisible(show);
    ui->color_580_label->setVisible(show);
    ui->color_550_label->setVisible(show);
    ui->color_520_label->setVisible(show);
    ui->color_490_label->setVisible(show);
}

QString TRAK_MainWindow::getBinningParameterString()
{
    bool binning = ui->binningCheckBox->isChecked();
    QString binningString = " --use_binning=";
    if (binning)
    {
        binningString += "True";
    }
    else
    {
        binningString += "False";
    }

    return binningString;
}

QString TRAK_MainWindow::getReflectionsNumParameterString()
{
    int reflections_num = ui->NumOfReflectionsSlider->value();
    if (reflections_num < 0 || reflections_num > 10)
    {
        return QString("");
    }
    QString reflections_num_string = " --reflections_num=" + QString::number(reflections_num);
    return reflections_num_string;
}

QString TRAK_MainWindow::getLightColorParameterString()
{
    bool binning = ui->binningCheckBox->isChecked();
    QString color400String = sliderValueToQString(ui->color_400_valueSlider->value());
    QString color430String = sliderValueToQString(ui->color_430_valueSlider->value());
    QString color460String = sliderValueToQString(ui->color_460_valueSlider->value());
    QString color490String = sliderValueToQString(ui->color_490_valueSlider->value());
    QString color520String = sliderValueToQString(ui->color_520_valueSlider->value());
    QString color550String = sliderValueToQString(ui->color_550_valueSlider->value());
    QString color580String = sliderValueToQString(ui->color_580_valueSlider->value());
    QString color610String = sliderValueToQString(ui->color_610_valueSlider->value());
    QString color640String = sliderValueToQString(ui->color_640_valueSlider->value());
    QString color670String = sliderValueToQString(ui->color_670_valueSlider->value());

    QString lightColorString = " --light_color=";
    lightColorString += color400String + ",";
    lightColorString += color430String + ",";
    lightColorString += color460String;
    if (binning)
    {
        lightColorString += ",";
        lightColorString += color490String + ",";
        lightColorString += color520String + ",";
        lightColorString += color550String + ",";
        lightColorString += color580String + ",";
        lightColorString += color610String + ",";
        lightColorString += color640String + ",";
        lightColorString += color670String;
    }

    return lightColorString;
}

QString TRAK_MainWindow::prepareSystemCallCommand(QString &binning, QString &reflectionsNum, QString &lightColor)
{
    QString systemCallCommand = "python " + QDir::currentPath() + "/simple-rt/src/main.py";
    systemCallCommand += binning;
    systemCallCommand += reflectionsNum;
    systemCallCommand += lightColor;
    return systemCallCommand;
}



void TRAK_MainWindow::on_color_400_valueSlider_valueChanged(int value)
{
    ui->color_400_valueLabel->setText(sliderValueToQString(value));
}


void TRAK_MainWindow::on_color_430_valueSlider_valueChanged(int value)
{
    ui->color_430_valueLabel->setText(sliderValueToQString(value));

}


void TRAK_MainWindow::on_color_460_valueSlider_valueChanged(int value)
{
    ui->color_460_valueLabel->setText(sliderValueToQString(value));

}


void TRAK_MainWindow::on_color_490_valueSlider_valueChanged(int value)
{
    ui->color_490_valueLabel->setText(sliderValueToQString(value));

}


void TRAK_MainWindow::on_color_520_valueSlider_valueChanged(int value)
{
    ui->color_520_valueLabel->setText(sliderValueToQString(value));

}


void TRAK_MainWindow::on_color_550_valueSlider_valueChanged(int value)
{
    ui->color_550_valueLabel->setText(sliderValueToQString(value));

}


void TRAK_MainWindow::on_color_580_valueSlider_valueChanged(int value)
{
    ui->color_580_valueLabel->setText(sliderValueToQString(value));

}


void TRAK_MainWindow::on_color_610_valueSlider_valueChanged(int value)
{
    ui->color_610_valueLabel->setText(sliderValueToQString(value));

}


void TRAK_MainWindow::on_color_640_valueSlider_valueChanged(int value)
{
    ui->color_640_valueLabel->setText(sliderValueToQString(value));

}


void TRAK_MainWindow::on_color_670_valueSlider_valueChanged(int value)
{
    ui->color_670_valueLabel->setText(sliderValueToQString(value));

}



void TRAK_MainWindow::on_binningCheckBox_stateChanged(int arg1)
{
    if (arg1 == Qt::Checked)
    {
        showBinningTable();
    }
    else
    {
        showNonBinningTable();
    }
}

